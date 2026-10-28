"""Positive points for recorded victories without restoring unverified bonuses."""
import copy,unittest
from scoring import DEFAULT_DEDUCTIONS,evaluate_report
from test_competitive import sample


def fail(report,*ids,violations=100):
 for rule in report['rules']:
  if rule['id'] in ids:rule.update(status='fail',violations=violations)
 return report


class CompletionFloorTests(unittest.TestCase):
 def test_default_deduction_caps_are_reduced_without_changing_the_hundred_point_budget(self):
  from store import DEFAULTS
  expected={'movement':12,'timing':10,'combat':10,'entities':5,'automation':20,'map_similarity':8,'path_similarity':4}
  self.assertEqual(DEFAULT_DEDUCTIONS,expected);self.assertEqual(DEFAULTS['deductions'],expected)
  self.assertEqual(evaluate_report(sample())['policy']['weights'],{'completion':10,'pace':50,'coins':30,'tactics':10})
 def test_recorded_victory_at_modified_exit_keeps_nine_points_and_no_bonus(self):
  report=fail(sample(),'completion');report['metrics'].update(completed=False,clientCompleted=True)
  for key in ('coin_generation','coin_pickup'):
   rule=next(r for r in report['rules'] if r['id']==key);rule.update(status='fail',details={'reasonKind':'prerequisite_failed','blockedBy':['completion']})
  result=evaluate_report(report)
  self.assertEqual(result['score'],9);self.assertTrue(result['completed']);self.assertFalse(result['verifiedCompleted'])
  self.assertEqual(result['violationSummary']['ids'],['completion'])
  self.assertEqual({k:result['components'][k] for k in ('completion','pace','coins','tactics')},{'completion':10,'pace':0,'coins':0,'tactics':0})
  self.assertTrue(result['completionFloor']['applied']);self.assertEqual(result['completionFloor']['minimum'],9)
  self.assertNotIn('无伤脱出',result['badges']);self.assertEqual(result['description'],'客户端触发通关')
 def test_declared_exit_change_still_fails_but_is_not_a_zero_score_by_itself(self):
  report=fail(sample(),'exit');result=evaluate_report(report)
  self.assertEqual(result['score'],9);self.assertEqual(result['violationSummary']['ids'],['exit']);self.assertFalse(result['verifiedCompleted'])
  self.assertEqual([result['components'][k] for k in ('pace','coins','tactics')],[0,0,0])
 def test_causal_and_derived_coin_failures_do_not_inflate_distinct_violation_count(self):
  report=fail(sample(),'route','player_model','camera','entity_motion','coin_generation','coin_pickup',violations=900000)
  for rule in report['rules']:
   if rule['id'].startswith('coin_'):rule['details']={'reasonKind':'prerequisite_failed','blockedBy':['route']}
  result=evaluate_report(report)
  self.assertEqual(result['violationSummary']['count'],1);self.assertEqual(result['violationSummary']['ids'],['route']);self.assertEqual(result['score'],9)
  self.assertEqual(set(result['violationSummary']['ignored']),{'player_model','camera','entity_motion','coin_generation','coin_pickup'})
 def test_per_frame_counts_and_duplicate_report_rows_are_not_distinct_violations(self):
  report=fail(sample(),'route',violations=900000);rule=next(r for r in report['rules'] if r['id']=='route');report['rules']+=copy.deepcopy([rule]*12)
  result=evaluate_report(report);self.assertEqual(result['violationSummary']['count'],1);self.assertEqual(result['score'],9)
 def test_ten_distinct_failures_keep_one_point_but_eleven_are_zero(self):
  ids=['map','spawn','exit','input','player_speed','clock','time_sources','entity_speed','entity_motion','entity_ai','flashlight']
  for count,score in ((9,1),(10,1),(11,0)):
   report=fail(sample(),*ids[:count]);result=evaluate_report(report)
   self.assertEqual(result['violationSummary']['count'],count);self.assertEqual(result['score'],score)
   self.assertEqual(result['violationSummary']['exceedsLimit'],count>10)
   self.assertAlmostEqual(sum(result['components'].values()),score)
 def test_more_than_ten_is_zero_even_if_configured_penalties_are_disabled(self):
  ids=['map','spawn','exit','input','player_speed','clock','time_sources','entity_speed','entity_motion','entity_ai','flashlight']
  report=fail(sample(),*ids);result=evaluate_report(report,configured_deductions={key:0 for key in DEFAULT_DEDUCTIONS})
  self.assertEqual(result['score'],0);self.assertEqual(result['zeroReason'],'too_many_independent_violations')
 def test_seed_minimum_cannot_resurrect_a_zero_for_excessive_distinct_violations(self):
  ids=['map','spawn','exit','input','player_speed','clock','time_sources','entity_speed','entity_motion','entity_ai','flashlight']
  report=fail(sample(),*ids);report['rules'].append({'id':'seed_similarity','status':'fail'})
  self.assertEqual(evaluate_report(report)['score'],0)
 def test_repeated_seed_keeps_small_positive_points_for_eligible_victories(self):
  report=fail(sample(),'route','speed_control','combat');report['rules'].append({'id':'seed_similarity','status':'fail'})
  for cap in (0,.5,9):self.assertGreater(evaluate_report(report,seed_cap=cap)['score'],0)
 def test_no_victory_death_developer_or_bad_authentication_has_no_floor(self):
  cases=[]
  r=sample();r['metrics']['completed']=False;cases.append(r)
  r=sample();r['metrics']['clientCompleted']=False;cases.append(r)
  r=sample();r['metrics']['remainingHealth']=0;cases.append(r)
  r=sample();r['proof']['testFixture']=True;next(v for v in r['rules'] if v['id']=='production')['status']='disabled';cases.append(r)
  cases.append(fail(sample(),'production'))
  r=sample();r['proof']['signature']='invalid';cases.append(r)
  r=sample();r['importAccepted']=False;cases.append(r)
  for state in ('failed','not_run'):
   r=sample();r['importChecks']={'authentication':state};cases.append(r)
  for report in cases:
   result=evaluate_report(report);self.assertEqual(result['score'],0);self.assertFalse(result['completionFloor']['eligible']);self.assertIsNotNone(result['zeroReason'])
 def test_legacy_completed_metric_remains_supported_without_inventing_victory(self):
  report=sample();self.assertNotIn('clientCompleted',report['metrics']);self.assertGreater(evaluate_report(report)['score'],0)
  report['metrics']['completed']=False;self.assertEqual(evaluate_report(report)['score'],0)
 def test_model_suspicion_is_unchanged_while_the_default_deduction_is_halved(self):
  report=sample();report['bot']={'sufficient':True,'score':100};before=copy.deepcopy(report['bot']);result=evaluate_report(report)
  self.assertEqual(result['automation']['suspicion'],100);self.assertEqual(result['deductions']['automation'],20);self.assertEqual(result['score'],80);self.assertEqual(report['bot'],before)

if __name__=='__main__':unittest.main()
