import json,re,unittest
from unittest.mock import patch
import test_platform as fixtures
from app import app,assets_bundle
from store import db,dumps,DEFAULTS
class FirstScreenTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 seed=fixtures.PlatformTests.seed
 upload=fixtures.PlatformTests.upload
 web_headers=fixtures.PlatformTests.web_headers
 login=fixtures.PlatformTests.login
 def test_home_and_guide_render_before_javascript_with_inline_css(self):
  for path,content in [('/','第一人称后室终端迷宫'),('/about','游戏概况')]:
   response=self.client.get(path);html=response.get_data(as_text=True)
   self.assertIn('data-server-page="'+path+'"',html);self.assertIn(content,html)
   self.assertIn('<style id="site-styles">',html);self.assertIn('<style id="ui-fonts">',html)
   self.assertNotIn('__SITE_CSS__',html);self.assertNotIn('__UI_FONTS__',html)
   self.assertNotIn('rel="stylesheet"',html);self.assertNotIn('fonts/noto.css',html)
   self.assertIn('as="font"',html);self.assertIn('font-display:swap',html)
  home=self.client.get('/');self.assertEqual(home.headers['Cache-Control'],'no-store');self.assertEqual(home.headers['Cloudflare-CDN-Cache-Control'],'public, max-age=60')
  self.assertNotIn('Cloudflare-CDN-Cache-Control',self.client.get('/about').headers)
  guide=self.client.get('/about').get_data(as_text=True)
  self.assertLess(guide.index('id="overview"'),guide.index('id="controls"'));self.assertLess(guide.index('id="controls"'),guide.index('id="exploration"'))
 def test_current_forms_are_present_without_loading_a_script_or_public_configuration(self):
  for page,name in [('upload','upload-form'),('preview','preview-form')]:
   html=self.client.get('/'+page).get_data(as_text=True);self.assertIn('id="'+name+'"',html)
   self.assertNotIn('/api/config',html);self.assertNotIn('platformPolicy',html)
   self.assertNotIn('Cloudflare-CDN-Cache-Control',self.client.get('/'+page).headers)
 def test_ranking_seeds_public_data_escapes_names_and_keeps_privacy(self):
  key,_=self.seed(board='ranked',decision='approved')
  with db(True) as c:c.execute('UPDATE runs SET name=? WHERE id=?',('</script><img src=x onerror=x>',key))
  html=self.client.get('/leaderboard').get_data(as_text=True)
  self.assertIn('id="initial-ranking"',html);self.assertIn('id="records"',html)
  self.assertIn('&lt;/script&gt;',html);self.assertNotIn('</script><img',html)
  value=json.loads(re.search(r'id="initial-ranking">(.*?)</script>',html,re.S)[1]);self.assertEqual(value,self.client.get('/api/runs').json)
  self.assertNotIn('seed',value['items'][0]);self.assertNotIn('cap_hash',html)
  self.assertEqual(self.client.get('/leaderboard').headers['Cache-Control'],'no-store')
 def test_public_run_report_is_text_and_viewer_slot_is_ready_in_initial_html(self):
  key,_=self.seed(board='ranked',decision='approved')
  html=self.client.get('/run/'+key).get_data(as_text=True)
  self.assertIn('data-replay-base="/replay-public/',html);self.assertIn('完整评判报告',html)
  self.assertNotIn('class="score-neutral"',html);self.assertNotIn('platformPolicy',html)
  self.assertIn('data-utc=',html);self.assertNotIn('secret',html)
  self.assertNotIn('Cloudflare-CDN-Cache-Control',self.client.get('/run/'+key).headers)
 def test_hidden_runs_are_not_exposed_by_server_rendering(self):
  key,_=self.seed();self.assertEqual(self.client.get('/run/'+key).status_code,404)
 def test_data_free_static_shell_and_frame_have_resolved_styles_and_parked_frame(self):
  html=assets_bundle.content('shell.html')[0].decode();self.assertNotIn('__UI_FONTS__',html);self.assertNotIn('__SITE_CSS__',html)
  frame=assets_bundle.content('replay-assets/frame.html')[0].decode();self.assertIn('replay-page parked',frame)
  self.assertIn('replay-entry.js',frame);self.assertNotIn('fonts/noto.css',frame)
 def test_home_font_is_small_and_minified_engine_keeps_source_license(self):
  from pathlib import Path
  root=Path(__file__).resolve().parents[1]/'web'
  self.assertLess((root/'fonts/ui.woff2').stat().st_size,90000)
  self.assertLess((root/'replay/replay-entry.js').stat().st_size,650000)
  self.assertIn('MIT',(root/'replay/replay-entry.js').read_text())
