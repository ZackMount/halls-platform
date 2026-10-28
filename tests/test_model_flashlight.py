"""Exercise native AI predictions across real lamp input/battery transitions.

The synthetic observed scene keeps an entity eight metres away, facing a silent
player in a clear corridor. It is visible only with the flashlight switched on.
No user recording or signing key is needed for this model protocol regression.
"""
import base64,math,platform,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from battery import advance,f32
from judge import Rows,native_model
from layout import LAYOUTS,CURRENT_BUILD


NATIVE=Path(__file__).resolve().parents[1]/'engine/model'
@unittest.skipUnless(list(NATIVE.glob('judge-current-'+platform.system().lower()+'-*')) and list(NATIVE.glob('judge-v11-'+platform.system().lower()+'-*')) and list(NATIVE.glob('judge-v113-'+platform.system().lower()+'-*')),'Build native judges first')
class ModelFlashlightTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.scenes={}
  for build in (0xb0000,0xb0001,0xb0002,0xb0003,0x01000000,CURRENT_BUILD):
   meta={'recordingBuild':build,'version':LAYOUTS[build].version,'seed':'19','formSeeds':['1','2','3','4','5'],'exit':[1,1],'frames':2}
   if LAYOUTS[build].exit_words:meta['exitSamples']={'samples':base64.b64encode(struct.pack('<II',*meta['exit'])*2).decode(),'encoding':'u32le-pair'}
   initial=native_model(meta,bytes(2*336));bits=initial['bitmap']
   def open_cell(x,z):return not bits[(z*256+x)//8]&(1<<(x%8))
   x,z=next((x,z) for z in range(2,254) for x in range(2,249) if all(open_cell(x+d,z) for d in range(6)))
   row=list(struct.unpack_from('<84I',initial['frames']))
   def put(at,value):row[at]=struct.unpack('<I',struct.pack('<f',value))[0]
   # Public-state anchoring is intentional: only independently reconstructed
   # sight timers and battery inputs decide whether the model predicts contact.
   row[1]=512;row[23]=0;row[35]=0
   for at,value in ((6,x*2+9.),(8,z*2+1.),(11,0.),(22,10.),(24,x*2+1.),(25,z*2+1.),(26,math.pi/2),(30,0.),(32,0.)):
    put(at,value)
   cls.scenes[build]=(meta,row)
 def predict(self,build,count,toggles=(),claimed_on=None):
  meta,original=self.scenes[build];rows=[];on=True;state=(100.,0.,1);states=[];seconds=10.
  for tick in range(count+1):
   row=list(original);dt=f32(.05) if tick else 0.
   if tick:state,on=advance(state,on,dt,tick in toggles);seconds=f32(seconds+dt)
   row[0]=struct.unpack('<I',struct.pack('<f',dt))[0]
   row[1]=(512 if (on if claimed_on is None else claimed_on) else 0)|(1024 if tick in toggles else 0)
   row[22]=struct.unpack('<I',struct.pack('<f',seconds))[0]
   rows.append(struct.pack('<84I',*row));states.append(on)
  meta={**meta,'frames':len(rows)}
  if LAYOUTS[build].exit_words:meta['exitSamples']={'samples':base64.b64encode(struct.pack('<II',*meta['exit'])*len(rows)).decode(),'encoding':'u32le-pair'}
  result=native_model(meta,b''.join(rows))
  return list(Rows(result['frames'],words=84)),states
 def test_switching_off_keeps_the_eight_metre_entity_unaware_then_on_reveals_it(self):
  for build in self.scenes:
   with self.subTest(build=hex(build)):
    rows,on=self.predict(build,45,toggles=(1,25))
    self.assertFalse(any(on[1:25]));self.assertTrue(all(on[25:]))
    self.assertTrue(all(row[30]==0 and row[32]==0 for row in rows[1:25]))
    self.assertGreater(rows[30][30],35.)
    self.assertAlmostEqual(rows[30][32],rows[30][22],places=4)
 def test_exhaustion_stays_dark_through_recharge_until_the_next_switch(self):
  for build in self.scenes:
   with self.subTest(build=hex(build)):
    rows,on=self.predict(build,2640,toggles=(2620,))
    dark=next(i for i in range(1,len(on)) if not on[i])
    self.assertTrue(1999<=dark<=2002)
    self.assertFalse(any(on[dark:2620]))
    self.assertTrue(all(row[30]==0 and row[32]==0 for row in rows[dark:2620]))
    self.assertTrue(all(on[2620:]));self.assertGreater(rows[2630][30],35.)
 def test_ai_does_not_trust_a_post_tick_flag_that_claims_the_off_lamp_is_on(self):
  for build in self.scenes:
   with self.subTest(build=hex(build)):
    rows,_=self.predict(build,25,toggles=(1,),claimed_on=True)
    self.assertTrue(all(row[30]==0 and row[32]==0 for row in rows[1:]))

if __name__=='__main__':unittest.main()
