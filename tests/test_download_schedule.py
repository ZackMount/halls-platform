import copy,unittest
from unittest.mock import patch
import test_platform as fixtures
from downloads import state
from store import db,dumps,DEFAULTS

class DownloadScheduleTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 def test_server_blocks_all_download_paths_until_the_exact_opening_time(self):
  at=1792800000;policy=copy.deepcopy(DEFAULTS);policy.update(downloadsEnabled=True,downloadsOpenAt=at)
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps(policy),))
  with patch('downloads.time.time',return_value=at-1),patch('app.download_items') as items:
   page=self.client.get('/download').get_data(as_text=True);self.assertIn('距离开放下载还有 0 天 0 小时 0 分 1 秒',page)
   self.assertIn('data-opens-at="1792800000"',page);self.assertFalse(self.client.get('/api/downloads').json['items'])
   self.assertEqual(self.client.get('/download=halls?platform=windows&arch=x86_64').status_code,403);items.assert_not_called()
  build={'product':'halls','platform':'windows','arch':'x86_64','archLabel':'x64','file':'halls.zip','bytes':2048,'url':'/download=halls'}
  with patch('downloads.time.time',return_value=at),patch('app.download_items',return_value=[build]),patch('app.send_from_directory',return_value='build'):
   self.assertEqual(self.client.get('/api/downloads').json['items'],[build]);self.assertEqual(self.client.get('/download=halls').status_code,200)
   page=self.client.get('/download').get_data(as_text=True);self.assertNotIn('data-download-countdown',page);self.assertIn('class="download-item"',page)
 def test_manual_disable_overrides_a_past_schedule(self):
  self.assertFalse(state({'downloadsEnabled':False,'downloadsOpenAt':10},now=20)['enabled'])
  self.assertTrue(state({'downloadsEnabled':True,'downloadsOpenAt':0},now=20)['enabled'])
