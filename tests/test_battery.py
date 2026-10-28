import base64,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from battery import advance,advance_legacy,judge_battery,f32
from judge import Check,SCHEMA,defaults
from scoring import penalties,DEFAULT_DEDUCTIONS

class BatteryTests(unittest.TestCase):
 def fixture(self,legacy=False):
  step=advance_legacy if legacy else advance
  state=(100.,0.,1);on=True;frames=bytearray();battery=bytearray()
  for i in range(4001):
   dt=f32(.05 if i else 0);toggle=i in (300,350,600,640,3500);state,on=step(state,on,dt,toggle)
   row=[0]*72;row[0]=struct.unpack('<I',struct.pack('<f',dt))[0];row[1]=int(on)*512+int(toggle)*1024
   frames.extend(struct.pack('<72I',*row));battery.extend(struct.pack('<ffI',*state))
  return {'version':'0.10.0' if legacy else '0.10.1','frames':4001,'battery':{'samples':base64.b64encode(battery).decode()}},frames
 def check(self,meta,frames):
  config=defaults()['flashlight'];check=Check(SCHEMA['flashlight'],config);judge_battery(meta,frames,check,config['params']);return check.close()
 def test_legitimate_discharge_delayed_recharge_and_rounded_billing(self):
  meta,frames=self.fixture();self.assertEqual(self.check(meta,frames)['status'],'pass')
 def test_frozen_charge_fast_charge_and_skipped_wait_are_detected(self):
  for field,value in [(0,100.),(0,100000.),(1,3.)]:
   meta,frames=self.fixture();data=bytearray(base64.b64decode(meta['battery']['samples']))
   for tick in range(301,340):struct.pack_into('<f',data,tick*12+field*4,value)
   meta['battery']['samples']=base64.b64encode(data).decode();rule=self.check(meta,frames);self.assertEqual(rule['status'],'fail')
   loss,_=penalties({'rules':[rule]},DEFAULT_DEDUCTIONS);self.assertEqual(loss['combat'],10)
 def test_forced_lamp_and_missing_switch_evidence_are_detected(self):
  for word in (512,0):
   meta,frames=self.fixture();struct.pack_into('<I',frames,350*288+4,word)
   self.assertEqual(self.check(meta,frames)['status'],'fail')
 def test_old_signed_client_build_keeps_its_original_rules(self):
  meta,frames=self.fixture(legacy=True);self.assertEqual(self.check(meta,frames)['status'],'pass')
  meta['version']='0.10.1';self.assertEqual(self.check(meta,frames)['status'],'fail')
 def test_off_is_immediate_and_only_charge_is_rounded(self):
  for duration,cost in ((0,1),(.01,1),(.99,1),(1,1),(1.01,2),(2.01,3)):
   state,on=advance((100.,0.,1),True,duration)
   state,on=advance(state,on,0.,True)
   self.assertFalse(on);self.assertAlmostEqual(state[0],100-cost,places=4);self.assertEqual(state[1],0)
   state,on=advance(state,on,3.);self.assertAlmostEqual(state[0],100-cost,places=4)
   state,on=advance(state,on,.125);self.assertAlmostEqual(state[0],100.5-cost,places=4)
 def test_exact_second_sums_are_not_rounded_twice(self):
  for delta,count in ((.05,20),(1/30,30),(.01,100),(.02,3000)):
   state=(100.,0.,1);on=True
   for _ in range(count):state,on=advance(state,on,delta)
   state,on=advance(state,on,0.,True)
   self.assertAlmostEqual(state[0],100-delta*count,delta=.02)
 def test_terminal_frame_freezes_energy_but_keeps_pending_switch(self):
  self.assertEqual(advance((42.,.5,1),True,.05,True,True),((42.,.5,0),True))
 def test_matches_real_native_float32_trace(self):
  path=Path(__file__).resolve().parents[2]/'halls-client/output/battery-reference.bin'
  if not path.exists():self.skipTest('Build the native battery_fixture for cross-language verification')
  state=(100.,0.,1);on=True
  for i,(dt,toggle,actual_on,charge,age,wanted) in enumerate(struct.iter_unpack('<fIIffI',path.read_bytes())):
   state,on=advance(state,on,dt,bool(toggle));self.assertEqual(((state[0],f32(state[1]),state[2]),on),((charge,age,wanted),bool(actual_on)),i)
