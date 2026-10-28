import copy,json,unittest
from unittest.mock import patch
from public_report import public_report,race_reference,MAX_REFERENCE_POINTS,MAX_REFERENCE_SECONDS
import test_platform as fixtures
from store import db,dumps,DEFAULTS

def report(seconds=42.125,*,exact=False,path=None):
 return {'rules':[],'verdict':'accepted','proof':{'seed':'private-seed'},'policy':{'private-threshold':9},'metrics':{'raceReference':{'available':True,'seconds':seconds,'distance':210.625,'speed':5,'path':[[3,5],[15.5,20]] if path is None else path,'exactOptimality':exact,'method':'private-method','assumptions':'private-assumptions'},'exit':[0,0],'coins':{'cells':[[100,100]]},'referenceAudit':{'private-audit':True}},'performance':{'score':72.5,'components':{'completion':10,'pace':32.5,'coins':30,'tactics':0}}}

class PublicRaceReferenceTests(unittest.TestCase):
 def test_saved_reference_projection_is_small_read_only_and_independent_of_player_and_coins(self):
  source=report();original=copy.deepcopy(source)
  full=race_reference(source,include_path=True)
  self.assertEqual(full,{'available':True,'seconds':42.125,'approximate':True,'path':[[3,5],[15.5,20]]})
  public=public_report(source)
  self.assertEqual(public['performance']['raceReference'],{'available':True,'seconds':42.125,'approximate':True})
  self.assertEqual(public['performance']['score'],72.5);self.assertEqual(source,original)
  full['path'][0][0]=100
  self.assertEqual(source,original,'returned paths must not alias the saved report')
  encoded=json.dumps(public,allow_nan=False)
  for hidden in ('private-', 'path', 'distance', 'method', 'assumptions', 'metrics', 'policy', 'seed'):
   self.assertNotIn(hidden,encoded)
 def test_each_record_keeps_its_seconds_and_only_literal_true_certifies_exact(self):
  for seconds in (0,2.5,1234.56789,MAX_REFERENCE_SECONDS):
   for exact in (True,False,None,1,'true'):
    result=race_reference(report(seconds,exact=exact,path=[[0,511.999]]),include_path=True)
    self.assertEqual(result['seconds'],seconds);self.assertEqual(result['approximate'],exact is not True)
 def test_invalid_seconds_and_unavailable_references_do_not_leak_or_invent_data(self):
  for seconds in (True,False,None,'12',[],{},-1,MAX_REFERENCE_SECONDS+1,float('nan'),float('inf'),-float('inf'),10**1000):
   with self.subTest(seconds=repr(seconds)[:20]):self.assertEqual(race_reference(report(seconds),True),{'available':False})
  for source in (None,False,[],{}, {'metrics':None},{'metrics':[]},{'metrics':{'raceReference':None}}):
   self.assertEqual(race_reference(source,True),{'available':False})
  for available in (False,1,'true',None):
   source=report();source['metrics']['raceReference']['available']=available
   self.assertEqual(race_reference(source,True),{'available':False})
 def test_invalid_path_disables_both_time_summary_and_route(self):
  invalid=([],None,'path',{},[[1]],[[1,2,3]],[[True,2]],[[1,'2']],[[0,-.01]],[[512,0]],[[float('nan'),0]],[[float('inf'),0]],[[10**1000,0]],[[0,0]]*(MAX_REFERENCE_POINTS+1))
  for path in invalid:
   source=report();source['metrics']['raceReference']['path']=path
   with self.subTest(path=repr(path)[:50]):
    self.assertEqual(race_reference(source,True),{'available':False})
    self.assertEqual(public_report(source)['performance']['raceReference'],{'available':False})
  source=report(path=[[0,0]]*MAX_REFERENCE_POINTS)
  self.assertTrue(race_reference(source)['available'])

class RaceReferenceEndpointTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 def record(self,n=1,*,board='ranked',decision='approved',status='done',score=72.5,body=None):
  key=f'{n:024x}';body=report() if body is None else body
  with db(True)as c:
   c.execute('INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,decision,board,report,score,duration,grade,verdict,bytes,policy,policy_revision) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,1)',(key,'player',key,'private-cap',n,n,status,decision,board,dumps(body),score,100,'A','accepted','{}'))
  return key
 def url(self,key):return '/api/runs/'+key+'/race-reference'
 def test_public_route_and_summary_match_without_rejudging_or_rewriting_records(self):
  key=self.record()
  with db()as c:before=dict(c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone())
  with patch('engine.race_reference.reference_route',side_effect=AssertionError('No path recomputation')),patch('app.public_replay.export',side_effect=AssertionError('No replay regeneration')):
   response=self.other.get(self.url(key));self.assertEqual(response.status_code,200)
  self.assertEqual(response.json,{'available':True,'seconds':42.125,'approximate':True,'path':[[3,5],[15.5,20]]})
  self.assertEqual(response.headers['Cache-Control'],'no-store')
  with db()as c:self.assertEqual(dict(c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone()),before)
 def test_hidden_pending_failed_and_unapproved_records_are_not_public(self):
  for n,kwargs in enumerate(({'board':'hidden'},{'decision':'pending'},{'decision':'rejected'},{'score':None},{'status':'processing'},{'status':'error'}),1):
   key=self.record(n,**kwargs)
   for headers in ({},{'Authorization':'Bearer private-cap'}):
    response=self.other.get(self.url(key),headers=headers);self.assertEqual(response.status_code,404);self.assertEqual(response.data,b'')
  self.assertEqual(self.other.get(self.url('f'*24)).status_code,404)
 def test_unranked_visibility_switch_is_respected_and_admin_can_inspect_hidden(self):
  key=self.record(board='unranked',decision='rejected')
  self.assertEqual(self.other.get(self.url(key)).status_code,404)
  with db(True)as c:c.execute('UPDATE settings SET json=?',(dumps({**DEFAULTS,'unrankedEnabled':True}),))
  self.assertEqual(self.other.get(self.url(key)).status_code,200)
  with db(True)as c:c.execute("UPDATE runs SET board='hidden' WHERE id=?",(key,))
  self.assertEqual(self.other.get(self.url(key)).status_code,404)
  self.login();self.assertEqual(self.client.get(self.url(key)).status_code,200)
 def test_missing_and_malformed_saved_references_return_unavailable(self):
  for n,body in enumerate(({}, {'metrics':{}},{'metrics':{'raceReference':{'available':False,'reason':'private-failure'}}}, {'metrics':{'raceReference':{'available':True,'seconds':3,'path':[[512,5]]}}}),1):
   key=self.record(n,body=body);response=self.other.get(self.url(key));self.assertEqual(response.status_code,200);self.assertEqual(response.json,{'available':False})
  key=self.record(5)
  with db(True)as c:c.execute('UPDATE runs SET report=? WHERE id=?',('not-json',key))
  self.assertEqual(self.other.get(self.url(key)).json,{'available':False})

if __name__=='__main__':unittest.main()
