import copy,sys,unittest
from pathlib import Path
sys.path[:0]=[str(Path(__file__).resolve().parents[1]/'engine'),str(Path(__file__).resolve().parents[1])]
from automation import require_assessment,adjustment
from behavior_features import eligible_windows
from behavior_model import observe
from judge import Check
from moderation import automatic_decision
from store import DEFAULTS
from test_competitive import sample
from scoring import evaluate_report
from unittest.mock import patch
class RequiredBehaviorTests(unittest.TestCase):
 def bot(self):return {'sufficient':False,'score':None,'unavailableReason':'insufficient_activity_windows','patterns':{'learned':{'available':True,'eligibleWindows':2}}}
 def check(self):return Check({'id':'bot','title':'test','group':'behavior'},{'enabled':True,'action':'review'})
 def test_sparse_moving_windows_reach_the_model(self):
  from behavior_features import FEATURES
  windows=[{'values':[0.]*len(FEATURES),'events':n,'positions':75,'startSeconds':i*30,'endSeconds':(i+1)*30} for i,n in enumerate((12,5,1,5,17))]
  with patch('behavior_model.extract',return_value=windows),patch('behavior_model.predict',side_effect=[.1,.94,1.,.97,1.]):
   result=observe([],[],input_mode='held')
  self.assertEqual(result['eligibleWindows'],5);self.assertTrue(result['sufficient']);self.assertGreater(result['score'],50)
  with patch('behavior_model.extract',return_value=windows):self.assertFalse(observe([],[],input_mode='held',include_sparse=False)['sufficient'])
  self.assertEqual([w['events'] for w in eligible_windows(windows)],[12,5,1,5,17])
 def test_stationary_windows_are_not_active_motion(self):
  self.assertEqual(eligible_windows([{'events':100,'positions':1}]),[])
 def test_requirement_is_forward_only(self):
  b=self.bot();c=self.check();require_assessment(c,b,False)
  self.assertEqual(c.close()['status'],'insufficient');self.assertNotIn('requiredEvidenceMissing',b);self.assertEqual(adjustment(b,20)['deduction'],0)
 def test_missing_evidence_rejects_without_inventing_a_model_score(self):
  b=self.bot();c=self.check();require_assessment(c,b,True);r=c.close()
  self.assertEqual((r['status'],r['action']),('fail','reject'));self.assertIsNone(b['score'])
  p=sample();p['bot']=b;p['rules']=[r if v['id']=='bot' else v for v in p['rules']]
  score=evaluate_report(p);self.assertEqual(score['deductions']['automation'],20);self.assertEqual(score['automation']['deduction'],20);self.assertIsNone(score['automation']['suspicion'])
 def test_service_failure_is_never_scored_as_cheating(self):
  for reason in ('model_load_failed','unsupported_input_protocol'):
   b=self.bot();b['unavailableReason']=reason;c=self.check()
   with self.assertRaises(RuntimeError):require_assessment(c,b,True)
   self.assertEqual(c.failures,0);self.assertNotIn('requiredEvidenceMissing',b)
 def test_allow_limited_cannot_bypass_new_admission_policy(self):
  policy={**copy.deepcopy(DEFAULTS),'allowLimited':True,'fullyAutomatic':True}
  report={'verdict':'accepted_limited','bot':self.bot(),'performance':{'eligible':True,'score':80},'insufficient':['bot'],'rules':[{'id':'bot','status':'insufficient'}]}
  meta={'testFixture':False,'duration':150}
  self.assertEqual(automatic_decision(policy,meta,report)['board'],'unranked')
  policy.pop('requireBehaviorAssessment');self.assertEqual(automatic_decision(policy,meta,report)['board'],'ranked')
