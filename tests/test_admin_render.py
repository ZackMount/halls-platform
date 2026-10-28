import json,re,unittest
import test_platform as fixture
from app import app
from store import db,audit
class AdminRenderTests(unittest.TestCase):
 setUp=fixture.PlatformTests.setUp
 login=fixture.PlatformTests.login
 seed=fixture.PlatformTests.seed
 upload=fixture.PlatformTests.upload
 web_headers=fixture.PlatformTests.web_headers
 def test_admin_entry_without_a_session_is_indistinguishable_from_missing_content(self):
  response=self.client.get('/admin');self.assertEqual(response.status_code,404);self.assertNotIn('id="login"',response.get_data(as_text=True));self.assertEqual(response.headers['Cache-Control'],'no-store')
 def test_private_first_page_is_embedded_only_for_authenticated_admin(self):
  key,_=self.seed()
  with db(True) as c:c.execute('UPDATE runs SET name=? WHERE id=?',('</script><img src=x>',key))
  self.login();response=self.client.get('/admin');html=response.get_data(as_text=True)
  self.assertIn('管理控制台',html);self.assertIn('data-admin-panel="runs"',html)
  data=json.loads(re.search(r'id="initial-admin">(.*?)</script>',html,re.S)[1])
  self.assertEqual(data['runs'],self.client.get('/api/admin/runs').json)
  self.assertEqual(data['csrf'],self.client.get('/api/admin/session').json['csrf'])
  self.assertNotIn('</script><img',html);self.assertNotIn('cap_hash',html);self.assertNotIn('secret',html)
  self.assertNotIn('initial-admin',self.other.get('/admin').get_data(as_text=True))
  self.assertEqual(response.headers['Cache-Control'],'no-store')
 def test_docs_spec_and_archive_are_private_and_consistent(self):
  for path in ('/admin/api-guide','/api/admin/openapi.json','/api/admin/guide'):self.assertEqual(self.other.get(path).status_code,404)
  self.login();response=self.client.get('/admin/api-guide');html=response.get_data(as_text=True)
  self.assertEqual(response.status_code,200);self.assertIn('OpenAPI 3.1',html)
  self.assertNotIn('__UI_FONTS__',html);self.assertNotIn('__GUIDE_CSS__',html);self.assertNotIn('/api/config',html)
  self.assertNotIn('fonts/noto.css',html);self.assertIn('guide-layout',html)
  for path in ('/admin/api-guide','/api/admin/openapi.json','/api/admin/guide'):
   response=self.client.get(path);self.assertEqual(response.status_code,200);self.assertEqual(response.headers['Cache-Control'],'no-store');self.assertNotIn('Cloudflare-CDN-Cache-Control',response.headers);response.close()
  response=self.client.get('/api/admin/openapi.json');spec=response.json;response.close();self.assertEqual(spec['openapi'],'3.1.0')
  endpoints={re.sub(r'<(?:[^:<>]+:)?([^<>]+)>',r'{\1}',str(rule)).replace('{api_key}','{key}').replace('{run_id}','{id}').replace('{problem}','{problem_id}').replace('{submission}','{submission_id}') for rule in app.url_map.iter_rules()}
  endpoints.add('/download=halls')
  self.assertTrue(set(spec['paths'])<=endpoints,set(spec['paths'])-endpoints)
  self.assertNotIn('/api/config',spec['paths'])
 def test_audit_summary_does_not_load_large_private_evidence_until_expanded(self):
  self.login()
  with db(True) as c:audit(c,'admin','large_test',detail={'private':'x'*100000})
  summary=self.client.get('/api/admin/audit').json;row=summary['items'][0]
  self.assertNotIn('detail',row);self.assertLess(len(json.dumps(summary)),5000)
  path='/api/admin/audit/'+str(row['id']);self.assertEqual(self.other.get(path).status_code,404)
  self.assertEqual(len(json.loads(self.client.get(path).json['detail'])['private']),100000)
