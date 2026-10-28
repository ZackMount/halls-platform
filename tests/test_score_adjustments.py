import json,unittest
from public_report import public_report,score_adjustments
class AdjustmentTests(unittest.TestCase):
 def test_public_suspicion_exposes_score_and_deduction_not_private_evidence(self):
  perf={'automation':{'available':True,'suspicion':90,'deduction':36.55,'maximumDeduction':40,'factor':.9138,'threshold':50,'evidence':['private']}}
  result=public_report({'rules':[],'performance':perf})['performance']['automation']
  self.assertEqual(result,{'available':True,'suspicion':90,'deduction':36.55,'maximumDeduction':40})
 def test_only_brief_category_reasons_and_amounts_are_public(self):
  p={'score':5,'baseScore':60,'components':{'integrity':-55},'deductions':{'movement':30,'timing':25},'excludedBonuses':{'pace':['private-rule'],'navigation':['private-rule']},'suppressedRules':{'secret':'threshold'}}
  r=public_report({'rules':[],'performance':p})['performance'];self.assertEqual([i['points'] for i in r['adjustments']['items']],[-30,-25]);self.assertEqual(len(r['adjustments']['notes']),1)
  for secret in ('private-rule','secret','threshold','suppressedRules','excludedBonuses','deductions'):self.assertNotIn(secret,json.dumps(r))
 def test_neutral_scores_have_no_deduction_rows_and_zero_floor_is_explained(self):
  self.assertEqual(score_adjustments({'score':68,'components':{'integrity':0}}),{'items':[],'notes':[]})
  r=score_adjustments({'score':0,'baseScore':60,'deductions':{'movement':30,'timing':25,'combat':25}});self.assertEqual(len(r['items']),3);self.assertIn('零分',r['notes'][0])

 def test_completion_floor_is_explained_without_claiming_the_final_score_is_zero(self):
  result=score_adjustments({'score':9,'baseScore':10,'deductions':{'movement':12},'completionFloor':{'applied':True},'excludedBonuses':{'pace':['completion'],'coins':['completion'],'tactics':['completion']}})
  self.assertIn('已按通关保底结算。',result['notes']);self.assertNotIn('零分',' '.join(result['notes']))
  self.assertIn('通关状态',' '.join(result['notes']))
 def test_many_independent_failures_have_a_specific_zero_reason(self):
  result=score_adjustments({'score':0,'baseScore':10,'deductions':{'movement':12},'zeroReason':'too_many_independent_violations'})
  self.assertIn('独立违规项超过 10 项，得分归零。',result['notes'])
 def test_legacy_exit_claim_and_causal_consequences_are_not_mislabeled(self):
  result=public_report({'rules':[{'id':'exit','title':'真实出口','status':'pass','details':{'timelineAvailable':False,'clientVictory':True,'completionMatchesRecordedExit':False}},{'id':'camera','title':'视角一致性','status':'fail'}],'performance':{'suppressedRules':{'camera':'route'}}})
  self.assertIn('旧版未记录',result['rules'][0]['summary']);self.assertIn('不重复扣分',result['rules'][1]['summary']);self.assertNotIn('suppressedRules',json.dumps(result))
