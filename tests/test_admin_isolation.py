import os,unittest
from unittest.mock import patch
import test_platform as fixtures
from app import app

class AdminIsolationTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp

 def test_public_service_never_exposes_admin_routes(self):
  for path in ('/admin','/admin?pwd=123456','/admin/api-guide','/api/admin/session','/api/admin/settings'):
   response=self.client.get(path)
   self.assertEqual(response.status_code,404,path)
   self.assertEqual(response.data,b'')

 def test_local_service_needs_no_login_but_checks_csrf_and_origin(self):
  headers=fixtures.PlatformTests.login(self)
  self.assertEqual(self.client.get('/admin').status_code,200)
  self.assertEqual(self.client.get('/api/admin/session').json['csrf'],headers['X-CSRF-Token'])
  self.assertEqual(self.client.post('/api/admin/settings',json={}).status_code,403)
  self.assertEqual(self.client.post('/api/admin/settings',json={},headers={**headers,'Origin':'https://evil.example'}).status_code,403)

 def test_local_service_rejects_remote_peers_by_default(self):
  fixtures.PlatformTests.login(self)
  self.client.environ_base['REMOTE_ADDR']='192.0.2.5'
  self.assertEqual(self.client.get('/admin').status_code,404)
  with patch.dict(os.environ,{'HALLS_ADMIN_NETWORKS':'192.0.2.0/24'}):
   self.assertEqual(self.client.get('/admin').status_code,200)
