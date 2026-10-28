"""Allowlisted player-facing reports. Internal evidence never crosses this boundary."""
import math,re
from engine.eligibility import UPGRADE_MESSAGE
SCORE_COMPONENTS=('completion','pace','coins','tactics')
MAX_REFERENCE_POINTS=8192
MAX_REFERENCE_SECONDS=86400
def race_reference(report,include_path=False):
 # Use the reference saved by the judge (canonical spawn to original exit),
 # not the player's travelled path, changed exits, coins, or current policy.
 metrics=report.get('metrics') if isinstance(report,dict) else None
 reference=metrics.get('raceReference') if isinstance(metrics,dict) else None
 if not isinstance(reference,dict) or reference.get('available') is not True:return {'available':False}
 seconds=reference.get('seconds');path=reference.get('path')
 if type(seconds) not in (int,float) or not 0<=seconds<=MAX_REFERENCE_SECONDS or not math.isfinite(seconds):return {'available':False}
 if not isinstance(path,(list,tuple)) or not 1<=len(path)<=MAX_REFERENCE_POINTS:return {'available':False}
 for point in path:
  if not isinstance(point,(list,tuple)) or len(point)!=2 or any(type(value) not in (int,float) or not 0<=value<512 or not math.isfinite(value) for value in point):return {'available':False}
 result={'available':True,'seconds':seconds,'approximate':reference.get('exactOptimality') is not True}
 if include_path:result['path']=[list(point) for point in path]
 return result

def component_maxima(report):
 # Read the scoring snapshot that produced this record, never today's settings.
 # Only the four public point caps cross the report's allowlist boundary.
 perf=report.get('performance',{});policy=perf.get('policy')
 primary=policy.get('weights') if isinstance(policy,dict) else None
 platform=report.get('platformPolicy');fallback=platform.get('scoring') if isinstance(platform,dict) else None
 primary=primary if isinstance(primary,dict) else {};fallback=fallback if isinstance(fallback,dict) else {}
 result={}
 for key in SCORE_COMPONENTS:
  value=primary[key] if key in primary else fallback.get(key)
  if type(value) in (int,float) and 0<=value<=100 and math.isfinite(value):result[key]=value
 return result
ADJUSTMENTS={
 'movement':('地图与运动','地图、路线或移动记录存在异常。'),
 'timing':('时间与速度','时间或速度记录存在异常。'),
 'combat':('生存资源与战斗','电池、攻击、生命值或受伤记录存在不一致。'),
 'entities':('实体行为','实体的运动或行为记录存在异常。'),
 'automation':('自动化行为','操作记录呈现自动化倾向，按可疑度扣分。'),
 'map_similarity':('地图相似','地图与已有成绩高度相似。'),
 'path_similarity':('路径相似','行走路线与已有成绩高度相似。'),
 'seed':('重复地图','地图种子与已有成绩重复，按重复地图规则折减。'),
}
def score_adjustments(perf):
 items=[{'title':title,'reason':reason,'points':-round(value,2)} for key,(title,reason) in ADJUSTMENTS.items() if isinstance((value:=perf.get('deductions',{}).get(key)),(float,int)) and value>0]
 excluded=perf.get('excludedBonuses',{})
 notes=[]
 if set(excluded.get('pace',[]))&{'exit','completion'}:notes.append('出口或通关状态未通过校验，竞速、金币与战术奖励未计入。')
 elif excluded.get('coins') and excluded.get('pace'):notes.append('路线、移动或时间记录存在异常，对应奖励未计入。')
 elif excluded.get('coins'):notes.append('金币拾取或生存状态未完成有效校验，金币奖励未计入。')
 elif excluded.get('navigation'):notes.append('路线或移动记录存在异常，竞速与路线奖励未计入。')
 elif excluded.get('pace'):notes.append('时间或速度记录存在异常，竞速奖励未计入。')
 if excluded.get('tactics') and not (excluded.get('coins') and excluded.get('pace')):notes.append('实体或战斗记录存在异常，战术奖励未计入。')
 if perf.get('zeroReason')=='too_many_independent_violations':notes.append('独立违规项超过 10 项，得分归零。')
 elif items and perf.get('score')==0 and sum(-v['points'] for v in items)>perf.get('baseScore',100):notes.append('扣分超过当前得分，最终按零分计算。')
 floor=perf.get('completionFloor',{})
 if floor.get('applied'):
  notes.append('已按通关保底结算；重复地图另按对应规则折减。' if floor.get('seedLimited') else '已按通关保底结算。')
 if perf.get('completed') and perf.get('score')==0 and not items:items.append({'title':'成绩有效性','reason':'通关记录未满足成绩要求，得分归零。','points':-perf.get('baseScore',0)})
 if not items and perf.get('components',{}).get('integrity',0)<0:notes.append('普通成绩按最高分上限结算。')
 return {'items':items,'notes':notes}
NOTES={
 'production':('记录符合正式成绩要求。','记录未满足正式成绩要求。'),
 'map':('地图记录一致。','地图记录存在不一致。'),
 'spawn':('开局状态正常。','开局状态存在异常。'),
 'exit':('出口记录一致。','出口记录存在异常。'),
 'completion':('已确认完成通关。','通关过程未能通过确认。'),
 'clock':('时间与状态记录正常。','时间或状态记录存在异常。'),
 'time_sources':('现实计时记录一致。','系统计时存在差异，需要复核。'),
 'speed_control':('未发现异常的游戏计时倍率。','游戏计时存在加速、减速或步长异常。'),
 'route':('行走路线未发现碰撞异常。','行走路线存在需要核实的碰撞异常。'),
 'input':('操作记录与运动表现一致。','操作记录与运动表现存在不一致。'),
 'player_speed':('玩家移动速度正常。','玩家移动速度存在异常。'),
 'player_model':('玩家运动记录一致。','玩家运动记录存在异常。'),
 'entity_speed':('实体移动速度正常。','实体移动速度存在异常。'),
 'entity_motion':('实体运动记录一致。','实体运动记录存在异常。'),
 'entity_ai':('实体行为记录一致。','实体行为记录存在异常。'),
 'combat':('攻击与受伤记录一致。','攻击或受伤记录存在不一致。'),
 'coin_generation':('已复算金币位置与可达性。','金币生成结果未通过校验。'),
 'coin_pickup':('已完成金币拾取复算。','金币拾取未通过校验，金币奖励未计入。'),
 'flashlight':('手电筒电量与开关记录一致。','电量消耗、充电或开关时序存在异常。'),
 'camera':('视角变化与游戏过程一致。','视角变化存在异常。'),
 'bot':('自动化可疑度未超过复核阈值。','自动化可疑度较高，保留复核标记。'),
 'seed_similarity':('地图种子未发现重复。','地图种子与已有记录重复。'),
 'map_similarity':('未发现需要复核的相似地图记录。','与已有地图记录相似，需要人工复核。'),
 'path_similarity':('未发现需要复核的相似路线记录。','与已有行走路线相似，需要人工复核。'),
 'timestamp':('通关日期正常。','通关日期需要进一步核实。'),
}
def related_runs(rule):
 if rule.get('id') not in ('seed_similarity','map_similarity','path_similarity'):return []
 ids=list(dict.fromkeys(e.get('id') for e in rule.get('evidence',[]) if isinstance(e.get('id'),str) and re.fullmatch('[a-f0-9]{24}',e['id'])))[:16]
 if not ids:return []
 from store import db,visible
 with db() as c:
  rows=c.execute('SELECT id,name,status,decision,board,score FROM runs WHERE id IN ('+','.join('?' for _ in ids)+')',ids).fetchall()
  found={r['id']:r for r in rows if visible(r,c)}
 return [{'id':key,'name':found[key]['name']} for key in ids if key in found]

def public_report(report):
 if not report:return None
 if report.get('code')=='client_upgrade_required':return {'verdict':'not_assessed','code':'client_upgrade_required','error':UPGRADE_MESSAGE}
 if not isinstance(report.get('rules'),list):return {'verdict':'not_assessed','error':'凭证校验未通过，无法评判此记录。'}
 summaries=[]
 perf=report.get('performance',{})
 suppressed=perf.get('suppressedRules',{})
 for rule in report['rules']:
  status=rule.get('status');notes=NOTES.get(rule.get('id'),('检查通过。','检查发现异常。'))
  summary={'pass':notes[0],'fail':notes[1],'disabled':'本次未启用此项检查。','insufficient':'记录信息不足，此项暂不作判断。','inconclusive':'此项检查未能完成，需要进一步复核。'}.get(status,'此项尚未完成评判。')
  if rule.get('id') in ('time_sources','speed_control') and status=='inconclusive' and '旧凭证' in (rule.get('reason') or ''):summary='此凭证未记录现实计时，无法核实变速。'
  if rule.get('id')=='coin_pickup' and status=='pass':
   coins=report.get('metrics',{}).get('coins',{});count=coins.get('collected')
   if coins.get('available') is True and coins.get('total')==3 and type(count) is int and 0<=count<=3:summary=f'已确认拾取 {count} / 3 枚金币。'
  if rule.get('id') in ('coin_generation','coin_pickup'):
   if status=='fail' and rule.get('details',{}).get('blockedBy'):summary='关联的游戏校验未通过，金币奖励未计入。'
   elif status in ('disabled','insufficient','inconclusive'):summary='金币有效性尚未完成核实，金币奖励未计入。'
  if rule.get('id')=='exit' and status=='pass' and rule.get('details',{}).get('timelineAvailable') is False:
   summary='初始出口一致；此版本未记录运行中的出口变化。'
   if rule.get('details',{}).get('clientVictory') and not rule.get('details',{}).get('completionMatchesRecordedExit'):summary='初始出口一致，但胜利位置不在该处；旧版未记录变化过程。'
  parent={'route':'路线与碰撞','speed_control':'游戏变速','combat':'攻击与伤害'}.get(suppressed.get(rule.get('id')))
  if status=='fail' and parent:summary=f'该偏差已与“{parent}”合并计分，不重复扣分。'
  item={'title':rule['title'],'status':status,'summary':summary};related=related_runs(rule)
  if related:item['relatedRuns']=related
  summaries.append(item)
 perf=report.get('performance',{})
 automation=perf.get('automation',{})
 public_automation={k:v for k,v in automation.items() if k in ('available','suspicion','deduction','maximumDeduction','kind')}
 return {'verdict':report.get('verdict'),'proof':{k:v for k,v in report.get('proof',{}).items() if k in ('completedAt','version','platform','architecture')},'performance':{k:v for k,v in perf.items() if k in ('score','referenceScore','grade','description','components')}|{'componentMaxima':component_maxima(report),'raceReference':race_reference(report),'adjustments':score_adjustments(perf),'automation':public_automation},'rules':summaries}
