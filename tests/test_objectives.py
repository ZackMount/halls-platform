import copy,math,struct,sys,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from objectives import coin_cells,collect_coins,tactical_metrics
from judge import native_model,World,Rows,cell,assess_coin_checks
from scoring import evaluate_report
from test_competitive import sample,world


class SmallWorld:
 width=height=24
 def __init__(self,walls=()):self.walls=set(walls)
 def wall(self,x,z):return not 0<x<23 or not 0<z<23 or (x,z) in self.walls


def rows_for_positions(points,dt=.1):
 result=[]
 for i,(x,z) in enumerate(points):
  row=[0.]*84;row[0]=dt if i else 0.;row[6]=x;row[8]=z;row[19]=100.;result.append(row)
 return result


def tactics(phases,hits=()):
 rows=rows_for_positions([(3,3)],.5);states=[[0]*84];elapsed=0.
 for seconds,entity in phases:
  for _ in range(round(seconds*2)):
   elapsed+=.5;row=[0.]*84;row[0]=.5;row[6]=3+elapsed*2;row[8]=3;row[19]=100.
   uint=[0]*84
   for i in range(5):row[24+i*12]=row[6]+3;row[25+i*12]=3
   if entity is not None:uint[24+entity*12+11]=2
   rows.append(row);states.append(uint)
 for tick in range(len(rows)):
  if any(hit<=tick for hit in hits):rows[tick][19]=66.
 return tactical_metrics(rows,rows,states,range(24,84,12),set(hits))


class ObjectiveTests(unittest.TestCase):
 def test_positions_are_deterministic_distinct_and_reachable_even_in_disconnected_maps(self):
  w=SmallWorld({(12,z) for z in range(1,23)});coins=coin_cells(w,42,[2,2],[9,20])
  self.assertEqual(coins,coin_cells(w,42,[2,2],[9,20]));self.assertEqual(len({tuple(c) for c in coins}),3)
  self.assertTrue(all(0<x<12 and not w.wall(x,z) and [x,z] not in ([2,2],[9,20]) for x,z in coins))
  self.assertEqual(coin_cells(w,42,[2,2],[20,20]),[])
 def test_small_maps_relax_spacing_without_using_spawn_exit_or_duplicates(self):
  class Corridor(SmallWorld):
   def wall(self,x,z):return z!=1 or not 1<=x<=5
  self.assertEqual(set(map(tuple,coin_cells(Corridor(),1,[1,1],[5,1]))),{(2,1),(3,1),(4,1)})
 def test_cell_boundary_pickup_is_once_only_and_uses_wall_clock(self):
  rows=rows_for_positions([(3.99,5),(4,5),(5,5),(4.5,5),(6,7)])
  clocks=[(value*1000000,0,0,0) for value in (0,2,3,4,10)]
  self.assertEqual(collect_coins(rows,[[2,2],[3,3]],clocks=clocks),[{'id':0,'tick':1,'time':2.},{'id':1,'tick':4,'time':10.}])
  self.assertEqual(collect_coins(rows,[[2,2]])[0]['time'],.1)
 def test_fatal_hit_does_not_collect_a_coin_at_the_final_position(self):
  rows=rows_for_positions([(3,5),(4,5)]);rows[-1][19]=0.
  self.assertEqual(collect_coins(rows,[[2,2]]),[])
  rows[-1][19]=66.;self.assertEqual(collect_coins(rows,[[2,2]])[0]['id'],0)
 def test_same_pursuer_cannot_be_farmed_and_damaged_escape_does_not_pay(self):
  clean=tactics([(3,0),(5,None),(3,0),(5,None)])
  self.assertEqual((clean['distinctEscapes'],clean['factor']),(1,.5))
  damaged=tactics([(3,0),(5,None)],hits=(7,))
  self.assertEqual((damaged['distinctEscapes'],damaged['factor']),(0,0.))
 def test_two_distinct_escapes_and_stealth_are_alternatives(self):
  result=tactics([(3,0),(5,None),(3,1),(5,None)])
  self.assertEqual((result['distinctEscapes'],result['factor'],result['stealth']),(2,1.,False))
  self.assertEqual(tactics([(8,None)])['factor'],1.)
  self.assertEqual(tactics([(8,None)],hits=(7,))['factor'],0.)
 def test_incomplete_chase_or_remaining_pursuer_does_not_count_as_escape(self):
  result=tactics([(3,0),(4.5,None)])
  self.assertEqual((result['distinctEscapes'],result['factor']),(0,0.))
  result=tactics([(3,0),(6,1)])
  self.assertEqual(result['distinctEscapes'],0)
 def test_alternating_pursuers_do_not_merge_disjoint_short_chases(self):
  result=tactics([(2,0),(1,1),(2,0),(5,None)])
  self.assertEqual(result['distinctEscapes'],0);self.assertFalse(result['effectiveChase'])
 def test_coin_count_does_not_change_exit_only_pace_reference(self):
  reference=None;pace=None
  for count in range(4):
   r=sample();r['metrics']['duration']=150.;r['metrics']['coins']['collected']=count
   result=evaluate_report(r)
   if reference is None:reference=copy.deepcopy(r['metrics']['raceReference']);pace=result['components']['pace']
   self.assertEqual(r['metrics']['raceReference'],reference)
   self.assertEqual(result['components']['pace'],pace)
   self.assertEqual(result['policy']['referenceObjective'],'spawn_to_exit_only')
   self.assertEqual(result['components']['coins'],10*count)
 def test_unverified_objective_state_never_awards_bonus(self):
  r=sample();r['metrics'].update(coins={'available':False,'collected':3,'total':3},tactics={'available':False,'factor':1.})
  self.assertEqual(evaluate_report(r)['score'],60)
  for key in ('entity_ai','entity_motion','entity_speed','combat'):
   r=sample();next(v for v in r['rules'] if v['id']==key).update(status='fail',violations=1)
   p=evaluate_report(r);self.assertEqual(p['components']['tactics'],0);self.assertEqual(p['components']['coins'],0 if key=='combat' else 30)
  for key in ('map','spawn','exit','route','input','player_model','player_speed','clock','speed_control'):
   r=sample();next(v for v in r['rules'] if v['id']==key).update(status='fail',violations=1)
   p=evaluate_report(r);self.assertEqual([p['components'][k] for k in ('pace','coins','tactics')],[0,0,0])
 def test_partial_coins_and_noncompletion_have_exact_score_closure(self):
  for count in range(4):
   r=sample();r['metrics']['coins']['collected']=count;p=evaluate_report(r)
   self.assertEqual(p['components']['coins'],count*10);self.assertAlmostEqual(sum(p['components'].values()),p['score'])
   r['metrics']['completed']=False;p=evaluate_report(r);self.assertEqual(p['score'],0);self.assertEqual(sum(p['components'].values()),0)
 def test_standalone_preview_derives_visual_coins_without_adjudication(self):
  import tempfile
  from replay import convert
  from visual_codec import load_manifest
  from test_version_0110 import metadata,recording
  meta,frames=metadata(recording());meta['_renderLampBits']=bytes(8192)
  self.assertNotIn('_objectives',meta)
  with tempfile.TemporaryDirectory() as folder,patch('engine.judge.adjudicate') as judge:
   convert(meta,frames,Path(folder));manifest=load_manifest(folder);judge.assert_not_called()
   self.assertEqual(len(manifest['coins']),3);self.assertEqual(manifest['coinPickups'],[])
 def test_rust_production_map_golden_vectors_match_python_selection(self):
  vectors={104729:[[127,103],[246,109],[43,222]],7:[[75,48],[253,253],[183,125]],42:[[61,2],[252,232],[148,143]],4276993775:[[230,225],[145,87],[30,28]]}
  for seed,expected in vectors.items():
   try:model=native_model({'seed':str(seed),'recordingBuild':0x01000000,'frames':2,'formSeeds':['0']*5,'exit':[1,1]},bytes(84*4*2))
   except RuntimeError as error:
    if '没有对应版本' in str(error):self.skipTest('Native engine not installed')
    raise
   spawn=cell(Rows(model['frames'],words=84)[0])
   self.assertEqual(coin_cells(World(model['bitmap']),seed,spawn,model['exit']),expected)

class CoinCheckTests(unittest.TestCase):
 def fixture(self,positions=((3.,3.),(4.,5.),(5.,5.),(4.,5.))):
  rows=rows_for_positions(positions);frames=b''.join(struct.pack('<84f',*row) for row in rows)
  meta={'recordingBuild':0x01000000,'seed':'42','tile':2.,'words':84,'entities':5,'frames':len(rows),'bitmap':'not-used','spawnPosition':[499,499],'exit':[2,2]}
  report=sample();model={'bitmap':world().bits,'frames':frames,'exit':[20,20],'engine':report['engine'],'lampBits':bytes(8192)}
  return meta,frames,report,model
 def assess(self,meta,frames,report,model,settings=None):
  with patch('judge.coin_cells',return_value=[[2,2],[3,3],[4,4]]) as generator:
   result=assess_coin_checks(meta,frames,report['rules'],settings,model=model,model_runner=None)
  return result,generator
 def test_rules_reconstruct_server_positions_and_once_only_pickups_without_client_claims(self):
  meta,frames,report,model=self.fixture();meta['coins']={'collected':3,'positions':[[1,1]]}
  result,generator=self.assess(meta,frames,report,model)
  args=generator.call_args.args;self.assertEqual(args[0].bits,model['bitmap']);self.assertEqual(args[2:4],([1,1],[20,20]))
  self.assertEqual([r['status'] for r in result['rules']],['pass','pass'])
  self.assertTrue(result['coins']['available']);self.assertEqual(result['coins']['collected'],1);self.assertEqual(result['coins']['pickups'][0]['tick'],1)
  self.assertEqual(meta['_objectives'],result['replay']);self.assertEqual(meta['_renderLampBits'],model['lampBits'])
  self.assertTrue(all(not r['details']['clientDeclaration'] for r in result['rules']))
 def test_no_pickup_is_a_successful_check_not_a_failed_objective(self):
  meta,frames,report,model=self.fixture(((3.,3.),(3.,3.)))
  result,_=self.assess(meta,frames,report,model)
  self.assertTrue(result['coins']['available']);self.assertEqual(result['coins']['collected'],0)
  self.assertEqual([r['status'] for r in result['rules']],['pass','pass'])
 def test_combat_failure_disabled_unavailable_or_missing_blocks_coin_award(self):
  for state in ('fail','disabled','inconclusive','insufficient','missing'):
   with self.subTest(state=state):
    meta,frames,report,model=self.fixture()
    if state=='missing':report['rules']=[r for r in report['rules'] if r['id']!='combat']
    else:next(r for r in report['rules'] if r['id']=='combat')['status']=state
    result,_=self.assess(meta,frames,report,model);generation,pickup=result['rules']
    self.assertEqual(generation['status'],'pass');self.assertFalse(result['coins']['available']);self.assertEqual(result['coins']['collected'],0)
    self.assertEqual(pickup['status'],'fail' if state=='fail' else 'inconclusive')
    self.assertEqual(pickup['details']['reasonKind'],'prerequisite_failed' if state=='fail' else 'prerequisite_unavailable')
    self.assertIn('combat',pickup['details']['blockedBy']);self.assertEqual(result['replay']['coinPickups'],[])
 def test_explicit_failed_dependency_is_not_reported_as_unfinished_computation(self):
  meta,frames,report,model=self.fixture();next(r for r in report['rules'] if r['id']=='speed_control')['status']='fail'
  for native in (model,None):
   result,_=self.assess(meta,frames,report,native);pickup=result['rules'][1]
   self.assertEqual(pickup['status'],'fail');self.assertEqual(pickup['details']['reasonKind'],'prerequisite_failed');self.assertIn('speed_control',pickup['details']['blockedBy'])
 def test_missing_native_or_legacy_build_cannot_reuse_old_pass_or_coin_metrics(self):
  meta,frames,report,model=self.fixture()
  for native in (None,{**model,'engine':None}):
   result,_=self.assess(dict(meta),frames,report,native)
   self.assertFalse(result['coins']['available']);self.assertTrue(all(r['status']=='inconclusive' for r in result['rules']))
  meta['recordingBuild']=0x000b0003;result,_=self.assess(meta,frames,report,model)
  self.assertFalse(result['coins']['available']);self.assertTrue(all(r['details']['reasonKind']=='unsupported_build' for r in result['rules']))
 def test_disabling_either_coin_rule_withholds_reward_and_does_not_claim_pass(self):
  for name in ('coin_generation','coin_pickup'):
   meta,frames,report,model=self.fixture();result,_=self.assess(meta,frames,report,model,{name:{'enabled':False}})
   self.assertEqual(next(r for r in result['rules'] if r['id']==name)['status'],'disabled');self.assertFalse(result['coins']['available'])
 def test_completion_is_a_required_survival_prerequisite(self):
  meta,frames,report,model=self.fixture();next(r for r in report['rules'] if r['id']=='completion')['status']='fail'
  result,_=self.assess(meta,frames,report,model);self.assertEqual(result['rules'][1]['status'],'fail');self.assertFalse(result['coins']['available'])
 def test_invalid_reconstruction_cannot_claim_generation_or_pickup_success(self):
  meta,frames,report,model=self.fixture()
  with patch('judge.coin_cells',return_value=[[2,2],[2,2],[4,4]]):result=assess_coin_checks(meta,frames,report['rules'],model=model,model_runner=None)
  self.assertEqual([r['status'] for r in result['rules']],['fail','fail']);self.assertFalse(result['coins']['available'])
 def test_scoring_defensively_rejects_cached_legacy_available_true(self):
  for key in ('coin_generation','coin_pickup','combat','completion'):
   for state in ('fail','disabled','inconclusive','insufficient','missing'):
    report=sample()
    if state=='missing':report['rules']=[r for r in report['rules'] if r['id']!=key]
    else:next(r for r in report['rules'] if r['id']==key)['status']=state
    self.assertEqual(evaluate_report(report)['components']['coins'],0,(key,state))
  for engine in (None,{}, {'build':'0x000b0003','supportedBuilds':['0x000b0003'],'file':'judge-v113-test'}):
   report=sample();report['engine']=engine;self.assertEqual(evaluate_report(report)['components']['coins'],0)
  report=sample();report['proof']['version']='0.11.3';self.assertEqual(evaluate_report(report)['components']['coins'],0)
 def test_coin_failure_withdraws_only_coin_bonus_and_adds_no_penalty(self):
  report=sample();next(r for r in report['rules'] if r['id']=='coin_pickup')['status']='fail'
  result=evaluate_report(report);self.assertEqual(result['score'],70);self.assertEqual(sum(result['deductions'].values()),0)
  self.assertEqual(result['components']['pace'],50);self.assertEqual(result['components']['tactics'],10)
  report=sample();next(r for r in report['rules'] if r['id']=='combat').update(status='fail',violations=16)
  result=evaluate_report(report);self.assertEqual(result['score'],50);self.assertEqual(result['deductions']['combat'],10);self.assertEqual(sum(result['deductions'].values()),10)
 def test_new_coin_settings_default_on_without_changing_existing_policy(self):
  from judge import policy,defaults
  old={k:v for k,v in defaults().items() if k not in ('coin_generation','coin_pickup')};old['combat']['action']='review'
  current=policy(old)
  self.assertEqual(current['combat'],old['combat'])
  for key in ('coin_generation','coin_pickup'):self.assertEqual(current[key],{'enabled':True,'action':'review','params':{}})

if __name__=='__main__':unittest.main()
