import json,re,unittest
import test_platform as fixtures
from store import db,dumps,DEFAULTS

class CombinedLeaderboardTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 def enable_unranked(self,enabled=True):
  with db(True) as c:c.execute('UPDATE settings SET json=?',(dumps({**DEFAULTS,'unrankedEnabled':enabled}),))
 def record(self,n,*,board='ranked',decision='approved',status='done',score=70,reference=70,duration=100,name=None):
  key=f'{n:024x}';report={'proof':{'seed':'private-seed'},'performance':{'referenceScore':reference}}
  with db(True) as c:
   c.execute('INSERT INTO runs(id,name,sha,cap_hash,created,updated,status,decision,board,report,score,duration,grade,verdict,bytes,policy,policy_revision) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,1)',(key,name or f'player-{n}',key,'private-cap',n,n,status,decision,board,dumps(report),score,duration,'A','accepted','{}'))
  return key
 def test_default_is_exact_public_union_with_combined_score_and_statistics(self):
  self.enable_unranked()
  ranked=self.record(1,score=71,reference=99,duration=80)
  unranked=self.record(2,board='unranked',decision='rejected',score=0,reference=82.75,duration=90)
  for n,changes in enumerate(({'board':'hidden'},{'decision':'pending'},{'decision':'rejected'},{'score':None},{'status':'processing'},{'board':'unranked','status':'error'}),3):self.record(n,**({'score':999,'reference':999}|changes))
  result=self.other.get('/api/runs').json
  self.assertEqual(result['board'],'all');self.assertEqual(result['boards'],['all','ranked','unranked'])
  self.assertEqual([r['id'] for r in result['items']],[unranked,ranked])
  self.assertEqual([r['displayScore'] for r in result['items']],[82.75,71])
  self.assertEqual([r['rank'] for r in result['items']],[None,1])
  self.assertEqual(result['stats'],{'n':2,'fastest':80,'best':82.75})
  self.assertEqual(result['boardCounts'],{'all':2,'ranked':1,'unranked':1})
  self.assertNotIn('private-seed',json.dumps(result));self.assertNotIn('private-cap',json.dumps(result))
 def test_board_filter_and_search_scope_statistics_together(self):
  self.enable_unranked();self.record(1,name='Alpha',score=72,duration=100)
  self.record(2,name='Alpha Two',board='unranked',reference=89,duration=85)
  self.record(3,name='Beta',score=98,duration=30)
  result=self.other.get('/api/runs?q=alpha').json
  self.assertEqual(result['total'],2);self.assertEqual(result['stats'],{'n':2,'fastest':85,'best':89})
  result=self.other.get('/api/runs?board=ranked&q=alpha').json
  self.assertEqual(result['total'],1);self.assertEqual(result['stats'],{'n':1,'fastest':100,'best':72})
  result=self.other.get('/api/runs?board=unranked').json
  self.assertEqual(result['stats'],{'n':1,'fastest':85,'best':89})
  self.assertEqual(self.other.get('/api/runs',query_string={'q':"' OR 1=1 --"}).json['total'],0)
 def test_database_combines_boards_before_sort_and_pagination(self):
  self.enable_unranked()
  for n in range(1,41):self.record(n,board='ranked' if n%2 else 'unranked',score=n,reference=n,duration=100)
  first=self.other.get('/api/runs?limit=100000').json;second=self.other.get('/api/runs?page=2').json
  self.assertEqual([r['displayScore'] for r in first['items']],list(range(40,15,-1)))
  self.assertEqual([r['displayScore'] for r in second['items']],list(range(15,0,-1)))
  combined=first['items']+second['items']
  self.assertEqual([r['rank'] for r in combined if r['board']=='ranked'],list(range(1,21)))
  self.assertTrue(all(r['rank'] is None for r in combined if r['board']=='unranked'))
  self.assertEqual((first['total'],first['pages']), (40,2))
  self.assertEqual(self.other.get('/api/runs?sort=speed').json['items'][0]['displayScore'],40)
  self.assertEqual(self.other.get('/api/runs?sort=recent').json['items'][0]['id'],f'{40:024x}')
 def test_unranked_switch_and_invalid_parameters_cannot_expand_visibility(self):
  self.record(1);self.record(2,board='unranked',reference=99)
  result=self.other.get('/api/runs').json
  self.assertEqual(result['total'],1);self.assertEqual(result['boards'],['all','ranked']);self.assertEqual(result['boardCounts']['unranked'],0)
  hidden=self.other.get('/api/runs?board=unranked').json
  self.assertEqual(hidden['items'],[]);self.assertEqual(hidden['stats'],{'n':0,'fastest':None,'best':None})
  for query in ('board=hidden','board=anything','sort=bad','page=bad'):
   self.assertEqual(self.other.get('/api/runs?'+query).status_code,400)
 def test_initial_html_matches_default_api_and_marks_unranked_without_js(self):
  self.enable_unranked();self.record(1,board='unranked',decision='pending',score=None,reference=88.25,name='<img src=x onerror=alert(1)>')
  html=self.other.get('/leaderboard').get_data(as_text=True)
  initial=json.loads(re.search(r'id="initial-ranking">(.*?)</script>',html,re.S)[1])
  self.assertEqual(initial,self.other.get('/api/runs').json)
  self.assertIn('id="board-title">积分总榜',html);self.assertIn('data-board="all" class="active" aria-pressed="true"',html)
  self.assertLess(html.index('data-board="all"'),html.index('data-board="ranked"'));self.assertLess(html.index('data-board="ranked"'),html.index('data-board="unranked"'))
  self.assertIn('class="record-board unranked"',html);self.assertIn('>UNRANKED</small>',html);self.assertIn('88.25',html)
  self.assertIn('&lt;img src=x',html);self.assertNotIn('<img src=x',html)
 def rank_cells(self,html):
  # Restrict assertions to actual table rows, excluding bundled CSS/JS text.
  body=re.search(r'<tbody>(.*?)</tbody>',html,re.S)[1]
  return [(re.search(r'href="/run/([a-f0-9]{24})"',row)[1],re.search(r'<td class="rank">(.*?)</td>',row,re.S)[1]) for row in re.findall(r'<tr\b[^>]*>(.*?)</tr>',body,re.S)]
 def test_interleaved_unranked_records_do_not_take_places_or_medals(self):
  self.enable_unranked()
  ranked=[self.record(n,score=100-n*10) for n in range(1,5)]
  for n,score in enumerate((95,85,75),10):self.record(n,board='unranked',reference=score)
  items=self.other.get('/api/runs').json['items']
  self.assertEqual([r['displayScore'] for r in items],[95,90,85,80,75,70,60])
  self.assertEqual([r['rank'] for r in items],[None,1,None,2,None,3,4])
  self.assertEqual([r['rank'] for r in self.other.get('/api/runs?board=ranked').json['items']],[1,2,3,4])
  cells=dict(self.rank_cells(self.other.get('/leaderboard').get_data(as_text=True)))
  self.assertEqual(sum('class="rank-medal"' in cell for cell in cells.values()),3)
  for item in items:
   cell=cells[item['id']]
   if item['board']=='unranked':
    self.assertEqual(re.sub('<[^>]*>','',cell).strip(),'—')
    self.assertNotIn('rank-medal',cell);self.assertNotIn('rank-value',cell)
   else:
    self.assertEqual(re.search(r'class="rank-value">(\d+)</span>',cell)[1],f"{item['rank']:02d}")
    self.assertEqual('class="rank-medal"' in cell,item['rank']<=3)
  self.assertEqual([r['id'] for r in items if r['rank'] is not None],ranked)
 def test_a_full_page_of_unranked_does_not_consume_first_rank(self):
  self.enable_unranked()
  for n in range(1,26):self.record(n,board='unranked',reference=90+n/100)
  first_ranked=self.record(26,score=80);second_ranked=self.record(27,score=70)
  first=self.other.get('/api/runs').json;second=self.other.get('/api/runs?page=2').json
  self.assertEqual(len(first['items']),25);self.assertTrue(all(r['rank'] is None for r in first['items']))
  self.assertEqual([(r['id'],r['rank']) for r in second['items']],[(first_ranked,1),(second_ranked,2)])
 def test_search_retains_global_rank_for_each_selected_sort(self):
  self.enable_unranked()
  target=self.record(1,name='Target',score=90,duration=30)
  second=self.record(2,score=80,duration=10);third=self.record(3,score=70,duration=20)
  self.record(4,board='unranked',reference=99,duration=1)
  self.record(5,board='hidden',score=100,duration=.1)
  for sort,ordered,rank in [('score',[target,second,third],1),('speed',[second,third,target],3),('recent',[third,second,target],3)]:
   with self.subTest(sort=sort):
    items=self.other.get('/api/runs',query_string={'sort':sort}).json['items']
    self.assertEqual([(r['id'],r['rank']) for r in items if r['board']=='ranked'],list(zip(ordered,[1,2,3])))
    self.assertTrue(all(r['rank'] is None for r in items if r['board']=='unranked'))
    for board in ('all','ranked'):
     result=self.other.get('/api/runs',query_string={'board':board,'sort':sort,'q':'Target'}).json
     self.assertEqual(result['total'],1);self.assertEqual([(r['id'],r['rank']) for r in result['items']],[(target,rank)])
 def test_all_unranked_server_render_has_no_rank_numbers_or_medals(self):
  self.enable_unranked()
  for n in range(1,5):self.record(n,board='unranked',decision='rejected',reference=90-n)
  items=self.other.get('/api/runs').json['items'];self.assertTrue(all(r['rank'] is None for r in items))
  cells=self.rank_cells(self.other.get('/leaderboard').get_data(as_text=True));self.assertEqual(len(cells),4)
  for _,cell in cells:
   self.assertNotIn('rank-value',cell);self.assertNotIn('rank-medal',cell)
   self.assertEqual(re.sub('<[^>]*>','',cell).strip(),'—')

if __name__=='__main__':unittest.main()
