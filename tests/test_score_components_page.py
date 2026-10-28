import json,unittest
import test_platform as fixtures
from store import db,dumps
class ScoreComponentsPageTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 seed=fixtures.PlatformTests.seed
 upload=fixtures.PlatformTests.upload
 web_headers=fixtures.PlatformTests.web_headers
 def test_run_page_uses_recorded_maxima_and_highlights_earned_points(self):
  key,_=self.seed(board='ranked',decision='approved')
  with db(True)as c:
   report=json.loads(c.execute('SELECT report FROM runs WHERE id=?',(key,)).fetchone()[0])
   report['performance'].update(components={'completion':10,'pace':21.5,'coins':10,'tactics':0,'integrity':-2},policy={'weights':{'completion':10,'pace':40,'coins':40,'tactics':10},'private':'not-public'})
   report['metrics']={'raceReference':{'available':True,'seconds':190.890245,'path':[[3,3],[5,3]],'exactOptimality':False}}
   c.execute('UPDATE runs SET report=? WHERE id=?',(dumps(report),key))
  html=self.other.get('/run/'+key).get_data(as_text=True)
  self.assertIn('>10</strong><span class="score-maximum">/ 40</span>',html)
  self.assertIn('>21.5</strong><span class="score-maximum">/ 40</span>',html)
  self.assertIn('>0</strong><span class="score-maximum">/ 10</span>',html)
  self.assertNotIn('not-public',html)
  self.assertEqual(html.count('class="score-earned"'),4)
  self.assertIn('理论最短时间',html);self.assertIn('<span>约</span> 03:10.89',html)
  self.assertLess(html.index('理论最短时间'),html.index('>金币</span>'))
if __name__=='__main__':unittest.main()
