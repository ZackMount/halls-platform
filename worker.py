"""One admitted job per subprocess, bounded lifetime and no public listening socket."""
import fcntl,json,os,shutil,signal,sqlite3,subprocess,sys,time,traceback
from pathlib import Path
from store import ROOT,DATA,db,dumps,digest,initialize,audit,settings
sys.path.insert(0,str(ROOT/'engine'))
from codec import decode,ProofError
from eligibility import require_current_submission,upgrade_error
from judge import adjudicate
from scoring import evaluate_report
from similarity import fingerprint,compare
from replay import convert
import previews
from moderation import automatic_decision

def finish(run_id,status,report):
 with db(True) as c:
  row=c.execute('SELECT policy FROM runs WHERE id=?',(run_id,)).fetchone()
  if row and json.loads(row['policy']).get('fullyAutomatic'):
   c.execute("UPDATE runs SET decision='rejected',board='hidden' WHERE id=?",(run_id,))
  c.execute('UPDATE runs SET status=?,report=?,verdict=?,updated=? WHERE id=?',(status,dumps(report),report.get('verdict','not_assessed'),time.time(),run_id))
  audit(c,'worker','job_'+status,run_id,{'code':report.get('code')})

def assess(meta,frames,config,run_id,uploaded_at,revision):
 require_current_submission(meta)
 report=adjudicate(meta,frames,config['judge'],require_behavior_assessment=config.get('requireBehaviorAssessment',False),strict_race_reference=config.get('strictRaceReference',False))
 fp=fingerprint(meta,frames);cross=compare(fp,run_id,config['similarity'])
 ts=config['timestamp'];future=meta['completedAt']-uploaded_at;age=uploaded_at-meta['completedAt']
 okay=future<=ts['futureSkewSeconds'] and (ts['maxAgeDays']==0 or age<=ts['maxAgeDays']*86400)
 cross.append({'id':'timestamp','title':'通关时间戳','group':'时间','status':'disabled' if not ts['enabled'] else 'pass' if okay else 'fail','action':ts['action'],'checked':1,'violations':0 if okay else 1,'evidence':[] if okay else [{'message':'客户端时间超前或超出允许提交期限','futureSeconds':future,'ageDays':age/86400}],'details':{'completedAt':meta['completedAt'],'utcOffsetMinutes':meta['utcOffsetMinutes'],'uploadedAt':uploaded_at,'source':'客户端系统时钟，签名覆盖；并非服务器见证时间'}})
 report['rules']+=cross;report['platformPolicy']=config;report['platformPolicyRevision']=revision;report['proof'].update({k:meta[k] for k in ['completedAt','utcOffsetMinutes','rawSha256','platform','architecture','inputMode']})
 report['coverage']['total']+=len(cross);report['coverage']['enabled']+=sum(v['status']!='disabled' for v in cross);report['coverage']['rulesCompleted']+=sum(v['status'] in ('pass','fail') for v in cross)
 for v in cross:
  status=v['status'];key='failed' if status=='fail' and v['action']=='reject' else 'review' if status=='inconclusive' or status=='fail' else 'disabled' if status=='disabled' else 'insufficient' if status=='insufficient' else None
  if key:report[key].append(v['id'])
 report['verdict']='rejected' if report['failed'] else 'review' if report['review'] else 'accepted_limited' if report['disabled'] or report['insufficient'] else 'accepted'
 report['label']={'accepted':'通过全部规则','accepted_limited':'部分检查未完成或关闭','review':'需要人工复核','rejected':'未通过规则'}[report['verdict']]
 report['performance']=evaluate_report(report,config.get('scoring'),config.get('deductions'),config.get('seedScoreCap',9))
 return report,fp

def process(run_id):
 with db() as c:r=c.execute('SELECT * FROM runs WHERE id=?',(run_id,)).fetchone()
 if not r or r['status']!='processing':return
 config=json.loads(r['policy'])
 try:
  meta,frames=decode((DATA/'proofs'/run_id).read_bytes(),os.environ.get('HALLS_KEY','/run/secrets/recipient.pem'))
  require_current_submission(meta)
  identity=digest(meta['keyId']+':'+meta['runId'])
  try:
   with db(True) as c:c.execute('UPDATE runs SET identity=?,raw_sha=?,seed=? WHERE id=?',(identity,meta['rawSha256'],meta['seed'],run_id))
  except sqlite3.IntegrityError:
   with db() as c:original=c.execute('SELECT id FROM runs WHERE identity=? OR raw_sha=? ORDER BY created LIMIT 1',(identity,meta['rawSha256'])).fetchone()
   finish(run_id,'duplicate',{'verdict':'not_assessed','code':'duplicate_record','error':'该通关记录已存在，重新加密或更换名称不能重复提交。','importChecks':meta['importChecks'],'originalRun':original['id'] if original else None});(DATA/'proofs'/run_id).unlink(missing_ok=True);return
  report,fp=assess(meta,frames,config,run_id,r['created'],r['policy_revision']);perf=report['performance']
  decision=automatic_decision(config,meta,report)
  playable=bool(meta['playbackSafe'])
  if playable:convert(meta,frames,DATA/'replays'/run_id)
  report['platformDecision']=decision
  tags=list(perf['badges'])
  if any(v['status']=='fail' and v['id'] in ('path_similarity','map_similarity') for v in report['rules']):tags.append('相似记录待复核')
  if report.get('bot') and any(v['id']=='bot' and v['status']=='fail' for v in report['rules']):tags.append('疑似自动化')
  if report['failed']:tags.append('数据异常')
  used=(DATA/'proofs'/run_id).stat().st_size+sum(p.stat().st_size for p in (DATA/'replays'/run_id).rglob('*') if p.is_file())
  with db(True) as c:
   c.execute('UPDATE runs SET status=\'done\',decision=?,board=?,tags=?,report=?,score=?,duration=?,grade=?,verdict=?,playable=?,fingerprint=?,bytes=?,updated=? WHERE id=?',(decision['decision'],decision['board'],dumps(tags),dumps(report),perf['score'],meta['duration'],perf['grade'],report['verdict'],playable,dumps(fp),used,time.time(),run_id))
   audit(c,'worker','judged',run_id,{'verdict':report['verdict'],'autoApproved':decision['decision']=='approved','mode':decision['mode'],'policyRevision':r['policy_revision']})
 except ProofError as e:
  if e.code=='legacy_format':e=upgrade_error(e.checks)
  if e.code=='client_upgrade_required':
   (DATA/'proofs'/run_id).unlink(missing_ok=True)
   with db(True) as c:c.execute('UPDATE runs SET bytes=0 WHERE id=?',(run_id,))
  finish(run_id,'invalid' if e.status<500 else 'error',e.payload())
 except Exception:
  traceback.print_exc();finish(run_id,'error',{'verdict':'not_assessed','code':'processing_failed','error':'评判未完成，未公开成绩；管理员可查看日志并重试。'})

def run():
 initialize()
 # fcntl lock prevents two schedulers comparing incomplete cross-run libraries.
 with (DATA/'worker.lock').open('a') as lock:
  try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  except BlockingIOError:raise SystemExit('Another worker is already running')
  with db(True) as c:
   c.execute("UPDATE runs SET status='error',report=? WHERE status='processing' AND attempts>=3",(dumps({'verdict':'not_assessed','code':'recovery_limit','error':'任务连续异常中断，已停止自动重试。'}),))
   c.execute("UPDATE runs SET status='queued' WHERE status='processing'")
  previews.cleanup(recover=True);last_cleanup=0.
  while True:
   if time.time()-last_cleanup>60:previews.cleanup();last_cleanup=time.time()
   with db(True) as c:
    row=c.execute("SELECT id,created,'run' kind FROM runs WHERE status='queued' UNION ALL SELECT id,created,'preview' kind FROM preview_cache WHERE status='queued' ORDER BY created LIMIT 1").fetchone()
    if row:
     if row['kind']=='run':c.execute("UPDATE runs SET status='processing',attempts=attempts+1,updated=? WHERE id=?",(time.time(),row['id']))
     else:c.execute("UPDATE preview_cache SET status='processing',updated=? WHERE id=?",(time.time(),row['id']))
   if not row:
    with db(True) as c:
     stale=c.execute("SELECT id FROM runs WHERE status='receiving' AND updated<?",(time.time()-180,)).fetchall()
     for dead in stale:
      (DATA/'proofs'/dead['id']).unlink(missing_ok=True)
      c.execute("UPDATE runs SET status='error',bytes=0,report=? WHERE id=?",(dumps({'verdict':'not_assessed','code':'upload_interrupted','error':'上传中断，请重新提交。'}),dead['id']))
    time.sleep(.5);continue
   flag='--preview' if row['kind']=='preview' else '--job'
   child=subprocess.Popen([sys.executable,__file__,flag,row['id']],start_new_session=True)
   try:child.wait(timeout=240)
   except subprocess.TimeoutExpired:
    os.killpg(child.pid,signal.SIGKILL);child.wait()
    if flag=='--preview':previews.failed(row['id']);continue
    finish(row['id'],'error',{'verdict':'not_assessed','code':'job_timeout','error':'评判超过 240 秒资源上限。'})
   else:
    if child.returncode and flag=='--preview':previews.failed(row['id'])
    elif child.returncode:finish(row['id'],'error',{'verdict':'not_assessed','code':'worker_exit','error':'评判进程异常退出。'})

if __name__=='__main__':
 os.umask(0o077)
 if len(sys.argv)==3 and sys.argv[1] in ('--job','--preview'):
  if sys.platform=='linux':
   import resource
   resource.setrlimit(resource.RLIMIT_AS,(3*1024**3,3*1024**3));resource.setrlimit(resource.RLIMIT_CPU,(210,215));resource.setrlimit(resource.RLIMIT_NOFILE,(128,128))
  (previews.process if sys.argv[1]=='--preview' else process)(sys.argv[2])
 else:run()
