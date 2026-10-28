"""Lossless, render-only HVM5 metadata and HVC5 sample columns."""
import base64,gzip,math,struct
from pathlib import Path

def fields_for_entities(entities):
 if entities not in (4,5):raise ValueError('Unsupported visual entity count')
 return list(range(6,11))+list(range(12,20))+[22]+[k for e in range(entities) for k in range(24+12*e,31+12*e)]+[3]
def stride_for_entities(entities):return 1+len(fields_for_entities(entities))+entities+3
FIELDS=fields_for_entities(4) # Keep the legacy packet contract for stored replays.
STRIDE=stride_for_entities(4)
CHUNK_SIZE=360
MIME='application/vnd.halls.replay.v5'
MAX_SAFE=2**53-1
MAX_EXIT_EVENTS=900000
HEADER=struct.Struct('<4sBBBB5I2B')

def exit_metadata(meta):
 canonical=meta.get('canonicalExit');events=meta.get('exitEvents',[])
 mismatch=meta.get('exitCompletionMismatch')
 if mismatch is not None:
  position=mismatch.get('position') if isinstance(mismatch,dict) else None
  if not isinstance(position,(list,tuple)) or len(position)!=2 or any(type(v) not in (int,float) or not math.isfinite(v) or not 0<=v<512 for v in position):raise ValueError('Invalid exit mismatch position')
 def cell(value):
  return isinstance(value,(list,tuple)) and len(value)==2 and all(type(v) is int and 0<=v<256 for v in value)
 if canonical is not None and not cell(canonical):raise ValueError('Invalid canonical exit')
 if not isinstance(events,list) or len(events)>MAX_EXIT_EVENTS:raise ValueError('Invalid exit event budget')
 previous=None
 for event in events:
  if not isinstance(event,dict) or not cell(event.get('cell')):raise ValueError('Invalid exit event cell')
  value=event.get('time')
  if type(value) not in (int,float) or not math.isfinite(value) or not 0<=value<=meta['duration']+1e-6:raise ValueError('Invalid exit event time')
  if previous is None:
   if value!=0:raise ValueError('Exit history must include its recorded initial state')
  elif value<=previous['time'] or list(event['cell'])==list(previous['cell']):raise ValueError('Noncanonical exit event sequence')
  previous=event
 return canonical,events,mismatch

def varint(value):
 if not isinstance(value,int) or not 0<=value<=MAX_SAFE:raise ValueError('Invalid replay integer')
 result=bytearray()
 while value>=128:result.append((value&127)|128);value>>=7
 result.append(value);return result

class Reader:
 def __init__(self,data):self.data=data;self.at=0
 def take(self,size):
  if size<0 or self.at+size>len(self.data):raise ValueError('Truncated visual replay')
  value=self.data[self.at:self.at+size];self.at+=size;return value
 def number(self,maximum=MAX_SAFE):
  value=0;scale=1
  for shift in range(8):
   byte=self.take(1)[0];value+=(byte&127)*scale
   if value>maximum:raise ValueError('Visual replay integer overflow')
   if byte<128:
    if shift and byte==0:raise ValueError('Noncanonical visual replay integer')
    return value
   scale*=128
  raise ValueError('Oversized visual replay integer')
 def end(self):
  if self.at!=len(self.data):raise ValueError('Trailing visual replay bytes')

def column(values):
 result=bytearray();previous=0;run=0
 for value in values:
  if not 0<=value<=0xffffffff:raise ValueError('Invalid replay word')
  delta=value^previous
  if delta==0:run+=1;continue
  if run:result.extend(b'\0'+varint(run));run=0
  result.extend(varint(delta));previous=value
 if run:result.extend(b'\0'+varint(run))
 return result

def read_column(reader,count):
 result=[];previous=0
 while len(result)<count:
  delta=reader.number(0xffffffff)
  if delta==0:
   run=reader.number(count-len(result))
   if run==0:raise ValueError('Empty visual replay run')
   result.extend([previous]*run)
  else:previous^=delta;result.append(previous)
 return result

def bits(value):return struct.unpack('<I',struct.pack('<f',value))[0]
def floats(words):return list(struct.unpack('<'+str(len(words))+'f',struct.pack('<'+str(len(words))+'I',*words)))
def bitmap(value):return base64.b64decode(value,validate=True) if isinstance(value,str) else bytes(value)
def exact_integer(value,scale):
 if not math.isfinite(value):return False
 integer=round(value*scale);return abs(integer)<=MAX_SAFE and integer/scale==value

def encode_manifest(meta):
 entities=meta.get('entities',4);selected=fields_for_entities(entities)
 if len(meta['forms'])!=entities or any(not 0<=v<997 for v in meta['forms']):raise ValueError('Invalid visual form seeds')
 count=meta['samples'];health=meta.get('healthEvents',[]);idle=meta.get('idleRanges',[]);chase=meta.get('chaseRanges',[]);path=meta['path'];times=meta['times']
 if not 1<=count<=200000 or len(times)!=count or len(health)>1000000 or len(path)>5000 or len(idle)>count or len(chase)>1000000:raise ValueError('Visual replay budget exceeded')
 time_values=times+[p[0] for p in health]+[v for pair in idle+chase for v in pair]
 direct_times=not all(exact_integer(v,1000000) and v>=0 for v in time_values)
 direct_path=not all(exact_integer(v,10000) and abs(round(v*10000))<=0x7fffffff for p in path for v in p)
 coins=meta.get('coins',[]);pickups=meta.get('coinPickups',[])
 canonical,exit_events,mismatch=exit_metadata(meta)
 if not isinstance(coins,list) or len(coins)>3 or not isinstance(pickups,list) or len(pickups)>3:raise ValueError('Invalid visual coin budget')
 flags=(64 if canonical is not None or exit_events or mismatch else 0)|(32 if coins else 0)|(meta.get('inputMode')=='events')|(2 if meta.get('timeBasis')=='recorded_wall' else 0)|(4 if direct_times else 0)|(8 if direct_path else 0)|(16 if meta.get('terrainLighting') else 0)
 map_bits,lamp_bits=bitmap(meta['bitmap']),bitmap(meta['lampBits'])
 if len(map_bits)!=8192 or len(lamp_bits)!=8192 or len(meta['spawnPosition'])!=2:raise ValueError('Invalid visual world layout')
 scalar=[meta[k] for k in ('duration','activeDuration','simulationDuration','rate','tile','ceiling','eye')]+meta['spawnPosition']
 if not all(math.isfinite(v) for v in scalar):raise ValueError('Nonfinite visual world metadata')
 result=bytearray(HEADER.pack(b'HVM5',flags,entities,len(selected),0,count,len(health),len(idle),len(chase),len(path),*meta['exit']));result.extend(struct.pack('<'+str(entities)+'H9d',*meta['forms'],*scalar));result.extend(map_bits+lamp_bits)
 def time_list(values,delta=True):
  previous=0
  for value in values:
   if direct_times:result.extend(struct.pack('<d',value))
   else:
    current=round(value*1000000);result.extend(varint(current-previous if delta else current));previous=current
 time_list(times);time_list([p[0] for p in health]);result.extend(column(bits(p[1]) for p in health))
 time_list([v for p in idle for v in p],False);time_list([v for p in chase for v in p],False)
 for axis in range(2):
  previous=0
  for point in path:
   if direct_path:result.extend(struct.pack('<d',point[axis]))
   else:
    current=round(point[axis]*10000);delta=current-previous;result.extend(varint(delta*2 if delta>=0 else -delta*2-1));previous=current
 if coins:
  pickup_times={}
  for item in pickups:
   key,value=item.get('id'),item.get('time')
   if type(key) is not int or key in pickup_times or type(value) not in (int,float) or not math.isfinite(value) or not 0<=value<=meta['duration']+1e-6:raise ValueError('Invalid visual coin pickup')
   pickup_times[key]=value
  seen=set();seen_cells=set();result.append(len(coins))
  for item in coins:
   key,cell=item.get('id'),item.get('cell')
   if type(key) is not int or not 0<=key<3 or key in seen or not isinstance(cell,(list,tuple)) or len(cell)!=2 or any(type(v) is not int or not 0<=v<256 for v in cell) or tuple(cell) in seen_cells:raise ValueError('Invalid visual coin')
   seen.add(key);seen_cells.add(tuple(cell));result.extend(struct.pack('<BBBd',key,*cell,pickup_times.get(key,-1.)))
  if set(pickup_times)-seen:raise ValueError('Unknown visual coin pickup')
 elif pickups:raise ValueError('Coin pickup without a coin')
 if flags&64:
  result.append((1 if canonical is not None else 0)|(2 if exit_events else 0)|(4 if mismatch else 0))
  if canonical is not None:result.extend(bytes(canonical))
  if exit_events:
   result.extend(varint(len(exit_events)))
   for event in exit_events:result.extend(struct.pack('<dBB',event['time'],*event['cell']))
  if mismatch:result.extend(struct.pack('<dd',*mismatch['position']))
 return bytes(result)

def decode_manifest(data):
 reader=Reader(data);magic,flags,entities,fields,reserved,count,nh,ni,nc,np,ex,ez=HEADER.unpack(reader.take(HEADER.size))
 if magic!=b'HVM5' or flags&~127 or entities not in (4,5) or fields!=len(fields_for_entities(entities)) or reserved or not 1<=count<=200000 or nh>1000000 or ni>count or nc>1000000 or np>5000:raise ValueError('Invalid visual manifest header')
 values=struct.unpack('<'+str(entities)+'H9d',reader.take(entities*2+72));forms=list(values[:entities]);duration,active,simulation,rate,tile,ceiling,eye,sx,sz=values[entities:]
 if not all(math.isfinite(v) for v in values) or min(duration,active,simulation)<0 or rate<=0 or tile<=0 or any(v>=997 for v in forms):raise ValueError('Invalid visual manifest scalars')
 map_bits,lamp_bits=reader.take(8192),reader.take(8192)
 def time_list(size,delta=True):
  result=[];previous=0
  for _ in range(size):
   if flags&4:value=struct.unpack('<d',reader.take(8))[0]
   else:
    value=reader.number();previous=value+previous if delta else value;value=previous/1000000
   if not math.isfinite(value) or value<0:raise ValueError('Invalid visual timestamp')
   result.append(value)
  return result
 times=time_list(count)
 if any(a>=b for a,b in zip(times,times[1:])):raise ValueError('Nonmonotonic visual timeline')
 health_times=time_list(nh);health=list(map(list,zip(health_times,floats(read_column(reader,nh)))))
 idle_flat=time_list(ni*2,False);chase_flat=time_list(nc*2,False)
 path=[[0.,0.] for _ in range(np)]
 for axis in range(2):
  previous=0
  for point in path:
   if flags&8:point[axis]=struct.unpack('<d',reader.take(8))[0]
   else:
    value=reader.number(0xffffffff);previous+=-(value//2)-1 if value&1 else value//2;point[axis]=previous/10000
   if not math.isfinite(point[axis]):raise ValueError('Invalid visual path')
 coins=[];pickups=[];seen=set();seen_cells=set()
 if flags&32:
  number=reader.take(1)[0]
  if not 1<=number<=3:raise ValueError('Invalid visual coin count')
  for _ in range(number):
   key,x,z,pickup=struct.unpack('<BBBd',reader.take(11))
   if key>=3 or key in seen or (x,z) in seen_cells or not math.isfinite(pickup) or pickup!=-1. and not 0<=pickup<=duration+1e-6:raise ValueError('Invalid visual coin metadata')
   seen.add(key);seen_cells.add((x,z));coins.append({'id':key,'cell':[x,z],'position':[(x+.5)*tile,(z+.5)*tile]})
   if pickup>=0:pickups.append({'id':key,'time':pickup})
 canonical=None;exit_events=[];mismatch=None
 if flags&64:
  extension=reader.take(1)[0]
  if not 1<=extension<=7:raise ValueError('Invalid exit extension flags')
  if extension&1:canonical=list(reader.take(2))
  if extension&2:
   number=reader.number(MAX_EXIT_EVENTS)
   if number==0:raise ValueError('Empty exit history extension')
   for _ in range(number):
    stamp,x,z=struct.unpack('<dBB',reader.take(10));exit_events.append({'time':stamp,'cell':[x,z]})
  if extension&4:mismatch={'position':list(struct.unpack('<dd',reader.take(16)))}
  exit_metadata({'canonicalExit':canonical,'exitEvents':exit_events,'exitCompletionMismatch':mismatch,'duration':duration})
 reader.end()
 return {'canonicalExit':canonical,'exitEvents':exit_events,'exitCompletionMismatch':mismatch,'coins':coins,'coinPickups':pickups,'format':'HVR5','inputMode':'events' if flags&1 else 'held','inputOffset':stride_for_entities(entities)-2,'timeBasis':'recorded_wall' if flags&2 else 'simulation_legacy','samples':count,'chunks':(count+359)//360,'duration':duration,'activeDuration':active,'simulationDuration':simulation,'rate':rate,'tile':tile,'ceiling':ceiling,'eye':eye,'entities':entities,'exit':[ex,ez],'forms':forms,'spawnPosition':[sx,sz],'bitmap':map_bits,'lampBits':lamp_bits,'terrainLighting':bool(flags&16),'fields':fields_for_entities(entities),'stride':stride_for_entities(entities),'words':24+12*entities,'times':times,'healthEvents':health,'idleRanges':[idle_flat[i:i+2] for i in range(0,len(idle_flat),2)],'chaseRanges':[chase_flat[i:i+2] for i in range(0,len(chase_flat),2)],'path':path}

def encode_chunk(rows,entities=4):
 selected=fields_for_entities(entities);stride=stride_for_entities(entities);count=len(rows)
 if not 1<=count<=CHUNK_SIZE or any(len(r)!=stride for r in rows):raise ValueError('Invalid visual chunk shape')
 result=bytearray(struct.pack('<4sHH',b'HVC5',count,len(selected)))
 for i in range(len(selected)):result.extend(column(bits(row[i+1]) for row in rows))
 def controls(row):
  held,pressed=int(row[-2]),int(row[-1]);moods=[int(v) for v in row[2+len(selected):2+len(selected)+entities]]
  if held&~1023 or pressed&~255 or any(v not in range(4) for v in moods):raise ValueError('Invalid visual controls')
  return held|(pressed<<10)|sum(v<<(18+2*e) for e,v in enumerate(moods))
 result.extend(column(controls(row) for row in rows));return bytes(result)

def decode_chunk(data,meta,index):
 entities=meta.get('entities',4);selected=fields_for_entities(entities)
 reader=Reader(data);magic,count,fields=struct.unpack('<4sHH',reader.take(8));expected=min(CHUNK_SIZE,meta['samples']-index*CHUNK_SIZE)
 if magic!=b'HVC5' or count!=expected or not 1<=count<=CHUNK_SIZE or fields!=len(selected):raise ValueError('Invalid visual chunk header')
 columns=[floats(read_column(reader,count)) for _ in selected];controls=read_column(reader,count);reader.end();rows=[]
 for i,value in enumerate(controls):
  if value>>(18+2*entities):raise ValueError('Unknown visual control bits')
  held=value&1023;rows.append([meta['times'][index*360+i]]+[col[i] for col in columns]+[int(bool(held&512))]+[(value>>(18+2*e))&3 for e in range(entities)]+[held,(value>>10)&255])
 return rows

def split_initial(data):
 reader=Reader(data);magic,metadata_size,chunk_size=struct.unpack('<4sII',reader.take(12))
 if magic!=b'HVI5':raise ValueError('Invalid initial replay packet')
 metadata,chunk=reader.take(metadata_size),reader.take(chunk_size);reader.end();return metadata,chunk
def load_manifest(folder):return decode_manifest(split_initial(gzip.decompress((Path(folder)/'init.hvi.gz').read_bytes()))[0])
def load_chunk(folder,meta,index):
 raw=split_initial(gzip.decompress((Path(folder)/'init.hvi.gz').read_bytes()))[1] if index==0 else gzip.decompress((Path(folder)/f'{index}.hvc.gz').read_bytes())
 return decode_chunk(raw,meta,index)
def save_replay(folder,meta,rows):
 folder=Path(folder);folder.mkdir(parents=True,exist_ok=True)
 metadata,first=encode_manifest(meta),encode_chunk(rows[:360],meta.get('entities',4));initial=struct.pack('<4sII',b'HVI5',len(metadata),len(first))+metadata+first
 (folder/'init.hvi.gz').write_bytes(gzip.compress(initial,compresslevel=9,mtime=0))
 for i in range(1,(len(rows)+359)//360):(folder/f'{i}.hvc.gz').write_bytes(gzip.compress(encode_chunk(rows[i*360:(i+1)*360],meta.get('entities',4)),compresslevel=9,mtime=0))
 return {**meta,'format':'HVR5'}
