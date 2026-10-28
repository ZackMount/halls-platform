"""Halls Visual Replay v5: compressed binary, render-only samples."""
import base64,json,struct
from pathlib import Path
from visual_codec import fields_for_entities,stride_for_entities,save_replay,load_chunk,MIME,split_initial
from engine.timing import ClockSamples,inactive_between
from engine.battery import BatterySamples
from engine.layout import recording_layout
RATE=12
# Presentation data excludes tick actions, RNG/seed, cooldown and simulation dt.

def lamp_active(x,z,seed,spawn,reduced=True):
 if [x,z]==spawn:return True
 if ((x*37+z*19)^seed)%7==0:return False
 if not reduced:return True
 mask=0xffffffff;h=((x*0x1f123bb5)^(z*0x5f356495)^(seed&mask)^(seed>>32))&mask
 h=((h^(h>>16))*0x7feb352d)&mask
 h=((h^(h>>15))*0x846ca68b)&mask
 return (h^(h>>16))%10>=3

def lamp_bits(meta):
 if meta.get('recordingBuild',0)>=0xb0003 or meta.get('version')=='0.11.3':
  bits=meta.get('_renderLampBits')
  if bits is None:
   from engine.judge import native_lamp_bits
   bits=native_lamp_bits(meta)
  if not isinstance(bits,(bytes,bytearray)) or len(bits)!=8192:raise ValueError('Invalid terrain lamp bitmap')
  return bits
 bits=bytearray(8192);seed=int(meta['seed']);spawn=[int(n/meta['tile']) for n in meta['spawnPosition']]
 reduced=meta.get('recordingBuild',0)>=0x000b0001 or meta.get('version')=='0.11.1'
 for z in range(256):
  for x in range(256):
   if lamp_active(x,z,seed,spawn,reduced):
    i=z*256+x;bits[i//8]|=1<<(i%8)
 return bits

class ChaseIntervals:
 def __init__(self):self.start=None;self.ranges=[]
 def update(self,time,chasing):
  if chasing and self.start is None:self.start=time
  elif not chasing and self.start is not None:
   if time>self.start:self.ranges.append([round(self.start,6),round(time,6)])
   self.start=None
 def finish(self,duration):self.update(duration,False);return self.ranges

def chase_from_recording(meta,frames):
 layout=recording_layout(meta);clocks=ClockSamples(meta) if meta.get('timeInfo',{}).get('available') else None;elapsed=0.;chase=ChaseIntervals()
 for i in range(meta['frames']):
  elapsed=clocks[i][0]/1e6 if clocks else elapsed+max(0,struct.unpack_from('<f',frames,i*layout.stride)[0])
  chase.update(elapsed,any(struct.unpack_from('<I',frames,i*layout.stride+(35+e*12)*4)[0]==2 for e in range(layout.entities)))
 return chase.finish(meta.get('replayDuration',meta['duration']))

def chase_from_visual(folder,manifest):
 chase=ChaseIntervals();mood=2+len(manifest['fields']);index=0
 for chunk in range(manifest['chunks']):
  for row in load_chunk(folder,manifest,chunk):
   chase.update(manifest['times'][index],any(row[mood+e]==2 for e in range(manifest.get('entities',4))));index+=1
 if index!=manifest['samples']:raise ValueError('Replay sample count mismatch')
 return chase.finish(manifest['duration'])

def send_visual(folder,part):
 from flask import request,jsonify,send_from_directory,Response
 import gzip
 if request.headers.get('Accept')!=MIME:return jsonify(error='回放格式已更新，请刷新网页后继续。'),406
 if part=='0':
  first=split_initial(gzip.decompress((Path(folder)/'init.hvi.gz').read_bytes()))[1]
  response=Response(gzip.compress(first,compresslevel=9,mtime=0),mimetype=MIME)
 else:
  name='init.hvi.gz' if part=='manifest' else part+'.hvc.gz'
  response=send_from_directory(folder,name,mimetype=MIME,conditional=False,etag=False)
 response.headers['Content-Encoding']='gzip';return response

def convert(meta,frames,destination):
 layout=recording_layout(meta);fields=fields_for_entities(layout.entities);stride=stride_for_entities(layout.entities)
 destination.mkdir(parents=True,exist_ok=True);rows=[];next_time=0.;elapsed=0.;pressed=0;health_events=[];last_health=None;idle_ranges=[];chase=ChaseIntervals()
 info=meta.get('timeInfo',{});clocks=ClockSamples(meta) if info.get('available') else None
 duration=meta.get('replayDuration',meta['duration']);rate=min(RATE,180000/max(meta.get('duration',duration),1))
 battery=BatterySamples(meta) if meta.get('battery') else None
 unpack=struct.Struct('<'+str(layout.words)+'f');uint=struct.Struct('<'+str(layout.words)+'I');previous=None;previous_time=0.
 def append(row):
  if rows and row[0]<=rows[-1][0]:rows[-1]=row
  else:rows.append(row)
  if len(rows)>200000:raise ValueError('Replay sample budget exceeded')
 def sample(f,u,t,pressed):return [round(t,6)]+[round(f[k],4) for k in fields]+[int(bool(u[1]&512))]+[u[35+12*e] for e in range(layout.entities)]+[u[1]&1023,pressed]
 for tick in range(meta['frames']):
  f=list(unpack.unpack_from(frames,tick*layout.stride));f[3]=battery[tick][0] if battery else 100.;u=uint.unpack_from(frames,tick*layout.stride);elapsed=clocks[tick][0]/1e6 if clocks else elapsed+max(0,f[0]);pressed|=u[1]&255
  chase.update(elapsed,any(u[35+12*e]==2 for e in range(layout.entities)))
  interrupted=False
  if clocks and previous:
   inactive,_=inactive_between(clocks[tick-1],clocks[tick])
   if inactive>.02:
    active=min(clocks[tick][2]/1e9,max(0,elapsed-previous_time-inactive));end=max(previous_time,elapsed-active);start=max(previous_time,end-inactive);end=min(end,max(start,elapsed-.000001))
    quiet=sample(previous[0],previous[1],start,0);quiet[-2]&=768
    append(quiet);quiet=quiet.copy();quiet[0]=round(end,6);append(quiet);idle_ranges.append([round(start,6),round(end,6)]);interrupted=True
  if f[19]!=last_health:health_events.append([round(elapsed,6),f[19]]);last_health=f[19]
  previous=(f,u);previous_time=elapsed
  if elapsed+1e-8<next_time and tick!=meta['frames']-1 and not interrupted:continue
  next_time=elapsed+1/rate;append(sample(f,u,elapsed,pressed));pressed=0
 # Lamp layout replaces the map generation seed; form seed is reduced to the
 # visual modulus only. Neither is sufficient to reconstruct a signed proof.
 bits=lamp_bits(meta)
 manifest={'format':'HVR5','terrainLighting':layout.build>=0xb0003,'inputMode':meta.get('inputMode','held'),'inputOffset':1+len(fields)+1+layout.entities,'rate':rate,'timeBasis':info.get('basis','simulation_legacy'),'idleRanges':idle_ranges,'chaseRanges':chase.finish(duration),'simulationDuration':meta.get('simulationDuration',meta['duration']),'activeDuration':meta['duration'],'healthEvents':health_events,'stride':stride,'fields':fields,'words':layout.words,'samples':len(rows),'duration':duration,'chunks':(len(rows)+359)//360,'tile':meta['tile'],'ceiling':meta['ceiling'],'eye':meta['eye'],'entities':layout.entities,'exit':meta['exit'],'spawnPosition':meta['spawnPosition'],'bitmap':meta['bitmap'],'lampBits':base64.b64encode(bits).decode(),'forms':[int(n)%997 for n in meta['formSeeds']],'times':[row[0] for row in rows],'path':[[row[1],row[3]] for row in rows[::max(1,len(rows)//2500)]],'notice':'平台展示数据，非原始凭证；实体视角由位置和朝向重建。'}
 objectives=meta.get('_objectives')
 if objectives is None and layout.build>=0x01000000:
  # A standalone preview has not run the judge. Derive render-only objectives
  # from its displayed world, without awarding or trusting any score here.
  from engine.judge import World,Rows
  from engine.objectives import coin_cells,collect_coins
  world=World(base64.b64decode(meta['bitmap']));spawn=[int(value/meta['tile']) for value in meta['spawnPosition']]
  cells=coin_cells(world,meta['seed'],spawn,meta['exit'])
  objectives={'coins':[{'id':i,'cell':at,'position':[(at[0]+.5)*meta['tile'],(at[1]+.5)*meta['tile']]} for i,at in enumerate(cells)],'coinPickups':collect_coins(Rows(frames,words=layout.words),cells,meta['tile'],clocks)}
 objectives=objectives or {}
 manifest.update(coins=objectives.get('coins',[]),coinPickups=objectives.get('coinPickups',[]))
 # Only recorded exit changes have timestamps.
 if meta.get('_canonicalExit') is not None:manifest['canonicalExit']=meta['_canonicalExit']
 if meta.get('exitEvents'):manifest['exitEvents']=meta['exitEvents']
 if meta.get('_exitCompletionMismatch'):
  manifest['exitCompletionMismatch']={'position':[previous[0][6],previous[0][8]]}
 return save_replay(destination,manifest,rows)
