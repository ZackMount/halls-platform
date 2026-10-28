import copy,time,unittest
import test_platform as fixtures
from store import db,dumps,DEFAULTS

class KeyRecoveryTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 def key(self,scope='koh'):
  h=self.login();r=self.client.post('/api/admin/keys',json={'label':'KOH recovery','scope':scope},headers=h);self.assertEqual(r.status_code,201);return h,r.json
 def change(self,key,action,h,body=None):return self.client.post('/api/admin/keys/'+key['id']+'/'+action,json={'confirmed':True} if body is None else body,headers=h)
 def test_confirmation_authentication_csrf_and_unknown_id(self):
  h,k=self.key()
  for action in ('revoke','restore'):
   url='/api/admin/keys/'+k['id']+'/'+action
   self.assertEqual(self.other.post(url,json={'confirmed':True}).status_code,404)
   self.assertEqual(self.client.post(url,json={'confirmed':True}).status_code,403)
   for body in ({},{'confirmed':False},{'confirmed':1},{'confirmed':'true'}):self.assertEqual(self.change(k,action,h,body).status_code,400)
   self.assertEqual(self.change({'id':'missing'},action,h).status_code,404)
  with db() as c:self.assertEqual(c.execute('SELECT active FROM api_keys WHERE id=?',(k['id'],)).fetchone()[0],1)
 def test_restore_keeps_original_credential_and_competition_binding(self):
  h,k=self.key()
  with db(True) as c:
   p=copy.deepcopy(DEFAULTS);p['apiUploads']=True;c.execute('UPDATE settings SET json=?',(dumps(p),))
  base='/api/koh/'+k['key'];body={'context':{'problem_id':42,'submission_id':7},'sha256':'a'*64,'bytes':400,'instance':'b'*32}
  self.assertEqual(self.other.post(base+'/lookup',json=body).status_code,200)
  with db() as c:original=dict(c.execute('SELECT * FROM api_keys WHERE id=?',(k['id'],)).fetchone())
  self.assertEqual(self.change(k,'revoke',h).status_code,200)
  self.assertEqual(self.other.post(base+'/lookup',json=body).status_code,401)
  r=self.change(k,'restore',h);self.assertTrue(r.json['active']);self.assertTrue(r.json['changed'])
  with db() as c:self.assertEqual(dict(c.execute('SELECT * FROM api_keys WHERE id=?',(k['id'],)).fetchone()),original)
  self.assertEqual(self.other.post(base+'/lookup',json=body).status_code,200)
  with db() as c:
   restored=dict(c.execute('SELECT * FROM api_keys WHERE id=?',(k['id'],)).fetchone())
   self.assertEqual({k:v for k,v in restored.items() if k not in ('uses','last_used')},{k:v for k,v in original.items() if k not in ('uses','last_used')})
   self.assertEqual(c.execute('SELECT COUNT(*) FROM koh_submissions WHERE key_id=?',(k['id'],)).fetchone()[0],1)
   audit=c.execute("SELECT actor,action FROM audit WHERE action IN ('api_key_revoked','api_key_restored') ORDER BY id").fetchall();self.assertEqual([tuple(x) for x in audit],[('admin','api_key_revoked'),('admin','api_key_restored')])
  self.assertNotIn(k['key'],self.client.get('/api/admin/keys').get_data(as_text=True))
 def test_repeated_state_changes_are_idempotent_without_duplicate_audits(self):
  h,k=self.key();self.assertFalse(self.change(k,'restore',h).json['changed'])
  self.assertTrue(self.change(k,'revoke',h).json['changed']);self.assertFalse(self.change(k,'revoke',h).json['changed'])
  self.assertTrue(self.change(k,'restore',h).json['changed']);self.assertFalse(self.change(k,'restore',h).json['changed'])
  with db() as c:self.assertEqual(c.execute("SELECT COUNT(*) FROM audit WHERE action IN ('api_key_revoked','api_key_restored')").fetchone()[0],2)
 def test_restore_respects_active_key_limit(self):
  h,k=self.key();self.change(k,'revoke',h)
  with db(True) as c:
   for i in range(20):c.execute("INSERT INTO api_keys(id,label,hash,created) VALUES(?,?,?,?)",('limit-'+str(i),'limit','hash-'+str(i),time.time()))
  self.assertEqual(self.change(k,'restore',h).status_code,409)
  with db() as c:self.assertEqual(c.execute('SELECT active FROM api_keys WHERE id=?',(k['id'],)).fetchone()[0],0)
 def test_upload_scope_key_is_also_recoverable(self):
  h,k=self.key('upload');self.change(k,'revoke',h);self.change(k,'restore',h)
  with db() as c:r=c.execute('SELECT scope,active FROM api_keys WHERE id=?',(k['id'],)).fetchone()
  self.assertEqual(tuple(r),('upload',1))
