import copy,json,re,unittest
from unittest.mock import patch
import test_platform as fixtures
from store import db,DEFAULTS,dumps
class PageFragmentsTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 web_headers=fixtures.PlatformTests.web_headers
 upload=fixtures.PlatformTests.upload
 seed=fixtures.PlatformTests.seed
 def policy(self,**updates):
  p=copy.deepcopy(DEFAULTS);p.update(updates)
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
 def test_no_public_configuration_and_first_response_contains_server_selected_forms(self):
  self.assertEqual(self.client.get('/api/config').status_code,404)
  for page,form in (('upload','upload-form'),('preview','preview-form')):
   html=self.client.get('/'+page).get_data(as_text=True);self.assertIn('data-server-page="/'+page+'"',html);self.assertIn('id="'+form+'"',html);self.assertNotIn('/api/config',html)
   fragment=self.client.get('/api/pages/'+page);self.assertEqual(fragment.mimetype,'text/html');self.assertIn('id="'+form+'"',fragment.get_data(as_text=True));self.assertEqual(fragment.headers['Cache-Control'],'no-store')
 def test_closed_routes_return_no_forms_and_no_judge_policy(self):
  self.policy(uploadsEnabled=False,previewsEnabled=False)
  for page,form in (('upload','upload-form'),('preview','preview-form')):
   html=self.client.get('/api/pages/'+page).get_data(as_text=True);self.assertNotIn('id="'+form+'"',html)
   for private in ('seedScoreCap','deductions','maxBotScore','judge','scoring'):self.assertNotIn(private,html)
 def test_closed_downloads_are_rendered_in_first_response_without_reading_manifest(self):
  self.policy(downloadsEnabled=False)
  with patch('app.download_items') as items:
   response=self.client.get('/download');html=response.get_data(as_text=True)
   self.assertIn('data-server-page="/download"',html);self.assertIn('游戏下载暂未开放',html);self.assertNotIn('class="download-item"',html)
   fragment=self.client.get('/api/pages/download');self.assertEqual(fragment.mimetype,'text/html');self.assertIn('游戏下载暂未开放',fragment.get_data(as_text=True));self.assertEqual(fragment.headers['Cache-Control'],'no-store')
   items.assert_not_called()
 def test_open_downloads_render_architectures_and_escape_manifest_labels(self):
  self.policy(downloadsEnabled=True)
  builds=[{'product':'halls','platform':'macos','arch':arch,'archLabel':label,'bytes':2048,'url':'/download=halls?platform=macos&arch='+arch} for arch,label in [('aarch64','<script>bad()</script>'),('universal','Universal')]]
  with patch('app.download_items',return_value=builds):
   for path in ('/download','/api/pages/download'):
    html=self.client.get(path).get_data(as_text=True)
    self.assertIn('Windows 10 / 11',html);self.assertIn('macOS 13',html);self.assertIn('glibc 2.34+',html);self.assertIn('2 KiB',html)
    self.assertLess(html.index('>Universal<'),html.index('&lt;script&gt;'));self.assertNotIn('<script>bad()',html)
    self.assertIn('/download=halls?platform=macos&amp;arch=universal',html)
 def test_open_downloads_with_no_files_render_empty_message(self):
  self.policy(downloadsEnabled=True)
  with patch('app.download_items',return_value=[]):
   html=self.client.get('/download').get_data(as_text=True);self.assertIn('暂无可用下载',html);self.assertNotIn('游戏下载暂未开放',html)
 def test_admin_form_requires_authentication_and_bypasses_public_closure(self):
  self.policy(uploadsEnabled=False);self.assertEqual(self.client.get('/api/admin/upload-page').status_code,404);self.login();html=self.client.get('/api/admin/upload-page').get_data(as_text=True);self.assertIn('id="upload-form"',html);self.assertNotIn('publicationConsent',html)
 def test_published_boards_are_provided_with_ranking_results(self):
  self.assertEqual(self.client.get('/api/runs').json['boards'],['all','ranked']);self.policy(unrankedEnabled=True);self.assertEqual(self.client.get('/api/runs').json['boards'],['all','ranked','unranked'])
 def test_first_run_response_shows_suspicion_and_actual_deduction(self):
  key,_=self.seed(score=32.52,board='ranked',decision='approved')
  with db(True) as c:
   report=json.loads(c.execute('SELECT report FROM runs WHERE id=?',(key,)).fetchone()[0])
   report['performance'].update(score=32.52,referenceScore=32.52,components={'integrity':-38.37},deductions={'automation':38.37},automation={'available':True,'suspicion':95.01,'deduction':38.37})
   c.execute('UPDATE runs SET report=? WHERE id=?',(dumps(report),key))
  response=self.client.get('/run/'+key);self.assertEqual(response.status_code,200)
  html=response.get_data(as_text=True)
  for text in ('自动化可疑度','95.01%','-38.37','32.52'):self.assertIn(text,html)
  self.assertNotIn('95.0%',html)
  self.assertNotIn('行为评估，不代表开挂概率。',html)

 def test_origin_owned_empty_speculation_rules_are_cacheable_without_navigation_prefetch(self):
  response=self.client.get('/upload');url=response.headers['Speculation-Rules'].strip('"');rules=self.client.get(url)
  self.assertEqual(rules.status_code,200);self.assertEqual(rules.json,{});self.assertIn('immutable',rules.headers['Cache-Control'])
 def test_cached_replay_shell_is_data_free_and_independent_of_record_identifiers(self):
  worker=self.client.get('/sw.js').get_data(as_text=True);url=re.search(r"REPLAY_SHELL='([^']+)'",worker).group(1)
  first=self.client.get(url+'?run='+'a'*24);second=self.client.get(url+'?preview='+'b'*24)
  self.assertEqual(first.status_code,200);self.assertEqual(first.data,second.data);self.assertIn('immutable',first.headers['Cache-Control'])
  html=first.get_data(as_text=True);self.assertIn('id="scene"',html);self.assertIn('Content-Security-Policy',html);self.assertNotIn('a'*24,html);self.assertNotIn('b'*24,html);self.assertNotIn('__REPLAY_SHELL__',worker)
