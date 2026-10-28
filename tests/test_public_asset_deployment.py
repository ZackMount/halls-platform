import threading,unittest
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from tools.check_public_assets import check_public_assets

VERSION='1234567890abcdef';REPLAY='abcdef1234567890'
ENTRY=f'/static/{VERSION}/assets/site-entry.js';PART=f'/static/{VERSION}/assets/part.js';DYNAMIC=f'/static/{VERSION}/assets/score.js';STYLE=f'/static/{VERSION}/assets/site.css';FONT=f'/static/{VERSION}/assets/ui.woff2';REPLAY_ENTRY=f'/static/{REPLAY}/replay-assets/replay-entry.js'

class PublicAssetDeploymentTests(unittest.TestCase):
 def setUp(self):
  shell=f'<html><script type="module" src="{ENTRY}"></script><link rel="stylesheet" href="{STYLE}"><a href="/admin?pwd=000000">admin</a><script src="https://external.invalid/a.js"></script></html>'
  self.resources={path:(200,'text/html',shell) for path in ('/','/leaderboard')}
  self.resources.update({'/replay':(200,'text/html',f'<script type="module" src="{REPLAY_ENTRY}"></script>'),ENTRY:(200,'text/javascript',f'import{{ready}}from"./part.js";import("{DYNAMIC}");'),PART:(200,'text/javascript','export const ready=true;'),DYNAMIC:(200,'application/javascript','export const score=1;'),REPLAY_ENTRY:(200,'text/javascript','export const replay=true;'),STYLE:(200,'text/css',f'@font-face{{src:url("{FONT}")}}'),FONT:(200,'font/woff2','font')})
  self.requests=[];owner=self
  class Handler(BaseHTTPRequestHandler):
   def do_GET(self):self.reply()
   def do_HEAD(self):self.reply()
   def reply(self):
    owner.requests.append((self.command,self.path));status,mime,body=owner.resources.get(self.path,(404,'text/html','missing'));self.send_response(status);self.send_header('Content-Type',mime);self.end_headers()
    if self.command!='HEAD':self.wfile.write(body.encode())
   def log_message(self,*args):pass
  self.server=ThreadingHTTPServer(('127.0.0.1',0),Handler);self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start();self.base=f'http://127.0.0.1:{self.server.server_port}'
 def tearDown(self):self.server.shutdown();self.server.server_close();self.thread.join()
 def test_follows_public_module_dependencies_without_admin_or_external_requests(self):
  result=check_public_assets(self.base,expected_version=VERSION)
  self.assertTrue(result['ok'],result['issues']);paths={path for _,path in self.requests}
  self.assertTrue({ENTRY,PART,DYNAMIC,REPLAY_ENTRY,STYLE}<=paths);self.assertNotIn(FONT,paths)
  self.assertTrue(all(path in self.resources for path in paths));self.assertFalse(any('/admin' in path for path in paths))
 def test_healthy_html_with_missing_materialized_entry_fails(self):
  del self.resources[ENTRY];result=check_public_assets(self.base)
  self.assertFalse(result['ok']);self.assertTrue(any(i.get('status')==404 and i['url'].endswith(ENTRY) for i in result['issues']))
 def test_html_fallback_for_module_is_not_mistaken_for_success(self):
  self.resources[ENTRY]=(200,'text/html','<html>error</html>');result=check_public_assets(self.base)
  self.assertFalse(result['ok']);self.assertTrue(any(i['error']=='content_type' for i in result['issues']))
 def test_missing_nested_or_dynamic_module_fails(self):
  for target in (PART,DYNAMIC):
   value=self.resources.pop(target);result=check_public_assets(self.base);self.resources[target]=value
   self.assertFalse(result['ok']);self.assertTrue(any(i['url'].endswith(target) for i in result['issues']))
 def test_expected_version_rejects_healthy_but_stale_html(self):
  result=check_public_assets(self.base,expected_version='0000000000000000')
  self.assertFalse(result['ok']);self.assertEqual(sum(i['error']=='entry_version_mismatch' for i in result['issues']),2)
 def test_optional_media_checks_use_head(self):
  result=check_public_assets(self.base,include_media=True)
  self.assertTrue(result['ok'],result['issues']);self.assertIn(('HEAD',FONT),self.requests)
 def test_credentials_private_paths_and_query_strings_are_rejected(self):
  for url in (self.base+'/admin',self.base+'/?pwd=000000','http://user:secret@127.0.0.1'):
   with self.assertRaises(ValueError):check_public_assets(url)
 def test_resource_budget_fails_closed(self):
  result=check_public_assets(self.base,max_resources=3)
  self.assertFalse(result['ok']);self.assertTrue(any(i['error']=='resource_budget' for i in result['issues']))

if __name__=='__main__':unittest.main()
