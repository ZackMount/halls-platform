"""Interpretable suspicion and its bounded score adjustment, not a probability."""
import math

THRESHOLD = 50.
MAX_DEDUCTION = 40.
CURVE = 9.
MODEL_VERSION = 'forest-only-3'

# Validate and discard saved heuristic settings. They cannot affect model scores
# or remain as apparent controls in the administrator's current rule schema.
RETIRED_PARAMETERS={'min_signals':(1,6),'min_turns':(1,100),
 **{key:(0,100) for key in ('optimal_weight','grid_weight','turn_weight','separation_weight','rhythm_weight','sparse_weight',
 'precision_weight','motion_weight','lattice_weight','easing_weight','macro_weight','waypoint_weight','clock_pattern_weight',
 'held_refresh_weight','frame_reversal_weight','learned_weight','pulse_weight')}}

def migrate_parameters(params):
 result=dict(params)
 for key in RETIRED_PARAMETERS.keys() & result.keys():
  n=result.pop(key);low,high=RETIRED_PARAMETERS[key]
  if type(n) not in (int,float) or not math.isfinite(n) or not low<=n<=high or n!=int(n):raise ValueError('Invalid retired behavior parameter: '+key)
 return result


def require_assessment(check,bot,required):
 """Admission-snapshot requirement; abstention is not a fabricated model score."""
 if not required or bot.get('sufficient'):return
 learned=bot.get('patterns',{}).get('learned',{})
 if learned.get('available') is not True or bot.get('unavailableReason')!='insufficient_activity_windows':
  raise RuntimeError('行为模型未能完成评估，请重试。')
 bot['requiredEvidenceMissing']=True
 check.config={**check.config,'action':'reject'}
 check.test(False,None,'有效操作记录不足，未通过反自动化校验',learned.get('eligibleWindows',0),'至少 3 个有效窗口且满足最短分析时长')


def adjustment(bot, maximum=MAX_DEDUCTION, enabled=True):
 score = bot.get('score') if isinstance(bot,dict) and bot.get('sufficient') else None
 available = enabled and type(score) in (int,float) and math.isfinite(score) and 0<=score<=100
 maximum = min(MAX_DEDUCTION,max(0.,maximum))
 x = max(0.,min(1.,(score-THRESHOLD)/(100.-THRESHOLD))) if available else 0.
 missing = enabled and isinstance(bot,dict) and bot.get('requiredEvidenceMissing') is True
 factor = 1. if missing else math.log1p(CURVE*x)/math.log1p(CURVE)
 return {'available':bool(available),'suspicion':score if available else None,
         'threshold':THRESHOLD,'maximumDeduction':maximum,'deduction':round(maximum*factor,2),
         'factor':factor,'kind':'required_behavior_evidence_missing' if missing else 'behavior_suspicion_not_probability'}
