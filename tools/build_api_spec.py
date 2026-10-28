"""Build the organizer-only OpenAPI contract without importing runtime secrets."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
S=lambda name:{'$ref':'#/components/schemas/'+name}
def obj(properties,required=()):return {'type':'object','properties':properties,'required':list(required)}
string={'type':'string'};integer={'type':'integer'};boolean={'type':'boolean'}
identifier={'type':'string','pattern':'^[a-f0-9]{24}$'}
sha={'type':'string','pattern':'^[a-f0-9]{64}$'}
instance={'type':'string','pattern':'^[a-f0-9]{32}$'}
name={'type':'string','minLength':1,'maxLength':32}
number={'type':'number'};nullable_number={'type':['number','null']}
schemas={
 'Error':obj({'error':string,'code':string},['error','code']),
 'JudgeReport':{'type':'object','description':'Complete private report. Per-rule evidence and current policy fields may evolve.','properties':{'verdict':{'enum':['accepted','accepted_limited','review','rejected','not_assessed']},'rules':{'type':'array','items':{'type':'object'}},'performance':{'type':'object','properties':{'score':nullable_number,'referenceScore':nullable_number,'components':{'type':'object'},'adjustments':{'type':'array','items':{'type':'object'}}}}},'additionalProperties':True},
 'SubmissionAccepted':obj({'id':identifier,'status':string,'receipt':string,'statusUrl':string,'report':{'anyOf':[S('JudgeReport'),{'type':'null'}]},'message':string},['id','status','receipt','statusUrl','report']),
 'Submission':obj({'id':identifier,'name':name,'status':string,'decision':{'enum':['pending','approved','rejected']},'board':{'enum':['hidden','ranked','unranked']},'score':nullable_number,'referenceScore':nullable_number,'duration':nullable_number,'completedAt':nullable_number,'created':number,'updated':number,'platform':{'type':['string','null']},'architecture':{'type':['string','null']},'playable':integer,'tags':{'type':'array','items':string},'report':{'anyOf':[S('JudgeReport'),{'type':'null'}]}},['id','status']),
 'KohResult':obj({'status':string,'known':boolean,'uploadRequired':boolean,'id':identifier,'runUrl':string,'code':string,'result':obj({'code':{'const':200},'score':{'type':'number','minimum':0,'maximum':100},'max_score':{'const':100},'feedback':string},['code','score','max_score','feedback'])},['status']),
 'KohLookup':obj({'sha256':sha,'bytes':{'type':'integer','minimum':1,'maximum':15728640},'instance':instance,'context':{'type':'object','additionalProperties':False,'properties':{'problem_id':{'type':'integer','minimum':1,'maximum':9223372036854775807},'submission_id':{'type':'integer','minimum':1,'maximum':9223372036854775807}},'required':['problem_id','submission_id']},'source_id':{'type':'string','maxLength':256},'source_kind':{'enum':['configured','context','page_host','request_host','forwarded_host','provided','unspecified','legacy_missing']}},['sha256','bytes','instance','context']),
 'OK':obj({'ok':boolean},['ok']),
 'KeyCreated':obj({'id':string,'key':{'type':'string','readOnly':True}},['id','key']),
}
paths={}
def parameter(name,location,schema,required=False,description=''):
 return {'name':name,'in':location,'required':required or location=='path','schema':schema,'description':description}
def add(path,method,title,tag,response=None,body=None,parameters=(),security=None,codes=('200',),description=''):
 params=list(parameters)
 import re
 for value in re.findall(r'\{(\w+)\}',path):
  if not any(p['name']==value and p['in']=='path' for p in params):params.append(parameter(value,'path',identifier if value=='id' else string,description='Secret API key; redact from logs.' if value=='key' else ''))
 operation={'summary':title,'operationId':tag.lower().replace(' ','_')+'_'+method+'_'+str(len(paths)),'tags':[tag],'parameters':params,'responses':{code:{'description':'Accepted for processing' if code=='202' else 'Successful response','content':{'application/json':{'schema':response or {'type':'object'}}}} for code in codes},'security':security if security is not None else []}
 for code in ('400','401','403','404','409','413','415','429','500','503'):operation['responses'][code]={'description':{'429':'Rate or queue limit. Honor Retry-After.','503':'Service or storage unavailable. Do not assign contestant zero.'}.get(code,'Request failed'),'content':{'application/json':{'schema':S('Error')}}}
 if description:operation['description']=description
 if body:operation['requestBody']={'required':True,'content':body}
 paths.setdefault(path,{})[method]=operation
 return operation
json_body=lambda schema:{'application/json':{'schema':schema}}
binary={'application/octet-stream':{'schema':{'type':'string','format':'binary','description':'Original proof bytes, 308–15,728,640 bytes.'}}}
receipt=[{'SubmissionReceipt':[]}];admin=[];write=[{'AdminCSRF':[]}]
add('/api/submit/{key}','post','Submit a proof','Submission',S('SubmissionAccepted'),binary,[parameter('name','query',name,True),parameter('wait','query',{'type':'number','minimum':0,'maximum':10,'default':0}),parameter('X-Proof-SHA256','header',sha),parameter('X-Source-ID','header',{'type':'string','maxLength':256})],codes=('200','202'),description='Upload-scope key in path. Duplicate bytes return 409, never reuse an existing score or receipt.')
add('/api/uploads/check','post','Check for an existing file digest','Submission',obj({'duplicate':boolean},['duplicate']),json_body(obj({'sha256':sha},['sha256'])))
add('/api/submissions/{id}','get','Query an owned submission and full report','Submission',S('Submission'),security=receipt)
add('/api/koh/{key}/lookup','post','Preflight a competition submission','KOH',S('KohResult'),json_body(S('KohLookup')),description='KOH-scope key required. A digest used by another submission returns zero without requesting file bytes.')
koh_ids=[parameter('problem_id','path',{'type':'integer','minimum':1}),parameter('submission_id','path',{'type':'integer','minimum':1})]
add('/api/koh/{key}/proofs/{problem_id}/{submission_id}','post','Upload a preflighted competition proof','KOH',S('KohResult'),binary,koh_ids+[parameter('X-KOH-Instance','header',instance,True),parameter('name','query',name)],codes=('200','202'))
add('/api/koh/{key}/results/{problem_id}/{submission_id}','get','Query a competition score','KOH',S('KohResult'),parameters=koh_ids)
add('/api/runs','get','List published runs','Public',parameters=[parameter('board','query',{'enum':['all','ranked','unranked'],'default':'all'}),parameter('sort','query',{'enum':['score','speed','recent'],'default':'score'}),parameter('page','query',{'type':'integer','minimum':1,'maximum':1000,'default':1}),parameter('q','query',{'type':'string','maxLength':32})],description='At most 25 items per page. The default all board combines published ranked and enabled unranked records before sorting and pagination; each item retains its board and exposes displayScore. The rank field numbers only eligible ranked records in the selected sort order, before search or pagination; unranked records have rank=null. Public text reports only.')
add('/api/runs/{id}','get','Read a published run','Public',description='Includes replayBase when a public CDN replay is available; no original proof or private policy data.')
add('/api/runs/{id}/race-reference','get','Read the saved race reference route','Public',obj({'available':boolean,'seconds':{'type':'number','minimum':0,'maximum':86400},'approximate':boolean,'path':{'type':'array','minItems':1,'maxItems':8192,'items':{'type':'array','minItems':2,'maxItems':2,'items':{'type':'number','minimum':0,'exclusiveMaximum':512}}}},['available']),description='The saved judge reference from canonical spawn to original exit, without coin detours. Requires the same visibility as the run. Coordinates are world X/Z metres. Unavailable references return only available=false; approximate=true is not a globally exact optimum. No recomputation or score changes.')
add('/api/downloads','get','List currently offered downloads','Public')
add('/download=halls','get','Download a game archive','Public',parameters=[parameter('platform','query',{'enum':['windows','macos','linux']}),parameter('arch','query',{'enum':['x86_64','aarch64','universal']})])['responses']['200']={'description':'Game archive','content':{'application/octet-stream':{'schema':{'type':'string','format':'binary'}}}}
add('/api/admin/session','get','Read the current CSRF token','Admin',obj({'csrf':string},['csrf']),security=admin)
add('/api/admin/runs','get','List private moderation records','Admin',security=admin,parameters=[parameter('filter','query',{'enum':['all','pending','published','rejected','error'],'default':'all'}),parameter('page','query',{'type':'integer','minimum':1})],description='At most 30 items per page.')
add('/api/admin/runs/{id}','post','Moderate or publish a run','Admin',S('OK'),json_body(obj({'decision':{'enum':['pending','approved','rejected']},'board':{'enum':['hidden','ranked','unranked']},'tags':{'type':'array','maxItems':8,'items':{'type':'string','minLength':1,'maxLength':24}},'note':{'type':'string','maxLength':1000}})),security=write)
add('/api/admin/runs/{id}','delete','Permanently delete a run and its associated files','Admin',obj({'ok':boolean,'deleted':identifier},['ok','deleted']),json_body(obj({'confirm':identifier},['confirm'])),security=write,description='confirm must equal the path id. Requires local administrator service and CSRF. Deletes proof, replay, matching private preview copies and linked competition/source records. Active uploads or judge jobs return 409. Filesystem failure returns 503 and keeps a hidden tombstone for retry. Public CDN copies expire within 60 seconds.')
add('/api/admin/runs/{id}/rejudge','post','Queue reassessment and withdraw publication','Admin',S('OK'),json_body({'type':'object'}),security=write)
add('/api/admin/runs/{id}/report','get','Download a complete report','Admin',S('JudgeReport'),security=admin)
add('/api/admin/settings','get','Read current policy and editable rule definitions','Admin',security=admin)
add('/api/admin/settings','post','Save a complete policy with revision checking','Admin',S('OK'),json_body(obj({'policy':{'type':'object'},'revision':integer},['policy','revision'])),security=write,description='Read the current policy, rules and defaults first. All policy fields are required. A stale revision returns 409.')
add('/api/admin/keys','get','List keys without plaintext secrets','Admin',security=admin)
add('/api/admin/keys','post','Create an upload or KOH key','Admin',S('KeyCreated'),json_body(obj({'label':{'type':'string','minLength':1,'maxLength':40},'scope':{'enum':['upload','koh'],'default':'upload'}},['label'])),security=write,codes=('201',))
for action in ('revoke','restore'):add('/api/admin/keys/{key_id}/'+action,'post',action.capitalize()+' a key','Admin',S('OK'),json_body(obj({'confirmed':{'const':True}},['confirmed'])),security=write)
add('/api/admin/uploads','post','Upload as an administrator','Admin',S('SubmissionAccepted'),binary,parameters=[parameter('name','query',name,True),parameter('wait','query',{'type':'number','minimum':0,'maximum':10})],security=write,codes=('200','202'))
add('/api/admin/submission-sources','get','List private attribution records','Admin',security=admin,parameters=[parameter('page','query',{'type':'integer','minimum':1,'maximum':100000}),parameter('q','query',{'type':'string','maxLength':256})])
add('/api/admin/submission-sources.csv','get','Export attribution as CSV','Admin',security=admin,parameters=[parameter('q','query',{'type':'string','maxLength':256})])['responses']['200']={'description':'UTF-8 CSV with BOM and UTC times','content':{'text/csv':{'schema':{'type':'string'}}}}
for path,title in [('storage','Read disk and platform quota'),('audit','Read the latest 100 audit entries')]:add('/api/admin/'+path,'get',title,'Admin',security=admin)
add('/api/admin/audit/{entry_id}','get','Read one private audit entry','Admin',security=admin,parameters=[parameter('entry_id','path',{'type':'integer','minimum':1})])
spec={'openapi':'3.1.0','info':{'title':'HALLS Integration API','version':'2.0.0','description':'Organizer-only reference. Browser upload/preview session internals and replay binary layouts are not a third-party integration contract. Keys are required path parameters because OpenAPI apiKey security cannot describe a path credential.'},'servers':[{'url':'https://halls.z4ck.dev'}],'tags':[{'name':n} for n in ('Submission','KOH','Public','Admin')],'paths':paths,'components':{'securitySchemes':{'SubmissionReceipt':{'type':'http','scheme':'bearer','description':'Per-submission receipt, not an API key.'},'AdminCSRF':{'type':'apiKey','in':'header','name':'X-CSRF-Token'}},'schemas':schemas}}
(ROOT/'private-docs/openapi.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
print('Built private OpenAPI 3.1:',len(paths),'paths')
