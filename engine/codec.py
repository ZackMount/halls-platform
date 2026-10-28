"""HALLS .hproof decoder. Authenticate before decompressing or parsing records."""
import hashlib, json, math, struct, time, os
from array import array
from pathlib import Path
from geometry import exit_bounds,in_exit
from validation import ProofError,STAGES,checking
from timing import summarize
from layout import LAYOUTS
from exits import exit_events,valid_cell
from cryptography.exceptions import InvalidSignature,InvalidTag
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, padding, utils, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT=Path(__file__).resolve().parent
MAX_PLAIN=int(os.environ.get('HALLS_MAX_PLAIN_MB','256'))*1024*1024
MAX_FRAMES=int(os.environ.get('HALLS_MAX_FRAMES','900000'))
MAX_UPLOAD=64*1024*1024
PROCESS_SECONDS=30

def decompress(data, size):
    if not 64 < size <= MAX_PLAIN:raise ProofError('Invalid decompressed size')
    out=bytearray();at=0;deadline=time.monotonic()+PROCESS_SECONDS;checkpoint=0
    while len(out)<size:
        if len(out)>=checkpoint:
            if time.monotonic()>deadline:raise ProofError("Import processing time limit exceeded",code="processing_limit",status=413)
            checkpoint=len(out)+65536
        if at>=len(data):raise ProofError('Truncated compression group')
        flags=data[at];at+=1
        for bit in range(8):
            if len(out)==size:
                if flags>>bit:raise ProofError('Noncanonical compression flags')
                break
            if flags&(1<<bit):
                if at+2>len(data):raise ProofError('Truncated back reference')
                token=int.from_bytes(data[at:at+2],'little');at+=2
                distance=(token>>5)+1;length=(token&31)+3
                if distance>len(out) or len(out)+length>size:raise ProofError('Invalid back reference')
                # Overlapping references repeat the existing source period (at most 34 bytes).
                start=len(out)-distance;chunk=out[start:start+length]
                if distance<length:chunk=(chunk*((length+distance-1)//distance))[:length]
                out.extend(chunk)
            else:
                if at>=len(data):raise ProofError('Truncated literal')
                out.append(data[at]);at+=1
    if at!=len(data):raise ProofError('Trailing compressed bytes')
    return bytes(out)

def authenticate(data, key_path=None, trust_path=None):
    checks={stage:'not_run' for stage in STAGES}
    with checking('envelope',checks):
        if len(data)<308 or len(data)>MAX_UPLOAD or data[:8]!=b'HLPF\x01\r\n\x1a':raise ProofError('Not a supported HALLS proof')
        plain_len,packed_len=struct.unpack_from('<II',data,28)
        if not 64<plain_len<=MAX_PLAIN or not packed_len or packed_len!=len(data)-308:raise ProofError('Invalid envelope length')
    data=bytes(data)
    try:
        trust=json.loads(Path(trust_path or os.environ.get('HALLS_TRUST') or ROOT/'trust.json').read_text())
        private=serialization.load_pem_private_key(Path(key_path or ROOT/'keys/recipient.pem').read_bytes(),password=None)
        public=ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(),bytes.fromhex(trust['signing_public']))
        if not isinstance(private,rsa.RSAPrivateKey) or private.key_size!=2048:raise ValueError('key size')
        expected_key_id=bytes.fromhex(trust['key_id'])
        if len(expected_key_id)!=8:raise ValueError('key id')
        numbers=public.public_numbers();recipient=private.public_key().public_numbers()
        actual_key_id=hashlib.sha256(numbers.x.to_bytes(32,'big')+numbers.y.to_bytes(32,'big')+recipient.n.to_bytes(256,'big')).digest()[:8]
        if actual_key_id!=expected_key_id:raise ValueError('key set mismatch')
    except (OSError,ValueError,TypeError,KeyError,AttributeError) as exc:
        error=ProofError('Organizer key configuration is invalid','configuration',status=503);error.checks=checks.copy();raise error from exc
    with checking('envelope',checks):
        if data[8:16]!=expected_key_id:raise ProofError('Unknown signing/encryption key set')
    with checking('authentication',checks):
        try:
            key=private.decrypt(data[36:292],padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),algorithm=hashes.SHA256(),label=None))
            if len(key)!=32:raise ValueError('AES key length')
            packed=AESGCM(key).decrypt(data[16:28],data[308:]+data[292:308],data[:292])
        except (ValueError,InvalidTag) as exc:raise ProofError('Decryption/authentication failed') from exc
    with checking('compression',checks):signed=decompress(packed,plain_len)
    raw,signature=signed[:-64],signed[-64:]
    with checking('signature',checks):
        try:
            r,s=int.from_bytes(signature[:32],'big'),int.from_bytes(signature[32:],'big')
            public.verify(utils.encode_dss_signature(r,s),raw,ec.ECDSA(hashes.SHA256()))
        except InvalidSignature as exc:raise ProofError('Client signature is invalid') from exc
    return raw,{'signature':'valid','encryption':'AES-256-GCM / RSA-2048-OAEP-SHA256','keyId':trust['key_id'],
        'sha256':hashlib.sha256(data).hexdigest(),'fileBytes':len(data),'recordBytes':len(raw),'importChecks':checks}

def parse(raw, auth):
    if raw[:4] in (b'HLR1',b'HLR2',b'HLR3'):raise ProofError('旧版凭证不再支持，请使用 0.10.0 或更新版本重新通关。',code='legacy_format')
    timed=True
    if len(raw)<88 or raw[:4] not in (b'HLR4',b'HLR5'):raise ProofError('Invalid recording header')
    build,width,height,entities,encoding,words,frames=struct.unpack_from('<IHHBBHI',raw,4)
    seed,run_id=struct.unpack_from('<QQ',raw,20)
    exit_x,exit_z=struct.unpack_from('<HH',raw,36)
    tile,ceiling,eye,bitmap_size=struct.unpack_from('<fffI',raw,40)
    layout=LAYOUTS.get(build)
    if layout is None or raw[:4]!=layout.magic or (width,height,entities,words)!=(256,256,layout.entities,layout.record_words) or (encoding&~159 or not encoding&1 or ((encoding>>2)&3)==3):raise ProofError('Unsupported recording layout/build')
    state_words=layout.words
    if not 2<=frames<=MAX_FRAMES or frames*words*4>MAX_PLAIN:raise ProofError('Recording is too large or has no simulation ticks')
    if (tile,ceiling,eye)!=(2.0,struct.unpack('<f',struct.pack('<f',2.65))[0],struct.unpack('<f',struct.pack('<f',1.55))[0]):raise ProofError('Invalid world geometry')
    if bitmap_size!=8192 or not (0<=exit_x<256 and 0<=exit_z<256):raise ProofError('Invalid map metadata')
    if len(raw)<88+entities*8+bitmap_size:raise ProofError('Truncated map header')
    completed_at,utc_offset=struct.unpack_from('<qi',raw,56)
    if not -840<=utc_offset<=840:raise ProofError('Invalid completion timezone offset')
    if not 946684800<=completed_at<=4102444800:raise ProofError('Invalid completion timestamp')
    timing=None
    if timed:
        start_us,end_us,source=struct.unpack_from('<QQI',raw,68)
        if not 946684800000000<=start_us<=4102444800000000 or not 946684800000000<=end_us<=4102444800000000:raise ProofError('Invalid clock timestamp')
        timing={'startedAtUs':start_us,'finishedAtUs':end_us,'source':source}
    at=88
    form_seeds=[str(struct.unpack_from('<Q',raw,at+i*8)[0]) for i in range(entities)];at+=entities*8
    if at+bitmap_size>len(raw):raise ProofError('Truncated bitmap')
    bitmap=raw[at:at+bitmap_size];at+=bitmap_size
    def wall(x,z):
        if not (0<=x<256 and 0<=z<256):return True
        i=z*256+x;return bool(bitmap[i>>3]&(1<<(i&7)))

    if len(raw)-at<frames*((words+7)//8):raise ProofError('Impossible frame count for payload')
    previous=[0]*words;flat=array('I');clocks=array('Q');battery=array('I');exits=array('I');exit_valid=True;elapsed=0.;violations=[];last=None;violation_count=0;playback_safe=True;deadline=time.monotonic()+PROCESS_SECONDS
    numeric=[i for i in range(state_words) if i not in (1,23) and not(i>=24 and (i-24)%12==11)]
    def flag(message,tick):
        nonlocal violation_count
        violation_count+=1
        if len(violations)<40:violations.append({'tick':tick,'message':message})
    if any(not wall(x,z) for x in range(256) for z in (0,255)) or any(not wall(x,z) for z in range(256) for x in (0,255)) or wall(exit_x,exit_z):flag('Map boundary/exit is invalid',0)
    for tick in range(frames):
        if tick%1024==0 and time.monotonic()>deadline:raise ProofError("Import processing time limit exceeded",code="processing_limit",status=413)
        for start in range(0,words,8):
            if at>=len(raw):raise ProofError('Truncated tick mask')
            mask=raw[at];at+=1
            if mask>>min(8,words-start):raise ProofError('Invalid tick mask padding')
            for bit in range(min(8,words-start)):
                if mask&(1<<bit):
                    delta=0
                    for shift in range(0,35,7):
                        if at>=len(raw):raise ProofError('Truncated tick delta')
                        b=raw[at];at+=1
                        if shift==28 and b>15:raise ProofError('Invalid 32-bit delta')
                        delta|=(b&127)<<shift
                        if b<128:
                            if shift and b==0:raise ProofError("Noncanonical tick delta")
                            break
                    else:raise ProofError('Oversized tick delta')
                    if delta==0:raise ProofError('Noncanonical zero delta')
                    previous[start+bit]^=delta
        blob=struct.pack(f'<{state_words}I',*previous[:state_words]);values=struct.unpack(f'<{state_words}f',blob)
        if timed:clocks.extend(previous[k]|previous[k+1]<<32 for k in range(state_words+3,state_words+13,2))
        if layout.exit_words:
            current_exit=previous[layout.exit_offset:layout.exit_offset+2];exits.extend(current_exit)
            if not valid_cell(current_exit):
                flag('Recorded exit cell is outside map bounds',tick);playback_safe=False;exit_valid=False
        if not all(math.isfinite(values[i]) and abs(values[i])<=1e9 for i in numeric):raise ProofError('Motion value outside safe numeric encoding range')
        charge,age,wanted=struct.unpack('<ffI',struct.pack('<3I',*previous[state_words:state_words+3]))
        if not all(math.isfinite(v) and abs(v)<=1e9 for v in (charge,age)) or wanted not in (0,1):raise ProofError('Invalid battery state encoding')
        battery.extend(previous[state_words:state_words+3])
        if not (0<=charge<=100 and 0<=age<=(3 if build==0xa0000 else 100.1)):flag('Battery state outside normal range',tick)
        dt=values[0]
        if not (dt==0 if tick==0 else 0<=dt<=.050001):flag('Invalid tick duration',tick)
        if dt<0 or (tick and dt==0 and not timed) or dt>.050001:playback_safe=False
        elapsed+=max(0,dt)
        x,y,z,yaw,pitch,distance=values[6:12];health=values[19];flags=previous[23]
        if not (0<=x<512 and 0<=z<512 and 0<=values[12]<512 and 0<=values[14]<512 and -.5<=values[13]<=ceiling+1 and abs(values[15])<=math.tau+.2 and abs(values[16])<=1.5 and abs(values[17])<=1 and .35<=values[18]<=2.8):playback_safe=False
        if previous[1]&~2047 or flags&~3:raise ProofError('Unknown state flags')
        if not (0<=x<512 and 0<=z<512 and -1.101<=pitch<=1.101 and 0<=health<=100):flag('Invalid player state',tick)
        if wall(int(x/tile),int(z/tile)):flag('Player inside a wall',tick)
        if abs(y-eye)>.005:flag('Player height differs from the fixed floor',tick)
        if not -0.001<=yaw<=math.tau+.001:flag('Player yaw outside the control range',tick)
        if not(0<=values[20]<=.181 and 0<=values[21]<=.301):flag('Invalid hit reaction state',tick)
        if abs(values[18]-math.radians(80))>.0001:flag('Unexpected camera field of view',tick)
        if tick==0 and (flags or abs(health-100)>.001 or distance!=0):flag('Recording does not start at a fresh run',tick)
        if flags and tick!=frames-1:flag('Terminal state appears before the final tick',tick)
        if last:
            moved=math.hypot(x-last[6],z-last[8]);hit=health<last[19]
            speed=layout.run if previous[1]&256 else layout.walk
            maximum=speed*dt+(0.86 if hit else 0)+.003
            if moved>maximum:flag('Player displacement exceeds movement/knockback bounds',tick)
            if health>last[19] or (hit and abs(last[19]-health-34)>.01 and health!=0):flag('Invalid health transition',tick)
            if math.hypot(values[2],values[3])>speed*dt+.001:flag('Movement input exceeds running speed',tick)
            if abs(values[4])>2*dt+.001 or abs(values[5])>2*dt+.001:flag('Look input exceeds control bounds',tick)
        for e in range(entities):
            k=24+e*12;ex,ez=values[k:k+2]
            if previous[k+11]>3:raise ProofError('Invalid entity enum')
            if not(0<=ex<512 and 0<=ez<512 and 0<=values[k+6]<=100 and previous[k+11]<=3):flag('Invalid entity state',tick)
            if not(0<=ex<512 and 0<=ez<512 and 0<=values[k+4]<=1.001 and 0<=values[k+5]<=.401 and abs(values[k+2])<=math.tau+.2 and 0<=values[k+3]<1e7):playback_safe=False
            if wall(int(ex/tile),int(ez/tile)):flag('Entity inside a wall',tick)
            if last and math.hypot(ex-last[k],ez-last[k+1])>layout.chase*dt+.004:flag('Entity displacement exceeds chase speed',tick)
        flat.extend(previous[:state_words]);last=values
    if at!=len(raw):raise ProofError('Trailing recording bytes')
    final_exit=tuple(exits[-2:]) if layout.exit_words else (exit_x,exit_z)
    if previous[23]!=1 or not last[19]>0 or not valid_cell(final_exit) or not in_exit(last[6],last[8],final_exit,tile):flag('Recording does not end in a living player reaching the exit',frames-1)
    import base64,sys
    spawn_position=[struct.unpack('<f',struct.pack('<I',flat[i]))[0] for i in (6,8)]
    if sys.byteorder!='little':flat.byteswap();clocks.byteswap();battery.byteswap();exits.byteswap()
    meta={**auth,'version':layout.version,'recordingBuild':build,'width':width,'height':height,'entities':entities,'words':state_words,'recordWords':words,'frames':frames,
        'completedAt':completed_at,'utcOffsetMinutes':utc_offset,'rawSha256':hashlib.sha256(raw).hexdigest(),'seed':str(seed),'runId':str(run_id),'exit':[exit_x,exit_z],'exitBounds':exit_bounds((exit_x,exit_z),tile),'tile':tile,'ceiling':ceiling,'eye':eye,
        'formSeeds':form_seeds,'bitmap':base64.b64encode(bitmap).decode(),'duration':elapsed,'simulationDuration':elapsed,'violations':violations,'violationCount':violation_count,'playbackSafe':playback_safe,'spawnPosition':spawn_position,
        'platform':('windows','macos','linux')[(encoding>>2)&3],'architecture':'aarch64' if encoding&16 else 'x86_64','inputMode':'pulse' if encoding&2 else 'held','testFixture':bool(encoding&128),'integrity':'valid','trajectory':'flagged' if violations else 'plausible',
        'trustNote':'离线客户端签名可被逆向提取；签名有效不等于服务器见证的成绩。轨迹检查为合理性检查，不是完整反作弊认证。'}
    meta['battery']={'samples':base64.b64encode(battery.tobytes()).decode()}
    if timing is not None:timing['samples']=base64.b64encode(clocks.tobytes()).decode();meta['timing']=timing
    meta['timeInfo']=summarize(meta);meta['replayDuration']=meta['timeInfo']['duration']
    if not meta['timeInfo']['available']:meta['playbackSafe']=False
    if meta['timeInfo']['available']:meta['duration']=meta['timeInfo']['activeDuration']
    if layout.exit_words:
        meta['exitSamples']={'samples':base64.b64encode(exits.tobytes()).decode(),'encoding':'u32le-pair'}
        meta['exitEvents']=[]
        if exit_valid and meta['timeInfo']['available']:
            try:meta['exitEvents']=exit_events(meta)
            except ValueError:
                flag('Recorded exit changes have ambiguous clock timestamps',0);meta['playbackSafe']=False
        meta['violationCount']=violation_count;meta['trajectory']='flagged' if violation_count else 'plausible'
    return meta,flat.tobytes()

def decode(data,key_path=None,trust_path=None):
    raw,auth=authenticate(data,key_path,trust_path)
    checks=auth['importChecks']
    with checking('format',checks):result=parse(raw,auth)
    return result
