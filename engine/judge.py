"""Configurable organizer adjudication. Authentication/format safety cannot be disabled."""
import base64,hashlib,json,logging,math,platform,struct,subprocess,time
from collections import deque
from datetime import datetime,timezone
from pathlib import Path
from geometry import exit_bounds,in_exit
from exits import ExitSamples,valid_cell
from scoring import evaluate_report,operation_metrics
from race_reference import reference_route
from race_timing import timing_reference
from objectives import coin_cells,collect_coins,tactical_metrics,COIN_COUNT,COIN_GENERATION_CHECKS,COIN_PICKUP_CHECKS,prerequisite_states,current_coin_engine
from information_audit import information_audit
from timing import judge_timing,ClockSamples,valid_tick_dt
from battery import judge_battery
from layout import recording_layout,LAYOUTS,CURRENT_BUILD
from behavior_model import observe as learned_observations
from automation import THRESHOLD,MODEL_VERSION,migrate_parameters,require_assessment

ROOT=Path(__file__).resolve().parent
VERSION='1.14.4'
MAX_ANALYSIS_SECONDS=120
class AnalysisTimeout(RuntimeError):pass
def check_deadline(deadline):
 if time.monotonic()>deadline:raise AnalysisTimeout('评判计算超过时间上限；文件已完成导入校验，但本次成绩尚未判定。')

def parameter(label,default,minimum,maximum,step,unit=''):
 return dict(label=label,default=default,min=minimum,max=maximum,step=step,unit=unit)
def rule(key,title,description,parameters=None,action='reject',group='一致性'):
 return dict(id=key,title=title,description=description,parameters=parameters or {},action=action,group=group)
P=parameter
RULES=[
 rule('production','正式玩家录制','开发测试标记不可作为正式成绩。'),
 rule('map','地图重生成','用凭证种子重新运行固定版本生成器，逐位比较全部 65,536 格。',{'different_cells':P('允许不同格数',0,0,65536,1,'格')}),
 rule('spawn','出生状态','复算玩家位置、朝向、所有实体的随机种子与初始状态；检查全新开局。',{'tolerance':P('位置 / 状态浮点容差',.002,0,.5,.001)}),
 rule('exit','真实出口','核对初始出口及逐 tick 出口快照与种子生成结果；旧凭证仅能检查开局声明。'),
 rule('completion','通关完整性','进入整块 2×2 米出口地面即通关，无需抵达中心；逐帧检查存活和终止状态。'),
 rule('clock','时间与状态范围','首帧、tick 时长、累计游戏时间、坐标、枚举与状态范围。',{'max_dt':P('最大 tick 时长',.050001,.001,.1,.000001,'秒'),'tolerance':P('计时容差',.002,0,.2,.001,'秒')}),
 rule('time_sources','现实计时一致性','核对独立单调时钟、UTC 起止时间、暂停与系统休眠记录。时钟校准异常进入复核。',{'slack':P('单调时钟采样容差',.05,.001,1,.001,'秒'),'utc_slack':P('UTC 校准容差',2,.05,30,.05,'秒'),'drift_percent':P('允许时钟漂移',.01,0,2,.01,'%')},'review','时间'),
 rule('speed_control','游戏变速校验','比较未截断游戏计时与独立系统计时，并核对实际模拟步长。暂停、失焦与系统休眠单独处理。',{'ratio_tolerance':P('分段允许计时倍率偏差',3,.1,50,.1,'%'),'total_tolerance':P('全程允许计时倍率偏差',1,.1,50,.1,'%'),'window_seconds':P('分段检查窗口',2,.5,30,.5,'秒'),'clock_slack':P('采样误差余量',.04,.005,1,.005,'秒'),'step_tolerance':P('步长浮点容差',.000002,.000001,.005,.000001,'秒')},'reject','时间'),
 rule('flashlight','手电筒与电池','复算电量消耗、整秒取整计费、自动熄灭和延迟回充。',{'drain':P('每秒耗电',1,.1,10,.1,'%'),'charge':P('每秒充电',4,.1,20,.1,'%'),'minimum_on':P('耗电计费单位',1,0,5,.1,'秒'),'recharge_delay':P('熄灭后充电等待',3,0,10,.1,'秒'),'tolerance':P('电量 / 计时容差',.02,.001,1,.001)} ,'reject','一致性'),
 rule('route','路线与碰撞','地图外边界、出生至出口可达性、每帧身体碰撞及跨格连线穿墙。',{'clearance_tolerance':P('墙体边缘容差',.003,0,.1,.001,'米')}),
 rule('input','输入约束','按键对应的方向、归一化斜向移动、转向上限，以及受击停顿期间的输入。',{'tolerance':P('动作浮点容差',.001,0,.05,.001),'exact_keys':P('严格匹配 Windows 按键（0/1）',1,0,1,1)}),
 rule('player_speed','玩家速度','逐帧位移上限；独立战斗复算确认命中后计入击退，不以实录掉血作为命中依据。',{'walk':P('步行速度',2.,.1,10,.1,'米/秒'),'run':P('奔跑速度',5.,.1,15,.1,'米/秒'),'knockback':P('击退上限',.86,0,2,.01,'米'),'tolerance':P('位移容差',.003,0,.1,.001,'米')}),
 rule('player_model','玩家运动复算','以实录上一帧为起点，重算转向、墙面滑动、里程与受击位移。',{'position':P('坐标 / 里程容差',.004,0,.5,.001,'米'),'angle':P('角度容差',.002,0,.2,.001,'弧度')} ,'reject','逐帧模型'),
 rule('entity_speed','实体速度','分别检查所有实体的位移，含攻击冲刺；不会把一个实体的状态套给全图。',{'maximum':P('最高速度',6.5,.1,15,.001,'米/秒'),'tolerance':P('位移容差',.004,0,.1,.001,'米')}),
 rule('entity_motion','实体寻路与运动','保留重建的寻路、目标和 RNG，逐帧对照位置、转向、速度、移动动画与重规划。',{'position':P('位置 / 里程容差',.006,0,.5,.001,'米'),'angle':P('转向容差',.004,0,.3,.001,'弧度'),'state':P('速度 / 动画 / 计时容差',.008,0,1,.001)},'reject','逐帧模型'),
 rule('entity_ai','实体感知与仇恨','重跑视线、脚步听觉、追踪范围、仇恨增减、搜索 / 游荡状态；所有实体独立判断。',{'hate':P('仇恨容差',.03,0,10,.01),'time':P('发现时刻容差',.003,0,.2,.001,'秒')},'reject','逐帧模型'),
 rule('combat','攻击与伤害','重算攻击前摇、命中角度、冷却、无敌帧、掉血、击退与停顿。',{'tolerance':P('状态浮点容差',.003,0,.1,.001)},'reject','逐帧模型'),
 rule('coin_generation','金币生成复算','使用该版本原生模型重建地图、出生点与出口，从种子独立复算金币位置；不接受客户端声明的金币布局。',action='review',group='金币'),
 rule('coin_pickup','金币拾取复算','在运动、存活与伤害等前置校验通过后，按每帧最终位置复算一次性金币拾取。未拾取金币也可通过本项。',action='review',group='金币'),
 rule('camera','视角一致性','视角与玩家位置、朝向、受击抖动及固定 FOV 一致。',{'tolerance':P('相机浮点容差',.004,0,.2,.001)},'reject','逐帧模型'),
 rule('bot','自动化可疑度','仅使用离线训练行为模型的推理分数。超过 50% 按对数曲线扣分，最高 40 分。模型覆盖不足时不输出可疑度。',{
  'threshold':P('复核阈值',THRESHOLD,0,100,1,'%'),
  'min_seconds':P('最少有效录制时长',45,0,600,1,'秒')},'review','行为分析'),
]
SCHEMA={r['id']:r for r in RULES}
MODEL_RULES={'player_speed','map','spawn','exit','player_model','entity_motion','entity_ai','combat','camera'}

def defaults(meta=None):
 result={r['id']:{'enabled':True,'action':r['action'],'params':{k:v['default'] for k,v in r['parameters'].items()}} for r in RULES}
 layout=recording_layout(meta) if meta is not None else LAYOUTS[CURRENT_BUILD]
 result['player_speed']['params'].update(walk=layout.walk,run=layout.run)
 result['entity_speed']['params']['maximum']=layout.chase
 return result
def policy(value=None,meta=None):
 result=defaults(meta)
 if value is None:return result
 if not isinstance(value,dict) or set(value)-set(SCHEMA):raise ValueError('Unknown rule / invalid policy object')
 # Only a complete known release-default tuple identifies an old saved policy.
 # A custom cap that happens to equal another release's default stays custom.
 def saved_cap(rule,key):
  item=value.get(rule,{})
  return item.get('params',{}).get(key) if isinstance(item,dict) and isinstance(item.get('params',{}),dict) else None
 caps=(saved_cap('player_speed','walk'),saved_cap('player_speed','run'),saved_cap('entity_speed','maximum'))
 migrate_caps=caps in ((2.7,4.6,4.876),(2.,5.,5.4),(2.,5.,6.5))
 for name,v in value.items():
  if not isinstance(v,dict) or set(v)-{'enabled','action','params'}:raise ValueError('Invalid rule configuration: '+name)
  if 'enabled' in v and type(v['enabled']) is not bool:raise ValueError('enabled must be boolean')
  if v.get('action',result[name]['action']) not in ('reject','review'):raise ValueError('action must be reject or review')
  params=v.get('params',{})
  if name=='bot' and isinstance(params,dict):params=migrate_parameters(params)
  if not isinstance(params,dict) or set(params)-set(SCHEMA[name]['parameters']):raise ValueError('Unknown parameter: '+name)
  for k,n in params.items():
   spec=SCHEMA[name]['parameters'][k]
   if type(n) not in (int,float) or not math.isfinite(n) or not spec['min']<=n<=spec['max']:raise ValueError('Parameter outside limits: '+name+'.'+k)
   if spec['step']==1 and n!=int(n):raise ValueError('Integer required: '+name+'.'+k)
  params=dict(params)
  if migrate_caps:
   for rule,key in (('player_speed','walk'),('player_speed','run'),('entity_speed','maximum')):
    if name==rule and key in params:params[key]=result[name]['params'][key]
  result[name].update({k:v[k] for k in ('enabled','action') if k in v});result[name]['params'].update(params)
 return result

class Check:
 def __init__(self,spec,config):
  self.spec=spec;self.config=config;self.checked=0;self.failures=0;self.evidence=[];self.max_error=0;self.unavailable=None;self.details={}
 def test(self,ok,tick,message,observed=None,expected=None,entity=None,error=None):
  if not self.config['enabled']:return
  self.checked+=1
  if error is not None:self.max_error=max(self.max_error,abs(error))
  if ok:return
  self.failures+=1
  if len(self.evidence)<16:self.evidence.append(dict(tick=tick,entity=entity,message=message,observed=observed,expected=expected))
 def close(self):
  status='disabled' if not self.config['enabled'] else 'fail' if self.failures else 'inconclusive' if self.unavailable else 'pass' if self.checked else 'insufficient'
  return dict(id=self.spec['id'],title=self.spec['title'],group=self.spec['group'],status=status,action=self.config['action'],checked=self.checked,violations=self.failures,maxError=self.max_error,evidence=self.evidence,evidenceOmitted=max(0,self.failures-len(self.evidence)),reason=self.unavailable,details=self.details)

def model_binary(layout):
 system=platform.system().lower();arch=platform.machine().lower()
 if arch in ('amd64','x64'):arch='x86_64'
 family='judge' if layout.magic==b'HLR4' else 'judge-current' if layout.build>=0x01000000 else 'judge-v113' if layout.build>=0xb0002 else 'judge-v11'
 name=f'{family}-{system}-{arch}'+('.exe' if system=='windows' else '')
 folder=ROOT/'model';path=folder/name
 if not path.is_file():raise RuntimeError('当前平台没有对应版本复算引擎；请运行 build_model.py。')
 try:manifest=json.loads((folder/'manifest.json').read_text())[name]
 except (OSError,ValueError,KeyError) as e:raise RuntimeError('复算引擎版本清单缺失。') from e
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 if digest!=manifest['sha256']:raise RuntimeError('复算引擎与受信版本清单不匹配。')
 if f'0x{layout.build:08x}' not in manifest.get('supportedBuilds',[]):raise RuntimeError('复算引擎不支持该签名版本。')
 return path,manifest,name

def native_lamp_bits(meta):
 """Rebuild render-only terrain lights from the authenticated build's source."""
 layout=recording_layout(meta)
 if layout.build<0xb0003:raise RuntimeError('该签名版本未使用地形灯位。')
 path,_,_=model_binary(layout)
 try:p=subprocess.run([str(path),'--lamps',str(int(meta['seed']))],stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=30)
 except subprocess.TimeoutExpired as e:raise RuntimeError('地形灯位生成超时。') from e
 if p.returncode or len(p.stdout)!=8192:raise RuntimeError('地形灯位生成未完成。')
 return p.stdout

def native_model(meta,frames):
 if meta['frames']>900000:raise RuntimeError('记录超过复算引擎的 900000 帧上限；文件可导入，但本次模型未完成。')
 try:layout=recording_layout(meta)
 except ValueError as e:raise RuntimeError(str(e)) from e
 if len(frames)!=meta['frames']*layout.stride or len(meta['formSeeds'])!=layout.entities:raise RuntimeError('复算帧布局与版本不一致。')
 path,manifest,name=model_binary(layout)
 data=b'HJM2'+struct.pack('<I',layout.build)+struct.pack(f'<Q{layout.entities}QHHI',int(meta['seed']),*map(int,meta['formSeeds']),*meta['exit'],meta['frames'])+frames
 if layout.exit_words:
  try:samples=ExitSamples(meta)
  except (ValueError,TypeError,KeyError) as error:raise RuntimeError('逐 tick 出口快照格式无效。') from error
  if len(samples)!=meta['frames']:raise RuntimeError('当前凭证缺少完整的逐 tick 出口快照。')
  data+=samples.data
 try:p=subprocess.run([str(path)],input=data,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=90)
 except subprocess.TimeoutExpired as e:raise RuntimeError('复算超过 90 秒，未给出通过结论。') from e
 header=8+8*layout.entities;offset=header+8192;end=offset+len(frames);lamp_bytes=8192 if layout.build>=0xb0003 else 0
 if p.returncode or len(p.stdout)!=end+lamp_bytes or p.stdout[:4]!=(b'HJO2' if layout.magic==b'HLR5' else b'HJO1'):raise RuntimeError('复算引擎拒绝异常状态或未完成；需复核。')
 condition=next((value for value in ('legacy_unverified_exit','recorded_exit') if ('HALLS_TERMINAL_CONDITIONING '+value).encode() in p.stderr.splitlines()),None)
 return dict(exit=list(struct.unpack_from('<HH',p.stdout,4)),forms=list(struct.unpack_from(f'<{layout.entities}Q',p.stdout,8)),bitmap=p.stdout[header:offset],frames=p.stdout[offset:end],lampBits=p.stdout[end:] if lamp_bytes else None,engine={**manifest,'file':name},terminalConditioning=condition)

class Rows:
 def __init__(self,data,kind='f',words=72):
  self.data=data;self.unpack=struct.Struct(f'<{words}'+kind);self.stride=self.unpack.size
  if len(data)%self.stride:raise ValueError('Partial simulation frame')
 def __len__(self):return len(self.data)//self.stride
 def __getitem__(self,i):
  if i<0:i+=len(self)
  if not 0<=i<len(self):raise IndexError(i)
  return self.unpack.unpack_from(self.data,i*self.stride)

class World:
 def __init__(self,bitmap):self.bits=bitmap
 def wall(self,x,z):
  if not (0<=x<256 and 0<=z<256):return True
  i=z*256+x;return bool(self.bits[i>>3]&(1<<(i&7)))
 def fits(self,x,z,r):return all(not self.wall(math.floor((x+dx)/2),math.floor((z+dz)/2)) for dx,dz in ((0,0),(-r,-r),(-r,r),(r,-r),(r,r)))
 def distances(self,cell):
  distances=[-1]*65536
  if self.wall(*cell):return distances
  i=cell[1]*256+cell[0];distances[i]=0;q=deque([i])
  while q:
   i=q.popleft();x,z=i%256,i//256
   for dx,dz in ((0,-1),(1,0),(0,1),(-1,0)):
    nx,nz=x+dx,z+dz
    if self.wall(nx,nz):continue
    j=nz*256+nx
    if distances[j]<0:distances[j]=distances[i]+1;q.append(j)
  return distances

def clamp(v):return max(0.,min(1.,v))
def angle(a,b):return abs((a-b+math.pi)%math.tau-math.pi)
def cell(row):return [math.floor(row[6]/2),math.floor(row[8]/2)]
def cell_distance(distances,c):return distances[c[1]*256+c[0]] if 0<=c[0]<256 and 0<=c[1]<256 else -1


def assess_coin_checks(meta,frames,prior_rules,settings=None,*,model=None,model_runner=native_model,check=lambda:None):
 """Reconstruct coin checks from authenticated records and core checks."""
 layout=recording_layout(meta);config=policy(settings,meta)
 checks={key:Check(SCHEMA[key],config[key]) for key in ('coin_generation','coin_pickup')}
 coins={'available':False,'collected':0,'total':0,'items':[],'pickups':[]}
 original=[item for item in prior_rules if item.get('id') not in checks]
 generated=checks['coin_generation'];pickup=checks['coin_pickup']
 def unavailable(reason,kind):
  for item in checks.values():item.unavailable=reason;item.details={'reasonKind':kind,'blockedBy':[]}
 def prerequisites(item,rules,required):
  if not item.config['enabled']:return False
  blocked=prerequisite_states(rules,required)
  if not blocked:return True
  item.details={'reasonKind':'prerequisite_failed' if 'fail' in blocked.values() else 'prerequisite_unavailable','blockedBy':list(blocked),'prerequisiteStatus':blocked}
  if 'fail' in blocked.values():item.test(False,None,'关联游戏校验未通过，不能确认金币奖励',blocked,'all prerequisites pass')
  else:item.unavailable='关联游戏校验未启用或未完成，不能确认金币奖励。'
  return False
 if layout.build not in (0x01000000,0x01000001):
  unavailable('该凭证版本没有可用的金币复算契约。','unsupported_build')
 else:
  if model is None and model_runner is not None:
   try:model=model_runner(meta,frames)
   except (RuntimeError,OSError):model=None
  if not model or not current_coin_engine(model.get('engine'),layout.build):
   unavailable('当前版本原生模型不可用，未复算金币。','model_unavailable')
   if 'fail' in prerequisite_states(original,COIN_GENERATION_CHECKS).values():prerequisites(generated,original,COIN_GENERATION_CHECKS)
   if 'fail' in prerequisite_states(original+[generated.close()],COIN_PICKUP_CHECKS).values():prerequisites(pickup,original+[generated.close()],COIN_PICKUP_CHECKS)
  else:
   check();world=World(model['bitmap']);expected=Rows(model['frames'],words=layout.words)
   spawn=cell(expected[0]);exit_cell=model['exit']
   cells=coin_cells(world,meta['seed'],spawn,exit_cell,check)
   items=[{'id':i,'cell':at,'position':[(at[0]+.5)*meta['tile'],(at[1]+.5)*meta['tile']]} for i,at in enumerate(cells)]
   coins.update(total=len(cells),items=items)
   if model.get('lampBits') is not None:meta['_renderLampBits']=model['lampBits']
   if prerequisites(generated,original,COIN_GENERATION_CHECKS):
    valid=(len(cells)==COIN_COUNT and len({tuple(at) for at in cells})==COIN_COUNT
           and all(at!=spawn and at!=exit_cell and not world.wall(*at) for at in cells))
    generated.details={'reasonKind':'recomputed' if valid else 'reconstruction_failed','blockedBy':[],'method':'seed_native_world_coins-1','total':len(cells),'items':items,'clientDeclaration':False}
    generated.test(valid,None,'独立重建金币位置',len(cells),COIN_COUNT)
   if prerequisites(pickup,original+[generated.close()],COIN_PICKUP_CHECKS):
    rows=Rows(frames,words=layout.words);clocks=ClockSamples(meta) if meta.get('timing') else None
    found=collect_coins(rows,cells,meta['tile'],clocks,check)
    coins.update(available=True,collected=len(found),pickups=found)
    pickup.details={'reasonKind':'recomputed','blockedBy':[],'method':'verified_final_position_cell_entry','collected':len(found),'total':len(cells),'pickups':found,'clientDeclaration':False}
    pickup.test(True,None,'已复算一次性金币拾取；零次拾取同样有效',len(found),'0..3 unique pickups')
 replay={'coins':coins['items'],'coinPickups':coins['pickups']}
 meta['_objectives']=replay
 return {'coins':coins,'rules':[checks[key].close() for key in ('coin_generation','coin_pickup')],'replay':replay,'engine':model.get('engine') if model else None}


def behavior(rows,uints,distances,config,deadline=float("inf"),input_mode=None,clocks=None,platform=None,include_sparse=True):
 """Automation suspicion is exclusively the trained model's output."""
 learned=learned_observations(rows,uints,clocks,lambda:check_deadline(deadline),input_mode=input_mode,include_sparse=include_sparse)
 elapsed=sum(max(0.,row[0]) for row in rows)
 sufficient=learned['sufficient'] and elapsed>=config['min_seconds']
 score=float(round(learned['score'],2)) if sufficient else None
 reason=learned.get('reason') or ('insufficient_activity_windows' if not sufficient else None)
 return dict(modelVersion=MODEL_VERSION,mode='model_only',score=score,provisionalScore=score,sufficient=sufficient,
             duration=elapsed,threshold=config['threshold'],scoreBasis='learned' if sufficient else 'model_unavailable',
             patterns={'learned':learned},features=[dict(id='learned',label='学习行为模型',value=score,
             measurement=learned['eligibleWindows'],description='自动化可疑度仅取训练模型推理结果。')],
             unavailableReason=reason,reason=None if sufficient else '模型覆盖或有效样本不足，未输出自动化可疑度。',
             interpretation='仅使用训练模型的行为分；模型不具备判断条件时不以固定规则分兜底。')


def damage_hit(previous,predicted):
 # predicted HP comes from the independent combat model, never the submitted HP.
 return predicted[19]<previous[19]

def conditional_camera(predicted,observed_health):
 if predicted[19]>0 or observed_health<=0:return predicted[12:19]
 x,y,z,yaw,pitch=predicted[6:11];roll=0.;knocked,shock,seconds=predicted[20:23]
 if knocked>0:
  amount=knocked/.18;y-=.14*amount;pitch-=.08*amount;roll=math.sin(seconds*16)*.025*amount
 if shock>0:yaw+=math.sin(seconds*54)*.015*shock
 return x,y,z,yaw,pitch,roll,predicted[18]

def adjudicate(meta,frames,settings=None,model_runner=native_model,require_behavior_assessment=False,strict_race_reference=False):
 deadline=time.monotonic()+MAX_ANALYSIS_SECONDS;check_deadline(deadline)
 layout=recording_layout(meta);config=policy(settings,meta);checks={r['id']:Check(r,config[r['id']]) for r in RULES}
 def c(name):return checks[name]
 def p(name):return config[name]['params']
 rows=Rows(frames,words=layout.words);uints=Rows(frames,'I',layout.words);clocks=ClockSamples(meta) if meta.get('timing') else None
 exit_samples=ExitSamples(meta)
 if layout.exit_words and len(exit_samples)!=len(rows):raise ValueError('Exit snapshot count does not match recording')
 def recorded_exit(tick):return list(exit_samples[tick]) if len(exit_samples) else meta['exit']
 # Frame count/finite values have already passed the authenticated format parser.
 world=World(base64.b64decode(meta['bitmap']));first,last=rows[0],rows[-1];distances=world.distances(meta['exit'])
 model=None;engine=None
 if any(config[k]['enabled'] for k in MODEL_RULES):
  try:
   model=model_runner(meta,frames);engine=model['engine']
   if model.get('lampBits') is not None:meta['_renderLampBits']=model['lampBits']
  except (RuntimeError,OSError) as e:
   for name in MODEL_RULES:c(name).unavailable=str(e)
 expected=Rows(model['frames'],words=layout.words) if model else None
 expected_u=Rows(model['frames'],'I',layout.words) if model else None
 c('production').test(not meta['testFixture'],0,'开发测试录制不能当作正式成绩',meta['testFixture'],False)
 c('route').test(all(world.wall(x,z) for x in range(256) for z in (0,255)) and all(world.wall(x,z) for z in range(256) for x in (0,255)),0,'地图外边界必须封闭')
 c('route').test(cell_distance(distances,cell(first))>=0,0,'出生点至声明出口不可达',cell(first),meta['exit'])
 if model:
  different=sum(bin(a^b).count('1') for a,b in zip(world.bits,model['bitmap']))
  c('map').test(different<=p('map')['different_cells'],0,'地图与种子生成结果不同',different,p('map')['different_cells']);c('map').details={'differentCells':different}
  c('exit').test(meta['exit']==model['exit'],0,'初始声明出口格不是该种子的原始出口格',meta['exit'],model['exit'])
  meta['_canonicalExit']=model['exit']
  c('spawn').test(list(map(int,meta['formSeeds']))==model['forms'],0,'实体种子不属于同一次生成',meta['formSeeds'],list(map(str,model['forms'])))
  for k in [*range(6,12),*range(19,23),*[i for i in range(24,layout.words) if (i-24)%12!=11]]:
   err=abs(first[k]-expected[0][k]);c('spawn').test(err<=p('spawn')['tolerance'],0,'初始位置 / 状态不符合生成结果',first[k],expected[0][k],None if k<24 else (k-24)//12+1,error=err)
  c('spawn').test(uints[0][1]==512 and uints[0][23]==0 and all(uints[0][k]==0 for k in (n+11 for n in layout.entity_offsets)) and all(first[k]==0 for k in range(2,6)),0,'开局输入、胜负或实体状态不是默认值')
 path_length=0.;running_seconds=0.;chase_seconds=0.;hits=0;elapsed=0.;max_player_speed=0.;max_entity_speed=0.;canonical_seconds=0.;running_mode_seconds=0.;walking_seconds=0.;stationary_seconds=0.;visited=set();hit_ticks=set()
 for tick,(row,u) in enumerate(zip(rows,uints)):
  if tick%256==0:check_deadline(deadline)
  visited.add(tuple(cell(row)))
  dt=row[0];elapsed+=max(0,dt);prev=rows[tick-1] if tick else None
  at_exit=recorded_exit(tick);exit_valid=valid_cell(at_exit)
  if len(exit_samples):
   c('exit').test(exit_valid and not world.wall(*at_exit),tick,'实录出口必须在地图可行走格内',at_exit,'floor cell')
   if not tick:c('exit').test(at_exit==meta['exit'],tick,'首帧出口与初始声明不一致',at_exit,meta['exit'])
   if model:c('exit').test(at_exit==model['exit'],tick,'出口位置偏离原始生成位置',at_exit,model['exit'])
  c('clock').test(valid_tick_dt(tick,row,prev,clocks,p('clock')['max_dt']),tick,'tick 时长超出限制',dt,p('clock')['max_dt'])
  c('clock').test(u[1]&~2047==0 and u[23]&~3==0,tick,'未知状态标志', [u[1],u[23]],'输入 11 位、结局 2 位')
  c('clock').test(0<=row[6]<512 and 0<=row[8]<512 and abs(row[7]-meta['eye'])<.005 and -.001<=row[9]<=math.tau+.001 and abs(row[10])<=1.101 and 0<=row[20]<=.181 and 0<=row[21]<=.301 and row[11]>=0,tick,'玩家状态范围异常')
  if tick:
   before_seconds=canonical_seconds;canonical_seconds=struct.unpack('<f',struct.pack('<f',canonical_seconds+dt))[0]
   c('clock').test(abs(row[22]-canonical_seconds)<=p('clock')['tolerance'] or (tick==len(rows)-1 and abs(row[22]-before_seconds)<=p('clock')['tolerance']),tick,'累计时间偏离从开局逐 tick 相加的时钟',row[22],canonical_seconds)
  c('combat').test(min(abs(row[19]-hp) for hp in (100,66,32,0))<=p('combat')['tolerance'],tick,'生命值不属于原版伤害产生的离散状态',row[19],[100,66,32,0])
  c('completion').test((u[23]==1 and row[19]>0 and exit_valid and in_exit(row[6],row[8],at_exit,meta['tile'])) if tick==len(rows)-1 else (u[23]==0 and row[19]>0),tick,'最后一帧必须存活且已进入实录出口地块，无需抵达中心',{'state':u[23],'hp':row[19],'positionMeters':[row[6],row[8]]},{'boundsMeters':exit_bounds(at_exit,meta['tile']) if exit_valid else None,'source':'per_tick_exit' if len(exit_samples) else 'legacy_header','rule':'min <= position < max'} if tick==len(rows)-1 else '仍在游戏中')
  c('route').test(world.fits(row[6],row[8],.22-p('route')['clearance_tolerance']),tick,'玩家身体与墙体相交',[row[6],row[8]],'半径 0.22m 的可行走区域')
  if prev:
   moved=math.hypot(row[6]-prev[6],row[8]-prev[8]);path_length+=moved;hit=damage_hit(prev,expected[tick]) if expected else row[19]<prev[19];hits+=hit
   if hit:hit_ticks.add(tick)
   active_move=moved>.001 and math.hypot(row[2],row[3])>.001
   running_mode_seconds+=max(0,dt)*bool(u[1]&256)
   running_seconds+=max(0,dt)*bool(u[1]&256)*active_move
   walking_seconds+=max(0,dt)*(not bool(u[1]&256))*active_move
   stationary_seconds+=max(0,dt)*(moved<=.001)
   chase_seconds+=max(0,dt)*any(u[k]==2 for k in (n+11 for n in layout.entity_offsets))
   max_player_speed=max(max_player_speed,moved/max(dt,1e-9) if not hit else 0)
   maximum=(p('player_speed')['run'] if u[1]&256 else p('player_speed')['walk'])*max(0,dt)+(p('player_speed')['knockback'] if hit else 0)+p('player_speed')['tolerance']
   c('player_speed').test(moved<=maximum,tick,'玩家位移超过速度 / 击退上限',moved,maximum)
   clock_expected=prev[22]+dt
   # Arrival from input short-circuits Game.tick; a knockback victory does not.
   c('clock').test(abs(row[22]-clock_expected)<=p('clock')['tolerance'] or (tick==len(rows)-1 and abs(row[22]-prev[22])<=p('clock')['tolerance']),tick,'累计游戏时间与 tick 不一致',row[22],clock_expected)
   inp=p('input');speed=layout.run if u[1]&256 else layout.walk
   c('input').test(math.hypot(row[2],row[3])<=speed*max(dt,0)+inp['tolerance'] and abs(row[4])<=1.65*max(dt,0)+inp['tolerance'] and abs(row[5])<=1.1*max(dt,0)+inp['tolerance'],tick,'输入量超过每帧允许值',list(row[2:6]),'归一化速度 / Windows 转向上限')
   if inp['exact_keys'] and meta.get('inputMode')!='pulse':
    f=(bool(u[1]&1)-bool(u[1]&2))*speed*dt;s=(bool(u[1]&8)-bool(u[1]&4))*speed*dt
    length=math.hypot(f,s)
    if length>speed*dt and length>0:f*=speed*dt/length;s*=speed*dt/length
    action=[f,s,(bool(u[1]&32)-bool(u[1]&16))*1.65*dt,(bool(u[1]&64)-bool(u[1]&128))*1.1*dt]
    if prev[20]>0:action=[0]*4
    c('input').test(max(abs(a-b) for a,b in zip(row[2:6],action))<=inp['tolerance'],tick,'有效动作与记录按键不对应',list(row[2:6]),action)
   if meta.get('inputMode')=='pulse':
    flags=u[1]&255
    derived=(1 if row[2]>0 else 2 if row[2]<0 else 0)|(8 if row[3]>0 else 4 if row[3]<0 else 0)|(32 if row[4]>0 else 16 if row[4]<0 else 0)|(64 if row[5]>0 else 128 if row[5]<0 else 0)
    c('input').test(flags==derived,tick,'Pulse direction flags do not match effective input',flags,derived)
    if prev[20]>0:c('input').test(max(map(abs,row[2:6]))<=inp['tolerance'],tick,'Pulse movement during hit lockout')
   if cell(row)!=cell(prev):
    count=min(1024,max(1,math.ceil(moved/.1)))
    crosses=any(world.wall(math.floor((prev[6]+(row[6]-prev[6])*t/count)/2),math.floor((prev[8]+(row[8]-prev[8])*t/count)/2)) for t in range(1,count))
    c('route').test(not crosses,tick,'玩家跨格路径穿墙')
  elif row[22]!=0:c('clock').test(False,0,'初始累计时间必须为零',row[22],0)
  for e,k in enumerate(layout.entity_offsets,1):
   c('clock').test(0<=row[k]<512 and 0<=row[k+1]<512 and 0<=row[k+6]<=100 and 0<=row[k+7]<=layout.chase+.001 and 0<=row[k+4]<=1.001 and 0<=row[k+5]<=.401 and u[k+11]<=3,tick,'实体状态范围异常',entity=e)
   c('route').test(world.fits(row[k],row[k+1],.26-p('route')['clearance_tolerance']),tick,'实体身体与墙体相交',[row[k],row[k+1]],'半径 0.26m 的可行走区域',e)
   if prev:
    moved=math.hypot(row[k]-prev[k],row[k+1]-prev[k+1]);max_entity_speed=max(max_entity_speed,moved/max(dt,1e-9))
    maximum=p('entity_speed')['maximum']*max(0,dt)+p('entity_speed')['tolerance']
    c('entity_speed').test(moved<=maximum,tick,'实体位移超过最大速度',moved,maximum,e)
    if (int(row[k]/2),int(row[k+1]/2))!=(int(prev[k]/2),int(prev[k+1]/2)):
     count=min(1024,max(1,math.ceil(moved/.1)))
     crosses=any(world.wall(math.floor((prev[k]+(row[k]-prev[k])*t/count)/2),math.floor((prev[k+1]+(row[k+1]-prev[k+1])*t/count)/2)) for t in range(1,count))
     c('route').test(not crosses,tick,'实体跨格路径穿墙',entity=e)
  if expected and not tick:
   for k in range(12,19):
    error=abs(row[k]-expected[0][k]);c('camera').test(error<=p('camera')['tolerance'],0,'初始视觉相机不一致',row[k],expected[0][k],error=error)
  if expected and tick:
   exp=expected[tick];eu=expected_u[tick]
   def compare(name,k,tolerance,label,e=None,angular=False):
    error=angle(row[k],exp[k]) if angular else abs(row[k]-exp[k]);c(name).test(error<=tolerance,tick,label,row[k],exp[k],e,error)
   for k in (6,7,8,11):compare('player_model',k,p('player_model')['position'],'玩家运动 / 碰撞复算不一致')
   for k in (9,10):compare('player_model',k,p('player_model')['angle'],'玩家转向复算不一致',angular=k==9)
   # A health modification must fail combat, not manufacture a death-camera fault.
   # Keep the model's independently predicted movement and hit timers.
   visual=conditional_camera(exp,row[19])
   for k in range(12,19):
    error=angle(row[k],visual[k-12]) if k==15 else abs(row[k]-visual[k-12])
    c('camera').test(error<=p('camera')['tolerance'],tick,'视觉相机复算不一致',row[k],visual[k-12],error=error)
   for k in (19,20,21):compare('combat',k,p('combat')['tolerance'],'伤害 / 受击状态复算不一致')
   c('combat').test((u[23]&2)==(eu[23]&2),tick,'模型死亡状态不一致',u[23]&2,eu[23]&2)
   if len(exit_samples) and max(abs(row[k]-exp[k]) for k in (6,8))<=p('player_model')['position']:
    c('completion').test((u[23]&1)==(eu[23]&1),tick,'出口触发的胜利状态不一致',u[23]&1,eu[23]&1)
   for e,k in enumerate(layout.entity_offsets,1):
    for j in (0,1,3):compare('entity_motion',k+j,p('entity_motion')['position'],'实体位置 / 里程复算不一致',e)
    compare('entity_motion',k+2,p('entity_motion')['angle'],'实体转向复算不一致',e,True)
    for j in (4,7,10):compare('entity_motion',k+j,p('entity_motion')['state'],'实体移动 / 动画 / 寻路计时不一致',e)
    compare('entity_ai',k+6,p('entity_ai')['hate'],'实体仇恨增长 / 衰减不一致',e)
    compare('entity_ai',k+8,p('entity_ai')['time'],'实体感知时刻不一致',e)
    c('entity_ai').test(u[k+11]==eu[k+11],tick,'实体 AI 状态不一致',u[k+11],eu[k+11],e)
    for j in (5,9):compare('combat',k+j,p('combat')['tolerance'],'实体攻击 / 冷却不一致',e)
 bot=behavior(rows,uints,distances,p('bot'),deadline,meta.get('inputMode'),clocks,meta.get('platform'),include_sparse=require_behavior_assessment) if config['bot']['enabled'] else None
 if bot:
  require_assessment(c('bot'),bot,require_behavior_assessment)
  c('bot').details=bot
  if bot['sufficient']:c('bot').test(bot['score']<=p('bot')['threshold'],None,'自动化可疑度超过复核阈值',bot['score'],p('bot')['threshold'])
 if meta.get('battery'):
  c('flashlight').details=judge_battery(meta,frames,c('flashlight'),p('flashlight'),lambda:check_deadline(deadline))
 else:c('flashlight').unavailable='记录缺少电池状态。'
 timing_details=None
 if meta.get('timing'):
  timing_details=judge_timing(meta,frames,lambda rule,tick,ok,message,observed,expected:c(rule).test(ok,tick,message,observed,expected),p('time_sources'),p('speed_control'))
  c('time_sources').details=meta.get('timeInfo',{});c('speed_control').details=timing_details
 else:
  for name in ('time_sources','speed_control'):c(name).unavailable='旧凭证没有独立现实计时，无法核实是否使用变速器。'
 results=[checks[r['id']].close() for r in RULES]
 shortest=cell_distance(distances,cell(first));cell_changes=0
 for tick in range(1,len(rows)):
  if tick%1024==0:check_deadline(deadline)
  cell_changes+=sum(abs(x-y) for x,y in zip(cell(rows[tick-1]),cell(rows[tick])))
 efficiency=clamp(shortest/max(cell_changes,1)) if shortest>=0 else 0
 client_completed=uints[-1][23]==1 and last[19]>0
 final_exit=recorded_exit(len(rows)-1)
 completed=client_completed and valid_cell(final_exit) and in_exit(last[6],last[8],final_exit,meta['tile'])
 meta['_exitCompletionMismatch']=bool(client_completed and not completed)
 c('exit').details={'recordedInitial':meta['exit'],'canonical':model['exit'] if model else None,'finalRecorded':final_exit,'timelineAvailable':bool(len(exit_samples)),'changes':max(0,len(meta.get('exitEvents',[]))-1),'clientVictory':client_completed,'completionMatchesRecordedExit':completed,'terminalConditioning':model.get('terminalConditioning') if model else None}
 verified={item['id'] for item in results if item['status']=='pass'}
 movement_checks={'map','spawn','exit','route','input','player_model','player_speed','clock','speed_control'}
 tactics_checks=movement_checks|{'entity_motion','entity_ai','entity_speed','combat'}
 tactics={'available':False,'factor':0.,'stealth':False,'distinctEscapes':0,'escapes':[]}
 reference_world=world;reference_start=(first[6],first[8]);reference_exit=meta['exit']
 if layout.build>=0x01000000 and model:
  reference_world=World(model['bitmap']);reference_start=(expected[0][6],expected[0][8]);reference_exit=model['exit']
  if tactics_checks<=verified:
   tactics=tactical_metrics(rows,expected,expected_u,layout.entity_offsets,hit_ticks,lambda:check_deadline(deadline))
 coin_result=assess_coin_checks(meta,frames,results,config,model=model,model_runner=None,check=lambda:check_deadline(deadline))
 coins=coin_result['coins'];coin_rules={item['id']:item for item in coin_result['rules']}
 results=[coin_rules.get(item['id'],c('exit').close() if item['id']=='exit' else item) for item in results]
 failed=[r['id'] for r in results if r['status']=='fail' and r['action']=='reject'];review=[r['id'] for r in results if r['status']=='inconclusive' or (r['status']=='fail' and r['action']=='review')];disabled=[r['id'] for r in results if r['status']=='disabled'];insufficient=[r['id'] for r in results if r['status']=='insufficient']
 verdict='rejected' if failed else 'review' if review else 'not_assessed' if len(disabled)==len(results) else 'accepted_limited' if disabled or insufficient else 'accepted'
 labels={'rejected':'不合法 · 未通过当前规则','review':'待复核 · 存在行为疑点或检查未完成','not_assessed':'未判定 · 所有规则已关闭','accepted_limited':'符合已完成规则 · 部分项目未判定','accepted':'合法 · 通过当前规则'}
 race=reference_route(reference_world,reference_start,reference_exit,speed=layout.run,check=lambda:check_deadline(deadline))
 race_timing=timing_reference(reference_world,reference_start,reference_exit,race,layout.run,lambda:check_deadline(deadline)) if strict_race_reference else None
 operations=operation_metrics(frames,lambda:check_deadline(deadline),hit_ticks=hit_ticks if expected else None,words=layout.words)
 normalized=json.dumps(config,sort_keys=True,separators=(',',':')).encode()
 report=dict(reportVersion=VERSION,generatedAt=datetime.now(timezone.utc).isoformat(),verdict=verdict,label=labels[verdict],failed=failed,review=review,disabled=disabled,insufficient=insufficient,proof={k:meta[k] for k in ('sha256','signature','keyId','fileBytes','version','runId','seed','frames','testFixture')},policy=config,policySha256=hashlib.sha256(normalized).hexdigest(),engine=engine,coverage={'enabled':len(results)-len(disabled),'total':len(results),'rulesCompleted':sum(r['status'] in ('pass','fail') for r in results),'allTicks':len(rows),'modelTicks':len(rows) if model else 0,'evidenceLimitPerRule':16},metrics=dict(duration=elapsed,pathMeters=path_length,recordedMeters=last[11],shortestCells=shortest,walkedCells=cell_changes,routeEfficiency=efficiency,spawn=cell(first),exit=meta['exit'],exitBounds=exit_bounds(meta['exit'],meta['tile']),remainingHealth=last[19],hits=hits,runningSeconds=running_seconds,runningModeSeconds=running_mode_seconds,walkingSeconds=walking_seconds,stationarySeconds=stationary_seconds,visitedCells=len(visited),chaseSeconds=chase_seconds,maxPlayerSpeed=max_player_speed,maxEntitySpeed=max_entity_speed),rules=results,bot=bot,performance=None,importChecks=meta.get('importChecks',{}),method='逐帧条件复算：以上一帧实录公开状态为起点，保留模型重建的寻路、随机数、感知、攻击与伤害内部状态。所有帧均参与，证据列表只展示前 16 条；不是端到端逐位相等认证。',limitations=['自动化可疑度仅取离线训练模型；真人标注样本有限，分数不是自动化概率。','模型采用固定版本游戏逻辑；跨平台浮点或临界寻路分支可能需要人工复核和调整容差。','文件完整性和行为一致性提高伪造成本，不证明输入一定来自真人。'])
 report['metrics'].update(duration=meta.get('duration',elapsed),simulationDuration=elapsed,wallDuration=meta.get('replayDuration'),timing=meta.get('timeInfo'),speedControl=timing_details,completed=completed,clientCompleted=client_completed,exitTrace=c('exit').details,raceReference=race,operations=operations,coins=coins,tactics=tactics)
 if race_timing is not None:report['metrics']['raceTiming']=race_timing
 try:report['informationAudit']=information_audit(world,rows,meta['exit'],distances,check=lambda:check_deadline(deadline))
 except Exception:
  # Optional shadow diagnostics must never invalidate an otherwise finished judge.
  logging.getLogger(__name__).exception('Optional information audit did not finish')
  report['informationAudit']={'version':'information-shadow-1','mode':'shadow','status':'unavailable','affectsScore':False,'affectsVerdict':False,'coverage':{'complete':False},'evidence':[]}
 report['metrics']['referenceAudit']={'kind':'feasible_route_upper_bound','globallyExact':bool(race.get('exactOptimality')),'recordedBelowReference':bool(race.get('available') and path_length+0.01<race['distance']),'differenceMeters':round(path_length-race['distance'],6) if race.get('available') else None,'meaning':'合法路径短于参考线只说明近似基准可改进，不构成作弊证据。'}
 report['performance']=evaluate_report(report)
 return report
