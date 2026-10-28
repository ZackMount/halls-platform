import base64,struct,tempfile,unittest
from pathlib import Path
from replay import ChaseIntervals,chase_from_recording,chase_from_visual,convert
class ChaseTests(unittest.TestCase):
 def test_ranges_merge_entity_handoffs_and_close_at_end(self):
  c=ChaseIntervals()
  for time,chasing in [(0,False),(1,True),(2,True),(3,False),(5,True)]:c.update(time,chasing)
  self.assertEqual(c.finish(8),[[1,3],[5,8]])
 def test_converter_uses_any_entity_and_sample_backfill_matches(self):
  rows=[]
  for i in range(6):
   f=[0.]*72;f[0]=.1 if i else 0;f[6:9]=[3,1.55,3];f[19]=100;b=bytearray(struct.pack('<72f',*f))
   if i in (1,2):struct.pack_into('<I',b,(35 if i==1 else 47)*4,2)
   if i==4:struct.pack_into('<I',b,71*4,2)
   rows.append(b)
  data=b''.join(rows);m={'frames':6,'seed':'1','spawnPosition':[3,3],'tile':2,'duration':.5,'ceiling':2.65,'eye':1.55,'exit':[5,1],'bitmap':base64.b64encode(bytes(8192)).decode(),'formSeeds':['1','2','3','4']}
  self.assertEqual(chase_from_recording(m,data),[[.1,.3],[.4,.5]])
  with tempfile.TemporaryDirectory() as d:
   manifest=convert(m,data,Path(d));self.assertEqual(manifest['chaseRanges'],[[.1,.3],[.4,.5]]);self.assertEqual(chase_from_visual(Path(d),manifest),manifest['chaseRanges'])

 def test_fifth_entity_is_included_without_reinterpreting_legacy_stride(self):
  rows=[]
  for i in range(6):
   f=[0.]*84;f[0]=.1 if i else 0;f[6:9]=[3,1.55,3];f[19]=100;b=bytearray(struct.pack('<84f',*f))
   if i in (2,3):struct.pack_into('<I',b,83*4,2)
   struct.pack_into('<f',b,72*4,213.5+i);rows.append(b)
  data=b''.join(rows);m={'recordingBuild':0xb0000,'entities':5,'words':84,'recordWords':97,'frames':6,'seed':'1','spawnPosition':[3,3],'tile':2,'duration':.5,'ceiling':2.65,'eye':1.55,'exit':[5,1],'bitmap':base64.b64encode(bytes(8192)).decode(),'formSeeds':['1','2','3','4','5']}
  self.assertEqual(chase_from_recording(m,data),[[.2,.4]])
  with tempfile.TemporaryDirectory() as d:
   manifest=convert(m,data,Path(d));self.assertEqual(manifest['entities'],5);self.assertEqual(manifest['words'],84)
   self.assertEqual(chase_from_visual(Path(d),manifest),[[.2,.4]])
