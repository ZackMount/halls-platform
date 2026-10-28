import json,os,struct,sys,tempfile,time,unittest
from unittest.mock import patch
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from codec import decode,ProofError
from cryptography.hazmat.primitives import hashes,serialization
from cryptography.hazmat.primitives.asymmetric import ec,rsa,padding,utils
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
class FormatTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();cls.key=Path(cls.tmp.name)/'key.pem';cls.trust=Path(cls.tmp.name)/'trust.json';cls.signer=ec.generate_private_key(ec.SECP256R1());cls.recipient=rsa.generate_private_key(public_exponent=65537,key_size=2048)
  cls.key.write_bytes(cls.recipient.private_bytes(serialization.Encoding.PEM,serialization.PrivateFormat.PKCS8,serialization.NoEncryption()));n=cls.signer.public_key().public_numbers();cls.kid=__import__('hashlib').sha256(n.x.to_bytes(32,'big')+n.y.to_bytes(32,'big')+cls.recipient.public_key().public_numbers().n.to_bytes(256,'big')).digest()[:8]
  cls.trust.write_text(json.dumps({'key_id':cls.kid.hex(),'signing_public':cls.signer.public_key().public_bytes(serialization.Encoding.X962,serialization.PublicFormat.UncompressedPoint).hex()}))
  cls.raw=b'HLR4'+struct.pack('<IHHBBHIQQHHfffIqiQQI4Q',0xa0000,256,256,4,1,85,2,42,999,2,1,2,2.65,1.55,8192,int(time.time()),480,int(time.time())*1000000,int(time.time())*1000000,1,1,2,3,4)+bytes(8192)+bytes(22)
 def seal(self,raw,bad_signature=False):
  r,s=utils.decode_dss_signature(self.signer.sign(raw,ec.ECDSA(hashes.SHA256())));signed=raw+(bytes(64) if bad_signature else r.to_bytes(32,'big')+s.to_bytes(32,'big'));packed=b''.join(b'\0'+signed[i:i+8] for i in range(0,len(signed),8));key=os.urandom(32);nonce=os.urandom(12);wrapped=self.recipient.public_key().encrypt(key,padding.OAEP(mgf=padding.MGF1(hashes.SHA256()),algorithm=hashes.SHA256(),label=None));head=b'HLPF\1\r\n\x1a'+self.kid+nonce+struct.pack('<II',len(signed),len(packed))+wrapped;encrypted=AESGCM(key).encrypt(nonce,packed,head);return head+encrypted[-16:]+encrypted[:-16]
 def decode(self,data):return decode(data,self.key,self.trust)
 def test_new_timestamp_is_signed_and_exposed(self):
  m,_=self.decode(self.seal(self.raw));self.assertEqual(m['utcOffsetMinutes'],480);self.assertGreater(m['completedAt'],1700000000);self.assertEqual(m['importChecks']['format'],'passed')
 def test_trust_file_can_be_configured_and_explicit_path_takes_precedence(self):
  data=self.seal(self.raw)
  with patch.dict(os.environ,{'HALLS_TRUST':str(self.trust)}):
   self.assertEqual(decode(data,self.key)[0]['utcOffsetMinutes'],480)
  with patch.dict(os.environ,{'HALLS_TRUST':str(self.trust.with_name('missing.json'))}):
   self.assertEqual(decode(data,self.key,self.trust)[0]['utcOffsetMinutes'],480)
   with self.assertRaises(ProofError) as ctx:decode(data,self.key)
   self.assertEqual(ctx.exception.stage,'configuration')
 def health_recording(self,health,freeze_previous=False):
  # Same wire protocol as Recording::tick: 32-bit float bits, XOR, then ULEB128.
  header=bytearray(self.raw[:88+32+8192]);struct.pack_into('<I',header,16,len(health));start=struct.unpack_from('<Q',header,68)[0];struct.pack_into('<Q',header,76,start+(len(health)-1)*50000);struct.pack_into('<q',header,56,(start+(len(health)-1)*50000)//1000000);previous=[0]*85;body=bytearray()
  for tick,hp in enumerate(health):
   f=[0.]*72;f[0]=.05 if tick else 0;f[6:9]=[3,1.55,3];f[12:15]=[3,1.55,3];f[18]=1.4;f[19]=hp;f[22]=tick*.05
   for k in (24,36,48,60):f[k:k+2]=[3,3]
   current=list(struct.unpack('<72I',struct.pack('<72f',*f)))
   current.extend(struct.unpack('<3I',struct.pack('<ffI',100-tick*.05,min(1,tick*.05),1)))
   for value in (tick*50000,start+tick*50000,50000000 if tick else 0,0,tick*50000):current.extend([value&0xffffffff,value>>32])
   if freeze_previous and tick:previous[19]=struct.unpack('<I',struct.pack('<f',100000))[0]
   for offset in range(0,85,8):
    mask_at=len(body);body.append(0)
    for i in range(min(8,85-offset)):
     k=offset+i;delta=current[k]^previous[k];previous[k]=current[k]
     if delta:
      body[mask_at]|=1<<i
      while delta>=128:body.append((delta&127)|128);delta>>=7
      body.append(delta)
  return bytes(header+body)
 def test_six_digit_health_survives_authenticated_decode_and_replay(self):
  from replay import convert
  from visual_codec import load_chunk
  health=[100,65535,65536,100000,99966,100000,47.75]
  meta,frames=self.decode(self.seal(self.health_recording(health)))
  self.assertEqual([r[19] for r in struct.iter_unpack('<72f',frames)],health)
  with tempfile.TemporaryDirectory() as tmp:
   m=convert(meta,frames,Path(tmp));values=load_chunk(Path(tmp),m,0);observed=[row[1+m['fields'].index(19)] for row in values]
   self.assertIn(99966,observed);self.assertEqual([hp for _,hp in m['healthEvents']],health)
 def test_frozen_encoder_cache_loses_information_before_decoding(self):
  _,frames=self.decode(self.seal(self.health_recording([100,100000,99966],True)))
  health=[r[19] for r in struct.iter_unpack('<72f',frames)]
  self.assertEqual(health[:2],[100,100]) # The change was never written to the file.
  self.assertNotEqual(health[2],99966)
 def test_battery_rule_revision_is_bound_to_the_signed_build(self):
  for build,version in ((0xa0000,'0.10.0'),(0xa0001,'0.10.1'),(0xa0002,'0.10.3')):
   raw=bytearray(self.raw);struct.pack_into('<I',raw,4,build)
   m,_=self.decode(self.seal(raw));self.assertEqual(m['version'],version);self.assertEqual(m['recordingBuild'],build)
  raw=bytearray(self.raw);struct.pack_into('<I',raw,4,0xa0003)
  with self.assertRaises(ProofError):self.decode(self.seal(raw))
 def test_legacy_format_rejected(self):
  raw=b'HLR2'+self.raw[4:]
  with self.assertRaises(ProofError) as ctx:self.decode(self.seal(raw))
  self.assertEqual(ctx.exception.stage,'format')
 def test_valid_signature_invalid_timestamp_rejected(self):
  for at,fmt,value in [(56,'q',0),(64,'i',900)]:
   raw=bytearray(self.raw);struct.pack_into('<'+fmt,raw,at,value)
   with self.subTest(at=at),self.assertRaises(ProofError) as ctx:self.decode(self.seal(raw))
   self.assertEqual(ctx.exception.stage,'format')
 def test_decryptable_bad_signature_rejected(self):
  with self.assertRaises(ProofError) as ctx:self.decode(self.seal(self.raw,True))
  self.assertEqual(ctx.exception.stage,'signature')
 def test_aead_tampering_rejected(self):
  data=bytearray(self.seal(self.raw));data[-1]^=1
  with self.assertRaises(ProofError) as ctx:self.decode(data)
  self.assertEqual(ctx.exception.stage,'authentication')
 def test_signed_nan_rejected(self):
  # Tick 0 group 0: change float word 0 to NaN with canonical XOR varint.
  raw=self.raw[:-22]+bytes([1,0x80,0x80,0x80,0xfe,7])+bytes(21)
  with self.assertRaises(ProofError):self.decode(self.seal(raw))
 def test_signed_trailing_payload_rejected(self):
  with self.assertRaises(ProofError):self.decode(self.seal(self.raw+b'\0'))
 def test_platform_architecture_and_input_flags(self):
  for flags,platform,arch,mode in [(1,'windows','x86_64','held'),(5,'macos','x86_64','held'),(23,'macos','aarch64','pulse'),(11,'linux','x86_64','pulse'),(25,'linux','aarch64','held')]:
   raw=bytearray(self.raw);raw[13]=flags;m,_=self.decode(self.seal(raw));self.assertEqual((m['platform'],m['architecture'],m['inputMode']),(platform,arch,mode))
  for flags in [0,13,33,65,255]:
   raw=bytearray(self.raw);raw[13]=flags
   with self.assertRaises(ProofError):self.decode(self.seal(raw))
if __name__=='__main__':unittest.main()
