"""KOH grading: completion, pace, optional coins, tactics, and deductions."""
import hashlib,json,math,struct
from automation import adjustment,THRESHOLD,MAX_DEDUCTION,CURVE
from objectives import coin_award_blockers
VERSION='koh-8'
PACE_DECAY=3
DEFAULT_WEIGHTS={'completion':10,'pace':50,'coins':30,'tactics':10}
DEFAULT_DEDUCTIONS={'movement':12,'timing':10,'combat':10,'entities':5,'automation':20,'map_similarity':8,'path_similarity':4}
CUTOFFS={'S':90,'A':75,'B':60,'C':40}
RULE_WEIGHTS={'production':4,'map':8,'spawn':5,'exit':5,'completion':8,'clock':6,'time_sources':6,'speed_control':12,'route':12,'input':8,'player_speed':10,'player_model':10,'entity_speed':4,'entity_motion':6,'entity_ai':5,'combat':6,'flashlight':6,'camera':3,'bot':5,'map_similarity':2,'path_similarity':2,'timestamp':2}
def clamp(n):return max(0.,min(1.,n))
def positive_finite(value):
 if type(value) not in (int,float):return 0.
 try:value=float(value)
 except OverflowError:return 0.
 return value if math.isfinite(value) and value>0 else 0.
def pace_bonus(theory,elapsed):
 theory,elapsed=positive_finite(theory),positive_finite(elapsed)
 return math.exp(-PACE_DECAY*max(0.,elapsed/theory-1.)) if theory and elapsed else 0.
def grade(score):return next((g for g,cut in CUTOFFS.items() if score>=cut),'D')
def weights(value=None):
 w=dict(DEFAULT_WEIGHTS if value is None else value)
 if set(w)!=set(DEFAULT_WEIGHTS) or any(type(v) not in (int,float) or not math.isfinite(v) or v<0 or v>100 for v in w.values()) or abs(sum(w.values())-100)>1e-6:raise ValueError('评分权重必须为 0–100，合计 100。')
 return w

def deductions(value=None):
 w=dict(DEFAULT_DEDUCTIONS if value is None else value)
 if set(w)!=set(DEFAULT_DEDUCTIONS) or any(type(v) not in (int,float) or not math.isfinite(v) or not 0<=v<=100 for v in w.values()) :raise ValueError('每类扣分上限必须为 0–100。')
 if w['automation']>MAX_DEDUCTION:raise ValueError('自动化扣分上限不得超过 40 分。')
 return w

def operation_metrics(frames,check=lambda:None,hit_ticks=None,words=72):
 stride=words*4
 prev=None;requested=effective=active=elapsed=conflict=yaw=pitch=route_turn=0.;anchor=None;heading=None;changes=lamp_changes=run_changes=0;previous_flags=0
 for tick,row in enumerate(struct.iter_unpack(f'<{words}f',frames)):
  if tick%1024==0:check()
  flags=struct.unpack_from('<I',frames,tick*stride+4)[0]
  if prev is not None:
   dt=max(row[0],0);elapsed+=dt;moved=math.hypot(row[6]-prev[6],row[8]-prev[8]);command=math.hypot(row[2],row[3])
   hit=(tick in hit_ticks if hit_ticks is not None else row[19]<prev[19]) or prev[20]>0
   if not hit:
    requested+=command;effective+=min(moved,command)
    if moved>1e-4:active+=dt
   if any(flags&a and flags&b for a,b in ((1,2),(4,8),(16,32),(64,128))):conflict+=dt
   yaw+=abs((row[9]-prev[9]+math.pi)%math.tau-math.pi);pitch+=abs(row[10]-prev[10])
   changes+=(flags&255)!=(previous_flags&255);lamp_changes+=bool((flags^previous_flags)&512);run_changes+=bool((flags^previous_flags)&256)
   if not hit and math.hypot(row[6]-anchor[0],row[8]-anchor[1])>=.4:
    next_heading=math.atan2(row[6]-anchor[0],row[8]-anchor[1])
    if heading is not None:route_turn+=abs((next_heading-heading+math.pi)%math.tau-math.pi)
    heading=next_heading;anchor=(row[6],row[8])
  else:anchor=(row[6],row[8])
  prev=row;previous_flags=flags
 return {'movementEfficiency':clamp(effective/requested) if requested>1e-6 else 0.,'activityRatio':clamp(active/elapsed) if elapsed else 0.,'conflictingInputRatio':clamp(conflict/elapsed) if elapsed else 0.,'lookEfficiency':clamp((route_turn+math.pi)/max(yaw+.5*pitch,1e-9)),'requestedMeters':requested,'effectiveMeters':effective,'yawRadians':yaw,'pitchRadians':pitch,'pathTurnRadians':route_turn,'inputChanges':changes,'lampChanges':lamp_changes,'runChanges':run_changes}

GROUP_RULES={
 'movement':('map','spawn','exit','completion','route','input','player_model','camera'),
 'timing':('clock','time_sources','speed_control','player_speed','timestamp'),
 'combat':('combat','flashlight'),
 'entities':('entity_speed','entity_motion','entity_ai'),
 'automation':('bot',),
 'map_similarity':('map_similarity',),'path_similarity':('path_similarity',),
}

def severity(rule,bot):
 # Absolute evidence counts cannot be diluted by appending idle frames.
 if rule.get('status')!='fail':return 0.
 key=rule['id'];count=rule.get('violations',1)
 if key=='bot':return adjustment(bot)['factor']
 if key in ('seed_similarity','map_similarity','path_similarity'):return 1.
 if key in ('map','spawn','exit','production','completion'):return 1.
 if key in ('time_sources','timestamp'):return .25 # UTC adjustment is not speed evidence.
 if rule.get('maxError',0)>=1:return 1.
 for item in rule.get('evidence',[]):
  if key=='route' and '跨格路径穿墙' in item.get('message',''):return 1.
  observed,expected=item.get('observed'),item.get('expected')
  if key in ('speed_control','player_speed','entity_speed') and type(observed) in (float,int) and type(expected) in (float,int) and expected>0 and abs(observed/expected-1)>=.25:return 1.
 return 1. if count>=16 else .5 if count>=3 else .25

def penalties(report,limits):
 rules={r['id']:r for r in report.get('rules',[])};levels={k:severity(v,report.get('bot')) for k,v in rules.items()};suppressed={}
 if levels.get('seed_similarity',0) and levels.get('map_similarity',0):suppressed['map_similarity']='seed_similarity';levels['map_similarity']=0.
 # Model effects of a confirmed collision or timing fault share that root cause.
 if levels.get('route',0):
  for key in ('player_model','camera','entity_motion'):
   if levels.get(key,0):suppressed[key]='route';levels[key]=0.
 if levels.get('speed_control',0):
  for key in ('clock','time_sources','player_model','camera','entity_motion'):
   if levels.get(key,0):suppressed[key]='speed_control';levels[key]=0.
 if levels.get('combat',0) and levels.get('camera',0):suppressed['camera']='combat';levels['camera']=0.
 parts={group:round(limits[group]*max((levels.get(k,0) for k in keys),default=0),2) for group,keys in GROUP_RULES.items()}
 # Suspicion is continuous evidence, independent of a separate review gate.
 parts['automation']=adjustment(report.get('bot'),limits['automation'],rules.get('bot',{}).get('status') not in (None,'disabled','insufficient','inconclusive'))['deduction']
 return parts,suppressed

ZERO_SCORE_ABOVE=10


def independent_violations(report,suppressed):
 failed={r['id']:r for r in report.get('rules',[]) if r.get('status')=='fail'}
 ignored={key:reason for key,reason in suppressed.items() if key in failed}
 for key in ('coin_generation','coin_pickup'):
  details=failed.get(key,{}).get('details',{})
  if details.get('blockedBy') or str(details.get('reasonKind','')).startswith('prerequisite_'):
   if key in failed:ignored[key]='prerequisite_failure'
 ids=sorted(set(failed)-set(ignored))
 return {'count':len(ids),'ids':ids,'ignored':ignored,'zeroScoreAbove':ZERO_SCORE_ABOVE,'exceedsLimit':len(ids)>ZERO_SCORE_ABOVE,'basis':'distinct_failed_rules_after_causal_suppression'}


def evaluate_report(report,configured_weights=None,configured_deductions=None,seed_cap=9):
 m=report['metrics'];ref=m.get('raceReference');ref=ref if isinstance(ref,dict) else {};w=weights(configured_weights);limits=deductions(configured_deductions)
 completed=bool(m.get('clientCompleted',m.get('completed',False)));rule_states={r['id']:r.get('status') for r in report.get('rules',[])}
 verified_completed=bool(m.get('completed',False)) and rule_states.get('completion')=='pass' and rule_states.get('exit')=='pass'
 elapsed=positive_finite(m.get('wallDuration') if m.get('wallDuration') is not None else m.get('duration',0))
 theory=positive_finite(ref.get('seconds')) if ref.get('available') else 0.;distance=positive_finite(m.get('pathMeters'))
 reference_distance=positive_finite(ref.get('distance')) if ref.get('available') else 0.
 timing=m.get('raceTiming')
 if isinstance(timing,dict) and timing.get('version')=='visibility-timing-1':theory=positive_finite(timing.get('scoringSeconds'))
 pace=pace_bonus(theory,elapsed)
 coin_metrics=m.get('coins') if isinstance(m.get('coins'),dict) else {};tactical=m.get('tactics') if isinstance(m.get('tactics'),dict) else {}
 count=coin_metrics.get('collected',0)
 coin_blocked=coin_award_blockers(report)
 coins=count/3 if not coin_blocked and coin_metrics.get('available') and coin_metrics.get('total')==3 and type(count) is int and 0<=count<=3 else 0.
 tactics=clamp(positive_finite(tactical.get('factor'))) if tactical.get('available') else 0.
 losses,suppressed=penalties(report,limits);loss=round(sum(losses.values()),2);violations=independent_violations(report,suppressed)
 failed={r['id'] for r in report.get('rules',[]) if r.get('status')=='fail' and r['id'] not in suppressed}
 excluded={}
 if coin_blocked:excluded['coins']=list(coin_blocked)
 if not verified_completed:
  for key in ('pace','coins','tactics'):excluded[key]=['completion']
  pace=coins=tactics=0.
 route_faults=failed&{'map','spawn','exit','route','input','player_model'}
 if route_faults:
  for key in ('pace','coins','tactics'):excluded[key]=sorted(route_faults)
  pace=coins=tactics=0.
 elif failed&{'clock','speed_control','player_speed'}:
  faults=sorted(failed&{'clock','speed_control','player_speed'})
  for key in ('pace','coins','tactics'):excluded[key]=faults
  pace=coins=tactics=0.
 tactical_faults=failed&{'entity_motion','entity_ai','entity_speed','combat'}
 if tactical_faults:excluded['tactics']=sorted(tactical_faults);tactics=0.
 factors={'completion':1.,'pace':pace,'coins':coins,'tactics':tactics}
 parts={key:round(w[key]*factor,2) if completed else 0. for key,factor in factors.items()}
 base=round(sum(parts.values()),2)
 proof=report.get('proof',{});checks=report.get('importChecks',{})
 invalid_import=(report.get('importAccepted') is False or any(checks[key]!='passed' for key in ('envelope','authentication','compression','signature','format') if key in checks) or ('signature' in proof and proof['signature'] not in ('valid','verified')))
 fatal=(not completed or positive_finite(m.get('remainingHealth'))==0 or proof.get('testFixture') is True or rule_states.get('production')=='fail' or invalid_import)
 zero_reason='invalid_import' if invalid_import else 'developer_or_production' if proof.get('testFixture') is True or rule_states.get('production')=='fail' else 'no_recorded_victory' if fatal else 'too_many_independent_violations' if violations['exceedsLimit'] else None
 # Feasible references are upper bounds. A faster legal run can saturate pace,
 # but approximate path geometry alone must not certify a globally exact 100.
 exact=bool(ref.get('exactOptimality')) and theory>0 and elapsed>0 and distance>0 and reference_distance>0 and abs(elapsed-theory)<=1e-6 and abs(distance-reference_distance)<=1e-6 and bool(report.get('rules')) and all(r['status']=='pass' for r in report['rules'])
 before_floor=round(min(100. if exact else 99.99,max(0.,base-loss)),2)
 floor_eligible=not fatal and not violations['exceedsLimit'];minimum=max(1.,10.-violations['count']) if floor_eligible else 0.
 score=round(max(before_floor,minimum),2) if floor_eligible else 0.
 completion_floor={'eligible':floor_eligible,'minimum':minimum,'applied':floor_eligible and score>before_floor,'beforeFloor':before_floor,'rawAfterDeductions':round(base-loss,2),'scoreBeforeSeed':score,'seedLimited':False}
 seed_matched=any(r['id']=='seed_similarity' and r['status']=='fail' for r in report.get('rules',[]))
 if seed_matched and floor_eligible:
  before=score;effective_cap=max(1.,seed_cap);score=round(min(effective_cap,max(1.,score*effective_cap/100)),2);losses['seed']=round(max(0.,before-score),2)
  completion_floor['seedLimited']=score<before
 parts['integrity']=round(score-base,2)
 badges=[]
 if completed and not verified_completed:badges.append('客户端触发通关')
 if verified_completed:
  badges.append('无伤脱出' if m.get('hits',0)==0 and m.get('remainingHealth',0)>=99.999 else '负伤脱出')
  if coins==1.:badges.append('完成收集')
  if tactics>0.:badges.append('潜行脱出' if tactical.get('stealth') else '成功脱身')
 policy={'version':VERSION,'weights':w,'deductions':limits,'paceCurve':{'method':'normalized_excess_exponential','decay':PACE_DECAY,'formula':'exp(-3 * max(0, elapsed / reference - 1))'},'coinCount':3,'coinRequires':'current_native_generation_and_verified_survival_pickup','tacticsMethod':'verified-distinct-escapes-1','efficiencyRequires':'verified_route_and_clock','referenceObjective':'spawn_to_exit_only','referenceMethod':ref.get('method','legacy'),'ordinaryMaximum':99.99,'fullScore':'verified_exact_optimum','timeBasis':'recorded_wall_including_pause','seedScoreCap':seed_cap,'seedEffectiveScoreCap':max(1.,seed_cap),'seedMinimumScore':1.,'completionFloor':{'method':'max(1, 10 - independent_failed_rules)','maximumIndependentFailures':ZERO_SCORE_ABOVE,'requires':'recorded_victory_alive_authenticated_production','seedRepeatMinimum':1.}}
 if isinstance(timing,dict) and timing.get('version')=='visibility-timing-1':policy['raceTiming']=timing
 policy['automationCurve']={'threshold':THRESHOLD,'maximum':min(MAX_DEDUCTION,limits['automation']),'shape':CURVE,'formula':'cap * log1p(9 * clamp((suspicion - 50) / 50, 0, 1)) / log(10)'}
 automation=adjustment(report.get('bot'),limits['automation'],any(r.get('id')=='bot' and r.get('status') in ('pass','fail') for r in report.get('rules',[])))
 ratio=elapsed/theory if theory>0 and elapsed>0 else None
 if ratio is not None and not math.isfinite(ratio):ratio=None
 return {'version':VERSION,'completed':completed,'verifiedCompleted':verified_completed,'score':score,'referenceScore':score,'grade':grade(score),'components':parts,'eligible':True,'provisional':report.get('verdict')!='accepted','badges':badges,'description':' · '.join(badges) if completed else '未形成完整通关。','policy':policy,'automation':automation,'policySha256':hashlib.sha256(json.dumps(policy,sort_keys=True).encode()).hexdigest(),'raceMultiple':ratio,'judgeFactor':score/base if base else 0.,'baseScore':base,'violationSummary':violations,'completionFloor':completion_floor,'zeroReason':zero_reason,'deductions':losses,'suppressedRules':suppressed,'excludedBonuses':excluded,'timeBasis':'recorded_wall_including_pause','scoredDuration':elapsed,'formula':f'通关{w["completion"]}，竞速{w["pace"]}×exp(-3×max(0,实际用时÷参考用时−1))，金币{w["coins"]}×收集比例，战术{w["tactics"]}×有效表现，减去分类异常扣分；参考路线固定为出生点至出口，金币绕路计入实际用时；自动化可疑度超过50%按对数曲线扣分，最多{min(MAX_DEDUCTION,limits["automation"]):g}分；未满足原版通关条件不计竞速、金币与战术奖励；正式存活胜利记录不超过10类独立异常时保留max(1,10−异常数)分，超过10类归零；开发、未胜利或无效凭证为0；普通最高99.99。'}
