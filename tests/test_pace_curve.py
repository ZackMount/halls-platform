import json,math,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from scoring import evaluate_report,pace_bonus,VERSION
from test_competitive import sample

class PaceCurveTests(unittest.TestCase):
 def report(self,multiple=1):
  report=sample();report['metrics']['duration']=100*multiple
  return report

 def test_curve_restricts_high_pace_bonus_to_near_reference_runs(self):
  # More of the total score now distinguishes performance. Coin detours use
  # real time against the unchanged spawn-to-exit reference.
  for multiple in (1,1.1,1.2,1.5,2):
   bonus=math.exp(-3*max(0,multiple-1));points=round(50*bonus,2)
   with self.subTest(multiple=multiple):
    result=evaluate_report(self.report(multiple))
    self.assertAlmostEqual(pace_bonus(100,100*multiple),bonus)
    self.assertEqual(result['components']['pace'],points)
    self.assertEqual(result['components']['completion'],10)
    self.assertEqual(result['components']['coins'],30)

 def test_curve_is_monotonic_bounded_and_independent_of_reference_scale(self):
  previous=1.
  for i in range(1001):
   ratio=.5+i/100
   bonus=pace_bonus(100,100*ratio)
   self.assertGreaterEqual(bonus,0);self.assertLessEqual(bonus,1)
   self.assertLessEqual(bonus,previous);previous=bonus
   self.assertAlmostEqual(bonus,pace_bonus(10,10*ratio))
  self.assertEqual(pace_bonus(1,1e308),0)
  self.assertEqual(pace_bonus(1e-308,1e308),0)

 def test_fast_or_rounded_approximate_reference_cannot_award_full_score(self):
  for multiple in (.5,.999999999,1,1.000000001):
   with self.subTest(multiple=multiple):
    result=evaluate_report(self.report(multiple))
    self.assertEqual(result['score'],99.99)
    self.assertLessEqual(result['components']['pace'],50)
  report=self.report();report['metrics']['raceReference']['exactOptimality']=True
  self.assertEqual(evaluate_report(report)['score'],100)
  report['metrics']['duration']=50
  self.assertEqual(evaluate_report(report)['score'],99.99)

 def test_invalid_time_measurements_fail_closed_without_nonfinite_outputs(self):
  invalid=(None,False,True,0,-1,'100',float('nan'),float('inf'),-float('inf'),10**1000)
  for field in ('duration','reference'):
   for value in invalid:
    with self.subTest(field=field,value=repr(value)):
     report=self.report()
     if field=='reference':report['metrics']['raceReference']['seconds']=value
     else:report['metrics']['duration']=value
     result=evaluate_report(report)
     self.assertEqual(result['components']['pace'],0)
     self.assertIsNone(result['raceMultiple'])
     self.assertTrue(0<=result['score']<=99.99)
     json.dumps(result,allow_nan=False)
  for reference in (None,{},False,'invalid',{'available':False,'seconds':100,'distance':460}):
   report=self.report();report['metrics']['raceReference']=reference
   result=evaluate_report(report)
   self.assertEqual(result['components']['pace'],0)
   self.assertEqual(result['components']['coins'],30)

 def test_invalid_wall_clock_does_not_fall_back_to_simulation_time(self):
  for value in (0,-1,float('nan'),float('inf'),'100'):
   report=self.report();report['metrics']['wallDuration']=value
   self.assertEqual(evaluate_report(report)['components']['pace'],0)
  # Old recordings without wall-clock metadata retain their original time basis.
  report=self.report(1.1);report['metrics']['wallDuration']=None
  self.assertEqual(evaluate_report(report)['components']['pace'],37.04)

 def test_route_and_speed_faults_still_exclude_untrustworthy_bonuses(self):
  for rule_id in ('map','spawn','exit','route','input','player_model','clock','speed_control','player_speed'):
   report=self.report(1.1)
   next(rule for rule in report['rules'] if rule['id']==rule_id).update(status='fail',violations=16)
   result=evaluate_report(report)
   self.assertEqual(result['components']['pace'],0)
   self.assertIn(rule_id,result['excludedBonuses']['pace'])
   self.assertEqual(result['components']['coins'],0)

 def test_admin_weights_and_rounding_remain_consistent(self):
  for configured in ({'completion':10,'pace':50,'coins':30,'tactics':10},{'completion':0,'pace':100,'coins':0,'tactics':0},{'completion':30,'pace':50,'coins':10,'tactics':10}):
   for multiple in (1,1.00001,1.1,1.2,1.5,2,10):
    report=self.report(multiple);report['metrics']['pathMeters']=607.33
    result=evaluate_report(report,configured)
    self.assertEqual(result['policy']['weights'],configured)
    self.assertAlmostEqual(sum(result['components'].values()),result['score'],places=2)
    self.assertEqual(result['components']['pace'],round(configured['pace']*pace_bonus(100,100*multiple),2))
    self.assertTrue(0<=result['score']<=99.99)

 def test_policy_names_curve_and_changes_report_identity(self):
  result=evaluate_report(self.report(1.1))
  self.assertEqual(VERSION,'koh-8');self.assertEqual(result['version'],VERSION)
  self.assertEqual(result['policy']['paceCurve']['decay'],3)
  self.assertEqual(result['policy']['coinCount'],3)
  self.assertNotIn('efficiencyPower',result['policy'])
  self.assertIn('exp(-3',result['formula'])
  self.assertNotIn('竞速25×效率²',result['formula'])

if __name__=='__main__':unittest.main()
