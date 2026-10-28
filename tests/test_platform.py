import copy,hashlib,json,os,secrets,sys,tempfile,time,unittest
from pathlib import Path
from unittest.mock import patch
TEMP=tempfile.TemporaryDirectory();os.environ['HALLS_DATA']=TEMP.name
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from app import app
from store import db,dumps,digest,DEFAULTS,DATA
from werkzeug.security import generate_password_hash
from similarity import compare
from visual_fixture import write_visual
from visual_codec import MIME
class PlatformTests(unittest.TestCase):
 def setUp(self):
  self.client=app.test_client();self.other=app.test_client();app.config.update(TESTING=True,ADMIN_SERVICE=False)
  with db(True) as c:
   for table in ['admin_totp_used','submission_sources','preview_tickets','previews','preview_cache','preview_nonces','runs','rates','audit','sessions','tickets','admins','api_keys','web_uploads']:c.execute('DELETE FROM '+table)
   c.execute('UPDATE settings SET json=?,revision=1',(dumps(DEFAULTS),));c.execute('INSERT INTO admins VALUES(?,?)',('admin',generate_password_hash('a-good-test-password')))
 def login(self):
  self.client.environ_base['halls.admin_service']=True
  return {'X-CSRF-Token':app.config['ADMIN_CSRF']}
 def web_headers(self,client=None):
  client=client or self.client;r=client.post('/api/upload-session',json={},headers={'Origin':'http://localhost'});self.assertEqual(r.status_code,200);return {'Origin':'http://localhost','X-Upload-Token':r.json['token'],'X-Publication-Consent':'1'}
 def upload(self,client=None,data=None,name='test'):
  client=client or self.client;return client.post('/api/uploads?name='+name,data=data or b'x'*400,content_type='application/octet-stream',headers=self.web_headers(client))
 def seed(self,verdict='accepted',score=90,board='hidden',decision='pending'):
  r=self.upload();self.assertEqual(r.status_code,202);i=r.json['id'];report={'proof':{'seed':'secret','runId':'private','completedAt':int(time.time()),'utcOffsetMinutes':480},'policy':{},'platformPolicy':{},'verdict':verdict,'performance':{'referenceScore':90,'completed':True,'components':{'pace':40}},'rules':[]}
  with db(True) as c:c.execute("UPDATE runs SET status='done',score=?,grade='A',duration=100,verdict=?,board=?,decision=?,report=?,playable=1 WHERE id=?",(score,verdict,board,decision,dumps(report),i))
  folder=DATA/'replays'/i;folder.mkdir(exist_ok=True);write_visual(folder);return i,r.json['receipt']
 def test_admin_requires_login_and_csrf(self):
  self.assertEqual(self.client.get('/api/admin/runs').status_code,404);self.login();self.assertEqual(self.client.post('/api/admin/settings',json={}).status_code,403)
 def test_fully_automatic_setting_enables_unranked_without_changing_manual_switches(self):
  headers=self.login();p=copy.deepcopy(DEFAULTS);p.update(fullyAutomatic=True,autoApprove=False,autoPublish=False,unrankedEnabled=False)
  r=self.client.post('/api/admin/settings',json={'policy':p,'revision':1},headers=headers);self.assertEqual(r.status_code,200)
  actual=self.client.get('/api/admin/settings').json['policy'];self.assertTrue(actual['fullyAutomatic']);self.assertTrue(actual['unrankedEnabled']);self.assertFalse(actual['autoApprove']);self.assertFalse(actual['autoPublish'])
 def test_full_mode_processing_failures_stay_private_and_final(self):
  from worker import finish
  key,_=self.seed()
  with db(True) as c:c.execute('UPDATE runs SET policy=? WHERE id=?',(dumps({**DEFAULTS,'fullyAutomatic':True}),key))
  for state in ('invalid','error','duplicate'):
   finish(key,state,{'code':'test_failure','verdict':'not_assessed'})
   with db() as c:r=c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone()
   self.assertEqual((r['status'],r['decision'],r['board']),(state,'rejected','hidden'))
   self.assertEqual(self.other.get('/api/runs/'+key).status_code,404)
 def test_public_assets_are_immutable_but_private_apis_and_worker_updates_are_not(self):
  from app import assets_bundle
  prefix='/static/'+assets_bundle.version
  r=self.client.get(prefix+'/assets/site.js');self.assertEqual(r.status_code,200);self.assertIn('immutable',r.headers['Cache-Control']);self.assertIn(prefix.encode(),r.data)
  shell=self.client.get('/');self.assertIn((prefix+'/assets/site-entry.js').encode(),shell.data)
  self.assertEqual(self.client.get('/api/config').headers['Cache-Control'],'no-store')
  self.login();self.assertEqual(self.client.get('/api/admin/session').headers['Cache-Control'],'no-store')
  self.assertEqual(self.client.get('/sw.js').headers['Cache-Control'],'no-cache')
  self.assertEqual(self.client.get(prefix+'/assets/../../app.py').status_code,404)
 def test_duplicate_hash_preflight_and_server_enforcement(self):
  self.assertEqual(self.upload().status_code,202);sha=digest(b'x'*400)
  self.assertTrue(self.client.post('/api/uploads/check',json={'sha256':sha}).json['duplicate'])
  self.assertEqual(self.upload().status_code,409)
  self.assertEqual(self.client.post('/api/uploads?name=x',data=b'y'*400,content_type='application/octet-stream',headers={**self.web_headers(),'X-Proof-SHA256':sha}).status_code,409)
 def test_hash_mismatch_cleans_reservation(self):
  r=self.client.post('/api/uploads?name=x',data=b'x'*400,content_type='application/octet-stream',headers={**self.web_headers(),'X-Proof-SHA256':'0'*64});self.assertEqual(r.status_code,400)
  with db() as c:self.assertEqual(c.execute('SELECT COUNT(*) FROM runs').fetchone()[0],0)
 def test_pending_not_public_by_id_or_replay(self):
  i,receipt=self.seed();self.assertEqual(self.other.get('/api/runs/'+i).status_code,404);self.assertEqual(self.other.get('/api/submissions/'+i).status_code,404);self.assertEqual(self.other.post('/api/runs/'+i+'/replay-session').status_code,404)
  r=self.other.get('/api/submissions/'+i,headers={'Authorization':'Bearer '+receipt});self.assertIn('report',r.json);self.assertNotIn('seed',r.json['report']['proof'])
 def test_api_guide_is_admin_only(self):
  for url in ['/api-guide','/assets/api-guide.html','/download=api-guide?platform=all&arch=any']:
   self.assertEqual(self.client.get(url).status_code,404,url)
  for url in ['/admin/api-guide','/api/admin/guide']:
   self.assertEqual(self.client.get(url).status_code,404,url)
  self.login();self.assertEqual(self.client.get('/admin/api-guide').status_code,200)
  self.assertTrue(all(item['product']=='halls' for item in self.client.get('/api/downloads').json['items']))
 def test_public_report_omits_internal_evidence(self):
  i,_=self.seed(board='ranked',decision='approved')
  report={'verdict':'accepted','proof':{'seed':'private','completedAt':123},'metrics':{'threshold':99,'referenceAudit':{'secret':'private'}},'informationAudit':{'secret':'private','evidence':[{'cell':[42,42]}]},'bot':{'weights':'secret'},'performance':{'referenceScore':90,'policy':{'secret':1},'formula':'secret'},'rules':[{'id':'map','title':'地图重生成','status':'pass','details':{'threshold':9},'evidence':[{'expected':'private'}],'reason':'internal reason','checked':50}]}
  with db(True) as c:c.execute('UPDATE runs SET report=? WHERE id=?',(dumps(report),i))
  public=self.other.get('/api/runs/'+i).json['report']
  self.assertEqual(set(public['rules'][0]),{'title','status','summary'})
  for value in ['private','secret','internal reason','threshold','evidence','weights','formula']:self.assertNotIn(value,json.dumps(public))
  self.login();self.assertEqual(self.client.get('/api/runs/'+i).json['report'],public)
  self.assertEqual(self.client.get('/api/admin/runs/'+i+'/report').json,report)
 def test_report_download_requires_admin(self):
  i,_=self.seed(board='ranked',decision='approved')
  self.assertEqual(self.other.get('/api/admin/runs/'+i+'/report').status_code,404)
  self.login();r=self.client.get('/api/admin/runs/'+i+'/report')
  self.assertEqual(r.status_code,200);self.assertIn('attachment;',r.headers['Content-Disposition'])
  self.assertEqual(r.json['proof']['seed'],'secret')
 def test_no_raw_file_routes(self):
  for url in ['/data/halls.sqlite3','/proofs/a','/keys/recipient.pem','/engine/trust.json','/assets/../app.py','/api/runs/a/proof']:self.assertEqual(self.client.get(url).status_code,404,url)
 def test_publish_then_takedown_revokes_ticket(self):
  i,_=self.seed();h=self.login();self.assertEqual(self.client.post('/api/admin/runs/'+i,json={'decision':'approved','board':'ranked'},headers=h).status_code,200)
  self.assertEqual(len(self.other.get('/api/runs').json['items']),1);report=self.other.get('/api/runs/'+i).json['report'];self.assertNotIn('seed',report['proof']);self.assertNotIn('policy',report)
  t=self.other.post('/api/runs/'+i+'/replay-session').json['ticket'];headers={'X-Replay-Ticket':t,'Accept':MIME}
  self.assertEqual(self.other.get('/api/replay/'+i+'/manifest',headers=headers).status_code,200)
  self.client.post('/api/admin/runs/'+i,json={'board':'hidden'},headers=h)
  self.assertEqual(self.other.get('/api/replay/'+i+'/0',headers=headers).status_code,404)
 def test_ticket_required_bound_to_ip_and_expires(self):
  i,_=self.seed(board='ranked',decision='approved');t=self.other.post('/api/runs/'+i+'/replay-session').json['ticket']
  self.assertEqual(self.other.get('/api/replay/'+i+'/0').status_code,404)
  self.assertEqual(self.other.get('/api/replay/'+i+'/0',headers={'X-Replay-Ticket':t,'Accept':MIME},environ_base={'REMOTE_ADDR':'10.1.2.3'}).status_code,404)
  with db(True) as c:c.execute('UPDATE tickets SET expires=0')
  self.assertEqual(self.other.get('/api/replay/'+i+'/0',headers={'X-Replay-Ticket':t,'Accept':MIME}).status_code,404)
 def test_binary_initial_packet_is_compressed_and_stale_players_get_clear_error(self):
  import gzip
  from visual_codec import split_initial,decode_manifest,decode_chunk
  i,_=self.seed(board='ranked',decision='approved');ticket=self.other.post('/api/runs/'+i+'/replay-session').json['ticket']
  headers={'X-Replay-Ticket':ticket};stale=self.other.get('/api/replay/'+i+'/manifest',headers=headers)
  self.assertEqual(stale.status_code,406);self.assertIn('刷新',stale.json['error'])
  response=self.other.get('/api/replay/'+i+'/manifest',headers={**headers,'Accept':MIME});self.assertEqual(response.headers['Content-Encoding'],'gzip');self.assertEqual(response.headers['Cache-Control'],'no-store');self.assertEqual(response.mimetype,MIME)
  metadata,first=split_initial(gzip.decompress(response.data));meta=decode_manifest(metadata);self.assertEqual(len(decode_chunk(first,meta,0)),2)
 def test_proxy_spoof_ignored(self):
  with app.test_request_context('/',headers={'X-Real-IP':'1.2.3.4'},environ_base={'REMOTE_ADDR':'8.8.8.8'}):
   from app import ip
   self.assertEqual(ip(),'8.8.8.8')
 def test_unranked_requires_explicit_publication_and_switch(self):
  i,_=self.seed(verdict='rejected',score=None);h=self.login();r=self.client.post('/api/admin/runs/'+i,json={'board':'unranked'},headers=h);self.assertEqual(r.status_code,400)
  p=copy.deepcopy(DEFAULTS);p['unrankedEnabled']=True
  self.assertEqual(self.client.post('/api/admin/settings',json={'policy':p,'revision':1},headers=h).status_code,200)
  self.client.post('/api/admin/runs/'+i,json={'board':'unranked','tags':['数据异常']},headers=h)
  self.assertEqual(len(self.other.get('/api/runs?board=unranked').json['items']),1);self.assertEqual(len(self.other.get('/api/runs?board=ranked').json['items']),0);self.assertEqual(len(self.other.get('/api/runs').json['items']),1)
 def test_manual_review_requires_reason_for_reference_score(self):
  i,_=self.seed(verdict='review',score=None);h=self.login()
  self.assertEqual(self.client.post('/api/admin/runs/'+i,json={'decision':'approved','board':'ranked'},headers=h).status_code,400)
  self.assertEqual(self.client.post('/api/admin/runs/'+i,json={'decision':'approved','board':'ranked','note':'已人工回看完整轨迹，符合真人操作。'},headers=h).status_code,200)
 def test_rejected_cannot_gain_rank_from_reference_score(self):
  i,_=self.seed(verdict='rejected',score=None);h=self.login();self.assertEqual(self.client.post('/api/admin/runs/'+i,json={'decision':'approved','board':'ranked','note':'测试绕过拒绝结论不应成功'},headers=h).status_code,400)
 def test_policy_validation_and_conflict(self):
  h=self.login();p=copy.deepcopy(DEFAULTS);p['maxBotScore']=float('nan');self.assertEqual(self.client.post('/api/admin/settings',json={'policy':p,'revision':1},headers=h).status_code,400)
  p=copy.deepcopy(DEFAULTS);self.assertEqual(self.client.post('/api/admin/settings',json={'policy':p,'revision':0},headers=h).status_code,409)
 def test_rejudge_hides_and_snapshots_previous_report(self):
  i,_=self.seed(board='ranked',decision='approved');h=self.login();self.assertEqual(self.client.post('/api/admin/runs/'+i+'/rejudge',json={},headers=h).status_code,200)
  self.assertEqual(self.other.get('/api/runs/'+i).status_code,404)
  with db() as c:self.assertIn('previousReport',json.loads(c.execute("SELECT detail FROM audit WHERE action='rejudge'").fetchone()[0]))
 def test_name_html_stays_data(self):
  r=self.upload(name='%3Cimg%20src=x%3E');self.assertEqual(r.status_code,202);self.assertEqual(self.client.get('/api/submissions/'+r.json['id'],headers={'Authorization':'Bearer '+r.json['receipt']}).json['name'],'<img src=x>')
 def test_origin_rejected(self):self.assertEqual(self.client.post('/api/uploads/check',json={},headers={'Origin':'https://evil.example'}).status_code,403)
 def test_oversize_rejected_before_read(self):self.assertEqual(self.client.post('/api/uploads?name=x',data=b'x'*(16*1024*1024+1),content_type='application/octet-stream',headers=self.web_headers()).status_code,413)
 def test_queue_bounded(self):
  with patch('app.MAX_QUEUE',1):self.assertEqual(self.upload().status_code,202);self.assertEqual(self.upload(data=b'y'*400).status_code,429)
 def test_similarity_identical_paths_and_maps(self):
  i,_=self.seed();fp={'mapHash':'a','bitmap':'AA=='*0+'AA==','coarse':[0]*256,'points':[[x,x%8] for x in range(128)],'length':300,'turns':30}
  with db(True) as c:c.execute('UPDATE runs SET fingerprint=? WHERE id=?',(dumps(fp),i))
  r=compare(fp,'another',DEFAULTS['similarity']);self.assertTrue(all(x['status']=='fail' for x in r if x['id']!='seed_similarity'));self.assertEqual(next(x for x in r if x['id']=='path_similarity')['evidence'][0]['similarity'],100)
 def test_similarity_does_not_equate_short_straight_paths_to_bots(self):
  fp={'mapHash':'a','bitmap':'AA==','coarse':[0]*256,'points':[[0,0]]*128,'length':20,'turns':0};r=compare(fp,'another',DEFAULTS['similarity']);self.assertEqual(next(x for x in r if x['id']=='path_similarity')['status'],'insufficient')
 def test_invalid_completed_file_cannot_publish(self):
  i,_=self.seed();h=self.login()
  with db(True) as c:c.execute("UPDATE runs SET status='invalid' WHERE id=?",(i,))
  self.assertEqual(self.client.post('/api/admin/runs/'+i,json={'decision':'approved','board':'ranked'},headers=h).status_code,400)
 def test_direct_unkeyed_upload_is_rejected(self):
  self.assertEqual(self.client.post('/api/uploads?name=x',data=b'x'*400,content_type='application/octet-stream').status_code,403)
 def test_web_upload_nonce_is_one_use(self):
  h=self.web_headers();self.assertEqual(self.client.post('/api/uploads?name=x',data=b'x'*400,content_type='application/octet-stream',headers=h).status_code,202)
  self.assertEqual(self.client.post('/api/uploads?name=y',data=b'y'*400,content_type='application/octet-stream',headers=h).status_code,403)
 def test_scoring_weights_are_validated_and_saved(self):
  p=copy.deepcopy(DEFAULTS);p['scoring']['pace']=41;h=self.login()
  self.assertEqual(self.client.post('/api/admin/settings',json={'policy':p,'revision':1},headers=h).status_code,400)
  p['scoring']={'completion':10,'pace':45,'coins':30,'tactics':15}
  self.assertEqual(self.client.post('/api/admin/settings',json={'policy':p,'revision':1},headers=h).status_code,200)
  self.assertEqual(self.client.get('/api/admin/settings').json['policy']['scoring'],p['scoring'])
 def test_disabled_downloads_hide_manifest_and_block_direct_links(self):
  policy=copy.deepcopy(DEFAULTS);policy['downloadsEnabled']=False
  h=self.login();self.assertEqual(self.client.post('/api/admin/settings',json={'policy':policy,'revision':1},headers=h).status_code,200)
  self.assertEqual(self.other.get('/api/config').status_code,404)
  manifest=self.other.get('/api/downloads').json;self.assertEqual(manifest['items'],[]);self.assertIn('暂未开放',manifest['emptyMessage'])
  for url in ['/download=halls?platform=windows&arch=x86_64','/download=halls?platform=mac&arch=arm64','/download=halls?platform=linux&arch=x86_64']:
   r=self.other.get(url);self.assertEqual(r.status_code,403);self.assertEqual(r.json['code'],'downloads_disabled')
 def test_publication_confirmation_toggle_is_enforced(self):
  self.assertIn('publicationConsent',self.client.get('/upload').get_data(as_text=True))
  headers=self.web_headers();headers.pop('X-Publication-Consent')
  self.assertEqual(self.client.post('/api/uploads?name=test',data=b'x'*400,content_type='application/octet-stream',headers=headers).status_code,403)
  policy=copy.deepcopy(DEFAULTS);policy['publicationConfirmation']=False
  admin_headers=self.login()
  self.assertEqual(self.client.post('/api/admin/settings',json={'policy':policy,'revision':1},headers=admin_headers).status_code,200)
  self.assertNotIn('publicationConsent',self.other.get('/upload').get_data(as_text=True))
  headers=self.web_headers(self.other);headers.pop('X-Publication-Consent')
  r=self.other.post('/api/uploads?name=competition',data=b'x'*400,content_type='application/octet-stream',headers=headers)
  self.assertEqual(r.status_code,202)
  with db() as c:row=c.execute('SELECT board,decision,policy FROM runs WHERE id=?',(r.json['id'],)).fetchone()
  self.assertEqual((row['board'],row['decision']),('hidden','pending'))
  self.assertFalse(json.loads(row['policy'])['publicationConfirmation'])
 def test_upload_master_switch_and_admin_override(self):
  p=copy.deepcopy(DEFAULTS);p['uploadsEnabled']=False
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
  self.assertEqual(self.client.post('/api/upload-session',json={},headers={'Origin':'http://localhost'}).status_code,403)
  h=self.login();self.assertEqual(self.client.post('/api/admin/uploads?name=owner',data=b'x'*400,content_type='application/octet-stream',headers=h).status_code,202)
 def test_api_key_create_use_revoke_and_no_plaintext_in_list(self):
  h=self.login();r=self.client.post('/api/admin/keys',json={'label':'integration'},headers=h);self.assertEqual(r.status_code,201);key=r.json['key'];key_id=r.json['id']
  self.assertNotIn(key,self.client.get('/api/admin/keys').get_data(as_text=True))
  self.assertEqual(self.other.post('/api/submit/'+key+'?name=api',data=b'x'*400,content_type='application/octet-stream').status_code,403)
  p=copy.deepcopy(DEFAULTS);p['apiUploads']=True;p['webUploads']=False
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
  self.assertEqual(self.other.post('/api/submit/wrong?name=api',data=b'x'*400,content_type='application/octet-stream').status_code,401)
  self.assertEqual(self.other.post('/api/submit/'+key+'?name=api',data=b'x'*400,content_type='application/octet-stream').status_code,202)
  self.assertEqual(self.client.post('/api/admin/keys/'+key_id+'/revoke',json={'confirmed':True},headers=h).status_code,200)
  self.assertEqual(self.other.post('/api/submit/'+key+'?name=api',data=b'y'*400,content_type='application/octet-stream').status_code,401)
 def test_public_page_limit_cannot_be_overridden(self):
  for i in range(40):
   with db(True) as c:c.execute("INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,bytes,policy,policy_revision,decision,board,score,duration) VALUES(?,?,?,?,?,?,'done',0,'{}',1,'approved','ranked',90,100)",(str(i),'test'+str(i),str(i),str(i),i,i))
  a=self.other.get('/api/runs?limit=100000').json;b=self.other.get('/api/runs?page=2').json
  self.assertEqual(len(a['items']),25);self.assertEqual(len(b['items']),15);self.assertEqual(a['pages'],2)
  self.login();self.assertEqual(len(self.client.get('/api/admin/runs?limit=100000').json['items']),30)
if __name__=='__main__':unittest.main()
