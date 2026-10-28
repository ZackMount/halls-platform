import copy,hashlib,json,time,unittest
from html.parser import HTMLParser
import test_platform as fixtures
from store import DEFAULTS,db,dumps,digest
from public_navigation import public_upload_links

class Links(HTMLParser):
 def __init__(self,html):super().__init__();self.hrefs=[];self.feed(html)
 def handle_starttag(self,tag,attrs):
  if tag=='a':self.hrefs.append(dict(attrs).get('href'))

class CompetitionWebGateTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 login=fixtures.PlatformTests.login
 web_headers=fixtures.PlatformTests.web_headers
 upload=fixtures.PlatformTests.upload
 seed=fixtures.PlatformTests.seed
 def policy(self,**changes):
  p=copy.deepcopy(DEFAULTS);p.update(changes)
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(p),))
 def test_closed_web_upload_links_are_absent_before_javascript_on_every_shell(self):
  run,_=self.seed(board='ranked',decision='approved')
  self.policy(webUploads=False,apiUploads=True,downloadsEnabled=False)
  for path in ('/','/about','/download','/preview','/leaderboard','/upload','/run/'+run):
   with self.subTest(path=path):
    response=self.client.get(path);self.assertEqual(response.status_code,200);html=response.get_data(as_text=True)
    self.assertIn('data-web-uploads="0"',html);self.assertNotIn('/upload',Links(html).hrefs)
    self.assertNotIn('data-nav="upload"',html);self.assertNotIn('/api/config',html)
  html=self.client.get('/upload').get_data(as_text=True);self.assertNotIn('id="upload-form"',html);self.assertIn('暂未开放提交',html)
  self.assertIn('游戏下载暂未开放',self.client.get('/download').get_data(as_text=True))
 def test_open_web_uploads_keep_the_public_navigation_and_home_card(self):
  html=self.client.get('/').get_data(as_text=True)
  self.assertIn('data-web-uploads="1"',html);self.assertGreaterEqual(Links(html).hrefs.count('/upload'),2)
  self.policy(uploadsEnabled=False,webUploads=True)
  self.assertNotIn('/upload',Links(self.client.get('/').get_data(as_text=True)).hrefs)
 def test_web_requests_are_denied_but_administrator_uploads_remain_available(self):
  self.policy(webUploads=False,apiUploads=True)
  self.assertEqual(self.other.post('/api/upload-session',json={},headers={'Origin':'http://localhost'}).status_code,403)
  rejected=self.other.post('/api/uploads?name=test',data=b'x'*400,content_type='application/octet-stream')
  self.assertEqual(rejected.status_code,403);self.assertEqual(rejected.json['code'],'web_uploads_disabled')
  headers=self.login();self.assertIn('id="upload-form"',self.client.get('/api/admin/upload-page').get_data(as_text=True))
  self.assertEqual(self.client.post('/api/admin/uploads?name=organizer',data=b'x'*400,content_type='application/octet-stream',headers=headers).status_code,202)
 def test_authenticated_koh_submission_and_score_survive_web_closure(self):
  self.policy(webUploads=False,apiUploads=True,downloadsEnabled=False)
  key='hls_test_web_gate';base='/api/koh/'+key;payload=b'web closure koh test'*30
  with db(True) as c:c.execute('INSERT INTO api_keys(id,label,hash,created,scope) VALUES(?,?,?,?,?)',('web-gate-koh','web gate',digest(key),time.time(),'koh'))
  context={'problem_id':123,'submission_id':456};instance='a'*32
  lookup=self.other.post(base+'/lookup',json={'context':context,'instance':instance,'sha256':hashlib.sha256(payload).hexdigest(),'bytes':len(payload)})
  self.assertEqual(lookup.status_code,200);self.assertTrue(lookup.json['uploadRequired'])
  uploaded=self.other.post(base+'/proofs/123/456?name=KOH-test',data=payload,content_type='application/octet-stream',headers={'X-KOH-Instance':instance})
  self.assertEqual(uploaded.status_code,202);run=uploaded.json['id']
  from scoring import VERSION
  with db(True) as c:c.execute("UPDATE runs SET status='done',score=76.89,report=? WHERE id=?",(dumps({'rules':[],'performance':{'version':VERSION,'score':76.89}}),run))
  result=self.other.get(base+'/results/123/456');self.assertEqual(result.status_code,200)
  self.assertEqual(result.json['result']['score'],76.89);self.assertEqual(result.json['result']['max_score'],100)
  self.assertIn('/run/'+run,result.json['result']['feedback'])
 def test_filter_only_removes_actual_public_upload_anchors(self):
  source='<a class="x" href="/upload"><svg><path/></svg>upload</a><a HREF = \'/upload?x=1#test\'>next</a><a href="/uploading">keep</a><a data-href="/upload" href="/admin">admin</a><a href="/api/admin/uploads">api</a>'
  filtered=public_upload_links(source,False)
  self.assertNotIn('upload</a>',filtered);self.assertNotIn('>next<',filtered)
  self.assertIn('/uploading',Links(filtered).hrefs);self.assertIn('/admin',Links(filtered).hrefs);self.assertIn('/api/admin/uploads',Links(filtered).hrefs)
  self.assertEqual(public_upload_links(source,True),source)

if __name__=='__main__':unittest.main()
