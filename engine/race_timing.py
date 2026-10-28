"""Judge-only timing; the public reference route remains unchanged."""
import hashlib,json,math,os,platform,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent
MAX_TIGHTENING=.05

def solver_path():
 arch=platform.machine().lower();arch={'amd64':'x86_64','aarch64':'arm64'}.get(arch,arch)
 return ROOT/'model'/('race-exact-'+platform.system().lower()+'-'+arch+('.exe' if os.name=='nt' else ''))

def exact_distance(world,start,exit_cell,upper,check=lambda:None):
 check();binary=solver_path()
 try:
  manifest=json.loads(binary.with_suffix(binary.suffix+'.json').read_text())
  if manifest['sourceSha256']!=hashlib.sha256((ROOT/'race_exact.cpp').read_bytes()).hexdigest() or manifest['binarySha256']!=hashlib.sha256(binary.read_bytes()).hexdigest():raise ValueError('solver identity mismatch')
  if len(world.bits)!=8192 or not all(math.isfinite(v) for v in (*start,upper)) or upper<0:raise ValueError('invalid geometry')
  data=f'{start[0]:.17g} {start[1]:.17g} {exit_cell[0]} {exit_cell[1]} {upper:.17g}\n'.encode()+world.bits
  result=subprocess.run([str(binary)],input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=30)
  check()
  if result.returncode or len(result.stdout)>1024*1024:raise ValueError('solver did not complete')
  lines=result.stdout.decode().splitlines();distance,count=lines[0].split();distance=float(distance);count=int(count)
  if not math.isfinite(distance) or not 0<=distance<=upper+1e-5 or not 1<=count<=65536 or len(lines)!=count+1:raise ValueError('invalid result')
  path=[tuple(map(float,line.split())) for line in lines[1:]]
  if any(len(p)!=2 or any(not math.isfinite(v) or not 0<=v<=512 for v in p) for p in path):raise ValueError('invalid path')
  if math.dist(path[0],start)>1e-8 or abs(sum(math.dist(a,b) for a,b in zip(path,path[1:]))-distance)>1e-6:raise ValueError('inconsistent path')
  x,z=exit_cell
  if not x*2-1e-8<=path[-1][0]<=(x+1)*2+1e-8 or not z*2-1e-8<=path[-1][1]<=(z+1)*2+1e-8:raise ValueError('invalid endpoint')
  return distance
 except (OSError,ValueError,KeyError,subprocess.TimeoutExpired) as error:
  raise RuntimeError('精确竞速基准计算未完成，请重试。') from error

def timing_reference(world,start,exit_cell,reference,speed,check=lambda:None):
 if not reference.get('available') or speed<=0:raise RuntimeError('缺少有效的竞速参考路径。')
 distance=exact_distance(world,start,exit_cell,reference['distance'],check)
 exact=distance/speed;previous=reference['seconds']
 # Cap the reduction from the feasible reference at 5%.
 effective=min(previous,max(exact,previous*(1-MAX_TIGHTENING)))
 return {'version':'visibility-timing-1','method':'expanded-wall-visibility-graph',
  'exactDistance':distance,'exactSeconds':exact,'scoringSeconds':effective,
  'previousSeconds':previous,'maximumTightening':MAX_TIGHTENING,'tighteningLimited':effective>exact+1e-6,
  'radius':.22,'speed':speed,'numericToleranceMeters':1e-6,
  'objective':'canonical_spawn_to_original_exit_without_coin_detours',
  'assumptions':'Continuous motion at running speed, square player clearance, no entities, no turn delay; geometric time infimum, not a guarantee of an achievable full-score run.'}
