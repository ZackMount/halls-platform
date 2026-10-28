import copy,math,struct,sys,tempfile,unittest,base64
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from scoring import evaluate_report,operation_metrics,weights,RULE_WEIGHTS,deductions,DEFAULT_DEDUCTIONS,DEFAULT_WEIGHTS
from race_reference import reference_route
from judge import World
from replay import convert
from visual_codec import load_chunk

def world(extra=()):
 b=bytearray(8192)
 for z in range(256):
  for x in range(256):
   if x in (0,255) or z in (0,255) or (x,z) in extra:b[(z*256+x)//8]|=1<<(x%8)
 return World(b)
def sample():return {'verdict':'accepted','bot':None,'proof':{'version':'1.0.0'},'engine':{'build':'0x01000000','supportedBuilds':['0x01000000'],'file':'judge-current-test'},'metrics':{'completed':True,'duration':100,'pathMeters':460,'remainingHealth':100,'hits':0,'coins':{'available':True,'collected':3,'total':3},'tactics':{'available':True,'factor':1.,'stealth':True},'raceReference':{'available':True,'distance':460,'seconds':100},'operations':{'movementEfficiency':1,'lookEfficiency':1,'activityRatio':1,'conflictingInputRatio':0}},'rules':[{'id':k,'status':'pass','checked':100,'violations':0,'action':'reject'} for k in [*RULE_WEIGHTS,'coin_generation','coin_pickup']]}
class CompetitiveTests(unittest.TestCase):
 def test_new_default_budget_matches_storage_and_component_caps(self):
  from store import DEFAULTS
  self.assertEqual(DEFAULT_WEIGHTS,{'completion':10,'pace':50,'coins':30,'tactics':10})
  self.assertEqual(DEFAULTS['scoring'],DEFAULT_WEIGHTS)
  r=sample();r['metrics']['tactics']['factor']=.5
  self.assertEqual(evaluate_report(r)['components']['tactics'],5)

 def test_automation_cap_cannot_be_configured_above_forty(self):
  with self.assertRaisesRegex(ValueError,'40'):deductions({**DEFAULT_DEDUCTIONS,'automation':41})
 def test_completion_is_ten_and_ordinary_scores_never_round_to_full(self):
  r=sample();p=evaluate_report(r);self.assertEqual(p['score'],99.99);self.assertEqual(p['components']['completion'],10)
  r['metrics'].update(duration=300,pathMeters=1380);self.assertEqual(evaluate_report(r)['score'],50.12)
  r['metrics']['completed']=False;self.assertEqual(evaluate_report(r)['score'],0)
 def test_race_decays_exponentially_with_independent_objective_rewards(self):
  r=sample();r['metrics'].update(duration=200,pathMeters=920);p=evaluate_report(r);self.assertEqual(p['score'],52.49);self.assertEqual(p['components']['pace'],2.49);self.assertEqual(p['components']['coins'],30)
 def test_normal_damage_and_extra_inputs_do_not_deduct_points(self):
  r=sample();r['metrics'].update(remainingHealth=32,hits=2,tactics={'available':True,'factor':0.});r['metrics']['operations']['lookEfficiency']=.01;self.assertEqual(evaluate_report(r)['score'],90)
 def test_rejected_and_review_records_receive_formal_numeric_scores(self):
  for verdict in ('rejected','review','accepted_limited'):
   r=sample();r['verdict']=verdict;next(v for v in r['rules'] if v['id']=='combat').update(status='fail',violations=100,maxError=34)
   p=evaluate_report(r);self.assertEqual(p['score'],50);self.assertTrue(p['eligible']);self.assertEqual(p['referenceScore'],p['score'])
 def test_three_confirmed_faults_cannot_collect_invalid_efficiency_bonuses(self):
  r=sample()
  for v in r['rules']:
   if v['id'] in ('route','speed_control','combat'):v.update(status='fail',violations=100)
  p=evaluate_report(r);self.assertEqual(p['score'],7);self.assertEqual(sum(p['deductions'].values()),32);self.assertEqual(p['baseScore'],10)
 def test_same_collision_effect_does_not_stack_model_penalties(self):
  r=sample()
  for v in r['rules']:
   if v['id'] in ('route','player_model','camera','entity_motion'):v.update(status='fail',violations=100)
  p=evaluate_report(r);self.assertEqual(p['score'],9);self.assertEqual(p['deductions']['entities'],0)
 def test_idle_padding_cannot_dilute_anomaly_deductions(self):
  r=sample();rule=next(v for v in r['rules'] if v['id']=='combat');rule.update(status='fail',violations=16)
  loss=evaluate_report(r)['deductions'];rule['checked']=10**9;self.assertEqual(evaluate_report(r)['deductions'],loss)
 def test_map_similarity_deducts_more_than_path_and_seed_does_not_stack_map(self):
  r=sample();r['rules'].append({'id':'seed_similarity','status':'pass'})
  next(v for v in r['rules'] if v['id']=='map_similarity').update(status='fail',violations=1);self.assertEqual(evaluate_report(r)['score'],92)
  next(v for v in r['rules'] if v['id']=='path_similarity').update(status='fail',violations=1);self.assertEqual(evaluate_report(r)['score'],88)
  r['rules'][-1]['status']='fail';p=evaluate_report(r);self.assertEqual(p['score'],8.64);self.assertEqual(p['deductions']['seed'],87.36);self.assertEqual(p['deductions']['map_similarity'],0)
 def test_seed_duplicate_preserves_one_point_even_after_other_penalties(self):
  r=sample();r['rules'].append({'id':'seed_similarity','status':'fail'})
  for v in r['rules']:
   if v['id'] in ('route','speed_control','combat','entity_speed','bot'):v.update(status='fail',violations=100)
  r['bot']={'sufficient':True,'signals':3,'minimumSignals':3};self.assertEqual(evaluate_report(r)['score'],1)
  next(v for v in r['rules'] if v['id']=='production')['status']='fail';self.assertEqual(evaluate_report(r)['score'],0)
 def test_bot_suspicion_uses_continuous_penalty_even_with_legacy_pass_status(self):
  r=sample();r['bot']={'sufficient':True,'score':100,'signals':2,'minimumSignals':3}
  self.assertEqual(evaluate_report(r)['score'],80)
  self.assertEqual(evaluate_report(r)['deductions']['automation'],20)
  r['bot']['score']=75;self.assertEqual(evaluate_report(r)['deductions']['automation'],14.81)
  r['bot']['score']=50;self.assertEqual(evaluate_report(r)['score'],99.99)
  r['bot']['score']=100;next(v for v in r['rules'] if v['id']=='bot')['status']='disabled'
  self.assertEqual(evaluate_report(r)['deductions']['automation'],0)
 def test_pause_is_part_of_race_time_but_not_a_cheating_penalty(self):
  r=sample();r['metrics']['wallDuration']=200;p=evaluate_report(r);self.assertEqual(p['components']['pace'],2.49);self.assertEqual(sum(p['deductions'].values()),0)
 def test_speed_fault_removes_unverified_bonuses_without_causal_double_penalty(self):
  r=sample()
  for v in r['rules']:
   if v['id'] in ('speed_control','player_model'):v.update(status='fail',violations=100)
  p=evaluate_report(r);self.assertEqual(p['score'],9);self.assertEqual(p['components']['pace'],0);self.assertEqual(p['components']['coins'],0)
 def test_uncertain_bot_review_and_disabled_route_only_withhold_unverified_coins(self):
  r=sample();r['verdict']='review';r['bot']={'sufficient':False,'signals':3}
  for v in r['rules']:
   if v['id']=='bot':v.update(status='inconclusive')
   if v['id']=='route':v.update(status='disabled')
  p=evaluate_report(r);self.assertEqual(p['score'],70);self.assertEqual(p['components']['pace'],50);self.assertEqual(p['components']['tactics'],10);self.assertEqual(p['components']['coins'],0)
 def test_full_score_requires_exact_reference_and_all_passed_checks(self):
  r=sample();r['metrics']['raceReference']['exactOptimality']=True;self.assertEqual(evaluate_report(r)['score'],100)
  r['rules'][0]['status']='disabled';self.assertEqual(evaluate_report(r)['score'],99.99)
 def test_production_failure_remains_zero(self):
  r=sample();next(v for v in r['rules'] if v['id']=='production')['status']='fail';self.assertEqual(evaluate_report(r)['score'],0)
 def test_score_components_sum_and_bad_weights_rejected(self):
  r=sample();r['metrics']['duration']=234.56;p=evaluate_report(r);self.assertAlmostEqual(sum(p['components'].values()),p['score'],places=2)
  for bad in [{'pace':100},{'completion':60,'pace':25,'navigation':float('nan')},{'completion':60,'pace':25,'navigation':14}]:
   with self.assertRaises(ValueError):weights(bad)
 def test_reference_reaches_exit_area_not_center(self):
  r=reference_route(world(),(3.,3.),(5,1));self.assertTrue(r['available']);self.assertAlmostEqual(r['distance'],7,places=3);self.assertAlmostEqual(r['seconds'],7/4.6,places=3);self.assertTrue(r['exactOptimality'])
 def test_reference_detours_around_walls_and_forbids_diagonal_clipping(self):
  w=world({(3,z) for z in range(1,4)});r=reference_route(w,(3.,3.),(5,1));self.assertGreater(r['distance'],7)
  for a,b in zip(r['path'],r['path'][1:]):
   for i in range(101):self.assertTrue(w.fits(a[0]+(b[0]-a[0])*i/100,a[1]+(b[1]-a[1])*i/100,.22))
  self.assertFalse(reference_route(world({(2,1),(1,2)}),(3.,3.),(2,2))['available'])
 def test_shortcuts_reduce_discrete_bias_but_are_not_claimed_exact(self):
  w=world({(3,z) for z in range(1,4)});r=reference_route(w,(3.,3.),(5,1))
  self.assertEqual(r['method'],'clearance-shortcut-v2');self.assertFalse(r['exactOptimality'])
  self.assertLess(r['distance'],r['gridDistance']);self.assertGreater(r['shortcutSavingMeters'],0)
  self.assertAlmostEqual(sum(math.dist(a,b) for a,b in zip(r['path'],r['path'][1:])),r['distance'],places=5)
  self.assertEqual(r['optimality'],'feasible_upper_bound')
 def test_reference_check_can_interrupt_shortcut_analysis(self):
  def expired():raise TimeoutError('deadline')
  with self.assertRaises(TimeoutError):reference_route(world(),(3.,3.),(5,1),check=expired)
 def test_control_metrics_do_not_reward_spinning_or_toggling(self):
  def frames(spin=False,toggle=False):
   result=[]
   for i in range(100):
    row=[0.]*72;row[0]=.03 if i else 0;row[2]=.1 if i else 0;row[6]=3+i*.1;row[7]=1.55;row[8]=3;row[9]=i*.5%math.tau if spin else 0;row[19]=100
    data=bytearray(struct.pack('<72f',*row));struct.pack_into('<I',data,4,1+(512 if not toggle or i%2 else 0));result.append(data)
   return b''.join(result)
  regular=operation_metrics(frames());spin=operation_metrics(frames(True));toggle=operation_metrics(frames(toggle=True))
  self.assertLess(spin['lookEfficiency'],regular['lookEfficiency']);self.assertEqual(toggle['movementEfficiency'],regular['movementEfficiency'])
 def test_replay_preserves_short_key_presses_without_exposing_tick_actions(self):
  rows=[]
  for i in range(5):
   f=[0.]*72;f[0]=.025 if i else 0;f[6:9]=[3,1.55,3];f[19]=100
   data=bytearray(struct.pack('<72f',*f));struct.pack_into('<I',data,4,512|(1 if i==1 else 0));rows.append(data)
  meta={'frames':5,'seed':'1','spawnPosition':[3,3],'tile':2,'duration':.1,'ceiling':2.65,'eye':1.55,'exit':[5,1],'bitmap':base64.b64encode(world().bits).decode(),'formSeeds':['1','2','3','4']}
  with tempfile.TemporaryDirectory() as tmp:
   m=convert(meta,b''.join(rows),Path(tmp));values=load_chunk(Path(tmp),m,0);self.assertEqual(m['format'],'HVR5');self.assertEqual(int(values[1][m['inputOffset']])&1,0);self.assertEqual(int(values[1][m['inputOffset']+1])&1,1);self.assertFalse(set((0,1,2,4,5))&set(m['fields']));self.assertEqual(values[1][1+m['fields'].index(3)],100.)

 def test_replay_keeps_out_of_range_and_fractional_health(self):
  health=[100,100000,99966,47.75,47.8583984375];rows=[]
  for i,hp in enumerate(health):
   f=[0.]*72;f[0]=.1 if i else 0;f[6:9]=[3,1.55,3];f[19]=hp;rows.append(struct.pack('<72f',*f))
  meta={'frames':5,'seed':'1','spawnPosition':[3,3],'tile':2,'duration':.4,'ceiling':2.65,'eye':1.55,'exit':[5,1],'bitmap':base64.b64encode(world().bits).decode(),'formSeeds':['1','2','3','4']}
  with tempfile.TemporaryDirectory() as tmp:
   m=convert(meta,b''.join(rows),Path(tmp));v=load_chunk(Path(tmp),m,0);offset=1+m['fields'].index(19)
   self.assertEqual([row[offset] for row in v],health)
