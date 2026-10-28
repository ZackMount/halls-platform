import copy,json,unittest
from public_report import component_maxima,public_report

class ComponentLimitTests(unittest.TestCase):
 def report(self,weights=None,scoring=None):
  report={'rules':[],'performance':{'score':41.25,'components':{'completion':10,'pace':11.25,'coins':10,'tactics':10,'integrity':0}}}
  if weights is not None:report['performance']['policy']={'weights':weights,'privateThreshold':'never-public'}
  if scoring is not None:report['platformPolicy']={'scoring':scoring,'judge':{'privateRule':'never-public'}}
  return report
 def test_point_caps_use_each_record_snapshot_not_current_weights(self):
  first={'completion':10,'pace':50,'coins':30,'tactics':10}
  second={'completion':20,'pace':40,'coins':30,'tactics':10}
  for weights in (first,second):
   report=self.report(weights,{'completion':99,'pace':1,'coins':0,'tactics':0});before=copy.deepcopy(report)
   public=public_report(report)
   self.assertEqual(public['performance']['componentMaxima'],weights)
   self.assertEqual(public['performance']['score'],41.25);self.assertEqual(public['performance']['components'],report['performance']['components'])
   self.assertEqual(report,before,'display projection must not mutate recorded scores')
 def test_missing_weights_fall_back_only_to_saved_platform_snapshot(self):
  weights={'completion':12.5,'pace':47.5,'coins':30,'tactics':10}
  self.assertEqual(public_report(self.report(scoring=weights))['performance']['componentMaxima'],weights)
  self.assertEqual(component_maxima(self.report({'completion':0},weights)),weights|{'completion':0})
 def test_zero_cap_is_known_and_policy_details_are_not_public(self):
  report=self.report({'completion':0,'pace':60,'coins':30,'tactics':10,'hiddenWeight':5})
  public=public_report(report);caps=public['performance']['componentMaxima']
  self.assertEqual(caps,{'completion':0,'pace':60,'coins':30,'tactics':10})
  encoded=json.dumps(public,allow_nan=False)
  for private in ('policy','weights','privateThreshold','never-public','hiddenWeight','platformPolicy'):self.assertNotIn(private,encoded)
 def test_invalid_caps_are_unknown_even_if_fallback_has_a_different_cap(self):
  for invalid in (True,False,None,'30',[],{},float('nan'),float('inf'),-float('inf'),-1,100.01,10**1000):
   with self.subTest(value=repr(invalid)[:30]):
    report=self.report({'completion':invalid},{'completion':10,'pace':50})
    public=public_report(report)
    self.assertEqual(public['performance']['componentMaxima'],{'pace':50})
    json.dumps(public,allow_nan=False)
 def test_missing_or_malformed_sources_do_not_invent_caps(self):
  self.assertEqual(public_report(self.report())['performance']['componentMaxima'],{})
  for bad in (None,False,[],1,'private'):
   report=self.report();report['performance']['policy']=bad;report['platformPolicy']=bad
   self.assertEqual(component_maxima(report),{})
  report=self.report();report['performance']['policy']={'weights':[]};report['platformPolicy']={'scoring':'private'}
  self.assertEqual(component_maxima(report),{})

if __name__=='__main__':unittest.main()
