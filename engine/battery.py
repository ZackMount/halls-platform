"""Independent, float32 replay of the client lamp's charge and switching rules."""
import base64,math,struct
try:from layout import recording_layout
except ModuleNotFoundError:from .layout import recording_layout

def f32(v):return struct.unpack('<f',struct.pack('<f',v))[0]

class BatterySamples:
 def __init__(self,meta):self.data=base64.b64decode(meta['battery']['samples'],validate=True)
 def __getitem__(self,i):return struct.unpack_from('<ffI',self.data,i*12)

def advance_legacy(state,on,dt,toggle=False,terminal=False,params=None):
 p=params or {'drain':1.,'charge':4.,'minimum_on':1.,'recharge_delay':3.}
 energy,age,wanted=state;wanted=bool(wanted);dt=f32(dt)
 if toggle and (wanted or energy>=p['drain']*p['minimum_on']):wanted=not wanted
 if terminal:return (energy,age,int(wanted)),on
 if not on and wanted:
  if energy>=p['drain']*p['minimum_on']:on=True;age=0.
  else:wanted=False
 spent=0.
 if on:
  spent=min(dt,max(0.,energy)/p['drain'])
  if not wanted:spent=min(spent,max(0.,f32(p['minimum_on']-age)))
  energy=max(0.,f32(energy-f32(spent*p['drain'])));age=min(p['minimum_on'],f32(age+spent))
  if energy==0 or not wanted and age>=p['minimum_on']:
   on=False;age=0.
   if energy==0:wanted=False
 if not on:
  rest=f32(dt-spent);charging=max(0.,f32(rest-max(0.,f32(p['recharge_delay']-age))))
  energy=min(100.,f32(energy+f32(charging*p['charge'])));age=min(p['recharge_delay'],f32(age+rest))
 return (energy,age,int(wanted)),on

def advance(state,on,dt,toggle=False,terminal=False,params=None):
 # minimum_on is the existing policy key; for 0.10.1 it is a billing unit,
 # not a restriction on how soon the player may switch the light off.
 p=params or {'drain':1.,'charge':4.,'minimum_on':1.,'recharge_delay':3.}
 unit=p['minimum_on'];energy,age,wanted=state;wanted=bool(wanted);dt=f32(dt)
 if toggle and (wanted or energy>=p['drain']*max(unit,0.000001)):wanted=not wanted
 if terminal:return (energy,age,int(wanted)),on
 spent=0.
 if on:
  spent=min(dt,max(0.,f32(energy/p['drain'])))
  energy=max(0.,f32(energy-f32(spent*p['drain'])));age+=spent
  if energy==0:on=False;wanted=False;age=0.
 if not on:
  rest=f32(dt-spent);charging=max(0.,rest-max(0.,p['recharge_delay']-age))
  energy=min(100.,f32(energy+f32(charging*p['charge'])));age=min(p['recharge_delay'],age+rest)
 if on and not wanted:
  billed=max(unit,math.ceil(f32((age-.00001)/unit))*unit) if unit>0 else age
  extra=f32(max(0.,billed-age)*p['drain']);energy=max(0.,f32(energy-extra));on=False;age=0.
 elif not on and wanted:
  if energy>=p['drain']*max(unit,0.000001):on=True;age=0.
  else:wanted=False
 return (energy,age,int(wanted)),on

def judge_battery(meta,frames,check,params,deadline_check=lambda:None):
 rounded=meta.get('version')!='0.10.0';step=advance if rounded else advance_legacy;stride=recording_layout(meta).stride
 samples=BatterySamples(meta);expected=(100.,0.,1);on=True;minimum=100.;on_seconds=0.;switches=0
 for tick in range(meta['frames']):
  if tick%1024==0:deadline_check()
  dt=struct.unpack_from('<f',frames,tick*stride)[0]
  flags=struct.unpack_from('<I',frames,tick*stride+4)[0];terminal=struct.unpack_from('<I',frames,tick*stride+92)[0]!=0
  if tick:
   was_on=on;before_energy=expected[0];expected,on=step(expected,on,dt,bool(flags&1024),terminal,params);switches+=was_on!=on
   if rounded and was_on and not terminal:on_seconds+=min(dt,max(0.,before_energy)/params['drain'])
  else:check.test(not flags&1024,0,'开局出现额外的手电筒操作')
  energy,age,wanted=samples[tick];minimum=min(minimum,energy)
  check.test(0<=energy<=100 and 0<=age<=max(100/params['drain']+.1 if rounded else params['minimum_on'],params['recharge_delay']),tick,'电量或灯具计时超出范围',[energy,age],'0–100% / 合法计时')
  check.test(abs(energy-expected[0])<=params['tolerance'],tick,'手电筒电量与消耗、充电规则不符',energy,expected[0],error=abs(energy-expected[0]))
  check.test(abs(age-expected[1])<=params['tolerance'] and wanted==expected[2],tick,'手电筒耗电计费或充电等待时间不符',[age,wanted],list(expected[1:]))
  check.test(bool(flags&512)==on,tick,'手电筒开关状态与剩余电量不符',bool(flags&512),on)
  if not rounded and flags&512:on_seconds+=dt
 return {'minimumCharge':minimum,'finalCharge':samples[meta['frames']-1][0],'litSimulationSeconds':on_seconds,'switches':switches}
