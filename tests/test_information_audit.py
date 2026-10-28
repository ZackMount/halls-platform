import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from information_audit import information_audit,sight
from judge import World
from scoring import evaluate_report
from test_competitive import sample,world

def corridors(cells):
 bits=bytearray(b'\xff'*8192)
 for x,z in cells:bits[(z*256+x)//8]&=~(1<<(x%8))
 return World(bits)
def rows_for(points,entities=None):
 rows=[]
 for i,point in enumerate(points):
  r=[0.]*72;r[0]=.25 if i else 0;r[6],r[8]=point;r[19]=100
  for e in range(4):r[24+e*12],r[25+e*12]=(entities[i] if entities else (501.,501.))
  rows.append(r)
 return rows

def junction_world():
 cells={(x,20) for x in range(14,29)}|{(20,z) for z in range(14,21)}|{(x,14) for x in range(20,29)}|{(28,z) for z in range(14,21)}
 return corridors(cells)
def junction_points():return [(x*2+1.,41.) for x in range(14,21)]+[(41.,39.),(41.,37.),(41.,35.)]
class InformationAuditTests(unittest.TestCase):
 def test_sight_obeys_walls_and_corner_supercover(self):
  w=corridors({(1,1),(2,2)})
  self.assertFalse(sight(w,(3,3),(5,5)))
  w=corridors({(1,1),(2,1),(1,2),(2,2)})
  self.assertTrue(sight(w,(3,3),(5,5)));self.assertTrue(sight(w,(5,5),(3,3)))
 def test_blind_junction_observes_progress_without_a_cheat_verdict(self):
  w=junction_world();a=information_audit(w,rows_for(junction_points()),(24,14),w.distances((24,14)))
  self.assertEqual(a['junctions']['unexplainedChoices'],1,a)
  self.assertEqual(a['junctions']['exitImprovingChoices'],1)
  self.assertFalse(a['affectsScore']);self.assertFalse(a['affectsVerdict']);self.assertEqual(a['status'],'observations_only')
  r=sample();before=evaluate_report(r);r['informationAudit']=a;self.assertEqual(evaluate_report(r),before)
 def test_previous_sight_and_revisited_junction_are_not_unknown(self):
  w=junction_world();points=[(49.,29.),(41.,29.)]+junction_points()
  a=information_audit(w,rows_for(points),(24,14),w.distances((24,14)))
  self.assertEqual(a['junctions']['unexplainedChoices'],0)
  points=junction_points()+list(reversed(junction_points()))+junction_points()
  a=information_audit(w,rows_for(points),(24,14),w.distances((24,14)))
  self.assertLessEqual(a['junctions']['unexplainedChoices'],1)
 def test_open_room_visible_exit_and_tied_choices_are_not_radar_evidence(self):
  w=world();a=information_audit(w,rows_for(junction_points()),(24,14),w.distances((24,14)))
  self.assertEqual(a['junctions']['unexplainedChoices'],0)
  w=junction_world();a=information_audit(w,rows_for(junction_points()),(28,14),w.distances((28,14)))
  self.assertEqual(a['junctions']['unexplainedChoices'],0)
 def test_heard_through_wall_and_previously_seen_entities_are_excluded(self):
  # Player's audio is not wall-occluded; even a silent entity in range is
  # conservatively remembered for the rest of the run.
  w=world({(25,z) for z in range(1,80)})
  points=[(30+i,30.) for i in range(5)]+[(34-i,30.) for i in range(10)]
  entities=[(55.,30.)]*len(points)
  a=information_audit(w,rows_for(points,entities),(1,1),w.distances((1,1)))
  self.assertEqual(a['entities']['earlyAvoidanceTurns'],0)
 def test_hidden_entity_turn_is_only_a_coincidence(self):
  w=world({(25,z) for z in range(1,80)})
  points=[(30+i,30.) for i in range(5)]+[(34-i,30.) for i in range(10)]
  a=information_audit(w,rows_for(points,[(70.,30.)]*len(points)),(1,1),w.distances((1,1)))
  self.assertGreater(a['entities']['earlyAvoidanceTurns'],0,a)
  self.assertTrue(all('不能证明' in e['meaning'] for e in a['evidence']))
 def test_budget_exhaustion_is_reported_as_partial_not_suspicious(self):
  import information_audit as module
  old=module.MAX_RAYS
  try:
   module.MAX_RAYS=0;w=junction_world();a=information_audit(w,rows_for(junction_points()),(24,14),w.distances((24,14)))
   self.assertEqual(a['status'],'partial');self.assertFalse(a['coverage']['complete']);self.assertFalse(a['affectsVerdict'])
  finally:module.MAX_RAYS=old
 def test_deadline_is_checked(self):
  w=world()
  def expired():raise TimeoutError('deadline')
  with self.assertRaises(TimeoutError):information_audit(w,rows_for(junction_points()),(24,14),w.distances((24,14)),expired)

 def test_optional_analysis_failure_does_not_change_finished_verdict_or_score(self):
  import base64,struct
  from unittest.mock import patch
  from judge import adjudicate,defaults
  points=[(3.,3.)]*3;rows=rows_for(points)
  data=b''.join(struct.pack('<72f',*r) for r in rows);w=world()
  meta={'bitmap':base64.b64encode(w.bits).decode(),'exit':[1,1],'formSeeds':['1','2','3','4'],'testFixture':False,'eye':1.55,'tile':2,'sha256':'a','signature':'verified','keyId':'k','fileBytes':len(data),'version':'0.10.3','runId':'1','seed':'1','frames':3}
  settings={k:{**v,'enabled':False} for k,v in defaults().items()};before=adjudicate(meta,data,settings)
  with patch('judge.information_audit',side_effect=RuntimeError('test fault')),self.assertLogs('judge',level='ERROR'):
   after=adjudicate(meta,data,settings)
  self.assertEqual(after['performance'],before['performance']);self.assertEqual(after['verdict'],before['verdict']);self.assertEqual(after['rules'],before['rules'])
  self.assertEqual(after['informationAudit']['status'],'unavailable')
