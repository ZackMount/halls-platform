import copy,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from store import DEFAULTS
from moderation import automatic_decision
class ModerationTests(unittest.TestCase):
 def setUp(self):
  self.config=copy.deepcopy(DEFAULTS);self.config.update(fullyAutomatic=True,autoApprove=False,autoPublish=False)
  self.meta={'testFixture':False,'duration':100};self.report={'verdict':'accepted','bot':{'score':10},'performance':{'eligible':True,'score':80}}
 def decide(self):return automatic_decision(self.config,self.meta,self.report)
 def test_full_mode_publishes_passing_run_without_legacy_switches(self):
  self.assertEqual(self.decide()['decision'],'approved');self.assertEqual(self.decide()['board'],'ranked')
 def test_failed_review_and_incomplete_checks_finish_unranked(self):
  for verdict in ('rejected','review','accepted_limited','not_assessed'):
   self.report['verdict']=verdict;d=self.decide();self.assertEqual(d['decision'],'rejected');self.assertEqual(d['board'],'unranked')
 def test_all_approval_limits_still_apply(self):
  for key,value in [('maxBotScore',5),('minScore',90),('maxDuration',90)]:
   before=self.config[key];self.config[key]=value;self.assertEqual(self.decide()['board'],'unranked');self.config[key]=before
  self.meta['testFixture']=True;self.assertEqual(self.decide()['board'],'unranked')
 def test_limited_checks_are_controlled_explicitly(self):
  self.report.update(verdict='accepted_limited',bot={'score':None});self.config.pop('requireBehaviorAssessment',None);self.config['allowLimited']=True;self.assertEqual(self.decide()['board'],'ranked')
 def test_optional_model_abstention_does_not_penalize_valid_game_checks(self):
  self.config.pop('requireBehaviorAssessment',None)
  self.report.update(verdict='accepted_limited',bot={'mode':'model_only','score':None,'sufficient':False,'unavailableReason':'unsupported_input_protocol','patterns':{'learned':{'available':True}}},insufficient=['bot'],rules=[{'id':'bot','status':'insufficient'},{'id':'input','status':'pass'}])
  self.assertEqual(self.decide()['board'],'ranked')
  for other in ('time_sources','combat','route'):
   self.report['insufficient']=['bot',other];self.assertEqual(self.decide()['board'],'unranked')
  self.report['insufficient']=['bot'];self.report['rules'][1]['status']='inconclusive';self.assertEqual(self.decide()['board'],'unranked')
 def test_model_failure_is_not_treated_as_a_covered_abstention(self):
  self.report.update(verdict='accepted_limited',bot={'mode':'model_only','score':None,'sufficient':False,'unavailableReason':'model_load_failed','patterns':{'learned':{'available':False}}},insufficient=['bot'],rules=[{'id':'bot','status':'insufficient'}])
  self.assertEqual(self.decide()['board'],'unranked')
 def test_disabling_full_mode_restores_manual_behavior(self):
  self.config['fullyAutomatic']=False;self.assertEqual(self.decide()['decision'],'pending');self.assertEqual(self.decide()['board'],'hidden')
  self.config['autoApprove']=True;self.assertEqual(self.decide()['decision'],'approved');self.assertEqual(self.decide()['board'],'hidden')
  self.config['autoPublish']=True;self.assertEqual(self.decide()['board'],'ranked')
