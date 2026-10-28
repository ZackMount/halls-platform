"""Organizer-only attribution ledger; never part of public runs or proof reports."""
import csv,io,math,re,time,unicodedata
from datetime import datetime,timezone
from flask import request,jsonify,Response,stream_with_context,abort
from store import db,audit

KINDS={'provided','configured','context','request_host','forwarded_host','page_host','unspecified','legacy_missing'}
def source_id(value):
 if not isinstance(value,str):raise ValueError('来源标识应为文本。')
 value=value.strip()
 if len(value)>256 or len(value.encode('utf-8'))>1024 or any(unicodedata.category(c)[0]=='C' for c in value):raise ValueError('来源标识无效。')
 return value

def kind(value,identifier):
 if not identifier:return 'unspecified'
 if not isinstance(value,str) or value not in KINDS:raise ValueError('来源获取方式无效。')
 return value

def record(c,key,sha,size,identifier='',origin_kind='provided',*,channel='api',problem=None,submission=None,instance='',run=None,duplicate=False,verified=False,status='preflight'):
 row=c.execute('INSERT INTO submission_sources(at,channel,key_id,key_label,problem_id,submission_id,instance,source_id,source_kind,sha,file_bytes,hash_verified,run_id,duplicate,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',(time.time(),channel,key['id'],key['label'],problem,submission,instance,identifier,kind(origin_kind,identifier),sha,size,int(verified),run,int(duplicate),status))
 return row.lastrowid

def bind(c,key_id,problem,submission,sha,run,*,verified=False,duplicate=False,status='queued'):
 c.execute('UPDATE submission_sources SET run_id=?,hash_verified=MAX(hash_verified,?),duplicate=MAX(duplicate,?),status=? WHERE channel=? AND key_id=? AND problem_id=? AND submission_id=? AND sha=?',(run,int(verified),int(duplicate),status,'koh',key_id,problem,submission,sha))

QUERY="""SELECT s.*,r.name AS run_name,
 CASE WHEN s.duplicate=1 THEN 'duplicate' WHEN s.status IN ('hash_mismatch','upload_interrupted') THEN s.status ELSE COALESCE(r.status,s.status) END AS result_status,
 CASE WHEN s.duplicate=1 OR r.status IN ('invalid','duplicate') THEN 0 ELSE r.score END AS result_score
 FROM submission_sources s LEFT JOIN runs r ON r.id=s.run_id"""

def criteria():
 query=request.args.get('q','').strip()
 if len(query)>256:abort(400)
 filters=[];params=[]
 if query:filters.append('(instr(s.sha,?)>0 OR instr(s.source_id,?)>0 OR instr(s.key_label,?)>0)');params.extend([query]*3)
 return (' WHERE '+' AND '.join(filters)) if filters else '',params

def iso(value):return datetime.fromtimestamp(value,timezone.utc).isoformat(timespec='milliseconds').replace('+00:00','Z')
def csv_cell(value):
 if value is None:return ''
 text=str(value)
 # Quoting alone does not stop Excel treating an identifier as a formula.
 return "'"+text if text.lstrip().startswith(('=','+','-','@')) or text.startswith(('\t','\r','\n')) else text

def register(app,admin_required):
 @app.get('/api/admin/submission-sources')
 @admin_required
 def source_list():
  where,params=criteria()
  try:page=max(1,min(100000,int(request.args.get('page','1'))))
  except ValueError:abort(400)
  with db() as c:
   total=c.execute('SELECT COUNT(*) FROM submission_sources s'+where,params).fetchone()[0]
   rows=c.execute(QUERY+where+' ORDER BY s.id DESC LIMIT 30 OFFSET ?',params+[(page-1)*30]).fetchall()
  return jsonify(items=[dict(r) for r in rows],total=total,page=page,pages=math.ceil(total/30))

 @app.get('/api/admin/submission-sources.csv')
 @admin_required
 def source_export():
  where,params=criteria()
  with db(True) as c:audit(c,'admin','submission_sources_export',detail={'query':request.args.get('q','')})
  def generate():
   buffer=io.StringIO(newline='');writer=csv.writer(buffer)
   def chunk(row):
    writer.writerow([csv_cell(v) for v in row]);text=buffer.getvalue();buffer.seek(0);buffer.truncate(0);return text
   yield '\ufeff'+chunk(['received_at_utc','file_sha256','source_id','source_kind','channel','problem_id','submission_id','instance_id','api_key_label','run_id','run_name','duplicate','hash_verified','status','score'])
   with db() as c:
    cursor=c.execute(QUERY+where+' ORDER BY s.id',params)
    while rows:=cursor.fetchmany(256):
     for r in rows:yield chunk([iso(r['at']),r['sha'],r['source_id'],r['source_kind'],r['channel'],r['problem_id'],r['submission_id'],r['instance'],r['key_label'],r['run_id'],r['run_name'],r['duplicate'],r['hash_verified'],r['result_status'],r['result_score']])
  return Response(stream_with_context(generate()),mimetype='text/csv',headers={'Content-Disposition':'attachment; filename="halls-submission-sources.csv"','Cache-Control':'no-store'})
