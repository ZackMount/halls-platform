"""Cross-run similarity is evidence for review, never a Bot identity classifier."""
import base64,hashlib,json,math,struct
from store import db
from engine.layout import recording_layout

def fingerprint(meta,frames):
 points=[];last=None;length=0.;turns=0;layout=recording_layout(meta)
 for i in range(0,len(frames),layout.stride):
  x,z=struct.unpack_from('<f',frames,i+24)[0],struct.unpack_from('<f',frames,i+32)[0]
  if last is None or math.hypot(x-last[0],z-last[1])>=.5:
   if last:length+=math.hypot(x-last[0],z-last[1])
   points.append((x,z,length));last=(x,z)
 if len(points)<2:points=[(0,0,0),(0,0,0)]
 samples=[];j=0
 for i in range(128):
  d=length*i/127
  while j<len(points)-2 and points[j+1][2]<d:j+=1
  a,b=points[j],points[j+1];t=(d-a[2])/max(b[2]-a[2],1e-9)
  samples.append([round(a[k]+(b[k]-a[k])*t,3) for k in (0,1)])
 angles=[math.atan2(b[1]-a[1],b[0]-a[0]) for a,b in zip(samples,samples[1:])]
 turns=sum(abs((b-a+math.pi)%math.tau-math.pi)>.25 for a,b in zip(angles,angles[1:]))
 bitmap=base64.b64decode(meta['bitmap'])
 # 16 x 16 spatial wall-occupancy blocks for indexed candidate retrieval.
 coarse=[]
 for z in range(0,256,16):
  for x in range(0,256,16):
   coarse.append(sum(int.from_bytes(bitmap[(r*256+x)//8:(r*256+x)//8+2],'little').bit_count() for r in range(z,z+16)))
 return {'seed':meta['seed'],'mapGenerator':int(layout.build>=0xa0002),'mapHash':hashlib.sha256(bitmap).hexdigest(),'bitmap':meta['bitmap'],'coarse':coarse,'points':samples,'length':length,'turns':turns}

def compare(current,run_id,config):
 # Existing immutable fingerprints are compared in bounded pages. If the library
 # exceeds the supported budget, the report explicitly requires manual review.
 with db() as c:
  entry=c.execute('SELECT created FROM runs WHERE id=?',(run_id,)).fetchone();cutoff=entry['created'] if entry else float('inf')
  rows=c.execute("SELECT id,name,fingerprint FROM runs WHERE id<>? AND created<=? AND status='done' AND fingerprint IS NOT NULL ORDER BY created DESC LIMIT 5001",(run_id,cutoff)).fetchall()
  seed_matches=[{'id':r['id'],'sameSeed':True} for r in c.execute("SELECT id FROM runs WHERE seed=? AND id<>? AND created<=? AND status='done' AND COALESCE(json_extract(fingerprint,'$.mapGenerator'),0)=? ORDER BY created LIMIT 16",(str(current.get('seed','')),run_id,cutoff,current.get('mapGenerator',0)))]
  seed_count=c.execute("SELECT COUNT(*) FROM runs WHERE seed=? AND id<>? AND created<=? AND status='done' AND COALESCE(json_extract(fingerprint,'$.mapGenerator'),0)=?",(str(current.get('seed','')),run_id,cutoff,current.get('mapGenerator',0))).fetchone()[0]
 complete=len(rows)<=5000;rows=rows[:5000];candidates=[];path_matches=[]
 a=current['points'];norm=lambda p:[[x-p[0][0],z-p[0][1]] for x,z in p];an=norm(a)
 for row in rows:
  f=json.loads(row['fingerprint'])
  coarse=sum(abs(x-y) for x,y in zip(current['coarse'],f['coarse']))
  candidates.append((coarse,row,f))
  if min(current['length'],f['length'])<config['minimumDistance'] or min(current['turns'],f['turns'])<8:continue
  bn=norm(f['points']);absolute=math.sqrt(sum((x-u)**2+(z-v)**2 for (x,z),(u,v) in zip(a,f['points']))/128)
  relative=math.sqrt(sum((x-u)**2+(z-v)**2 for (x,z),(u,v) in zip(an,bn))/128)
  length_ratio=min(current['length'],f['length'])/max(current['length'],f['length'],1)
  similarity=max(0,100*(1-min(absolute,relative)/20))*length_ratio
  if similarity>=config['pathThreshold']:path_matches.append({'id':row['id'],'similarity':round(similarity,3),'rmsMeters':round(min(absolute,relative),3),'translated':relative<absolute,'sameMap':f['mapHash']==current['mapHash']})
 bitmap=int.from_bytes(base64.b64decode(current['bitmap']),'little');map_matches=[]
 # Coarse L1 difference is a lower bound for actual changed bits: no qualifying
 # map can be filtered out by this bound.
 max_diff=65536*(1-config['mapThreshold']/100)
 for distance,row,f in candidates:
  if distance>max_diff:continue
  similarity=100*(1-(bitmap^int.from_bytes(base64.b64decode(f['bitmap']),'little')).bit_count()/65536)
  if similarity>=config['mapThreshold']:map_matches.append({'id':row['id'],'similarity':round(similarity,4),'exact':current['mapHash']==f['mapHash']})
 result=[{'id':'seed_similarity','title':'已有地图种子','group':'跨成绩比较','status':'disabled' if not config.get('seedEnabled',True) else 'insufficient' if current.get('seed') is None else 'fail' if seed_matches else 'pass','action':config['action'],'checked':len(rows),'violations':seed_count,'evidence':seed_matches[:16],'details':{'complete':complete,'librarySizeChecked':len(rows)}}]
 for kind,title,matches in [('map','已有地图相似度',map_matches),('path','已有路径相似度',path_matches)]:
  enabled=config[kind+'Enabled'];enough=kind=='map' or current['length']>=config['minimumDistance'] and current['turns']>=8
  result.append({'id':kind+'_similarity','title':title,'group':'跨成绩比较','status':'disabled' if not enabled else 'inconclusive' if not complete else 'insufficient' if not enough else 'fail' if matches else 'pass','action':config['action'],'checked':len(rows) if enabled else 0,'violations':len(matches) if enabled else 0,'evidence':sorted(matches,key=lambda m:-m['similarity'])[:16] if enabled else [],'details':{'librarySizeChecked':len(rows),'complete':complete,'threshold':config[kind+'Threshold'],'turns':current['turns'],'minimumDistance':config['minimumDistance'],'method':'逐位地图一致率' if kind=='map' else '按行程等距采样 128 点，绝对 / 平移对齐 RMS 距离 × 路长比例；至少 8 个转折。','interpretation':'相似不等于作弊；固定布局、共同走廊和重复尝试可能相似，需要复核。'}})
 return result
