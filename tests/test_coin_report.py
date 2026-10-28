import json,unittest
from public_report import public_report,score_adjustments
import test_platform as fixtures
from store import db,dumps


def report(count=1,status='pass'):
 return {'verdict':'accepted','metrics':{'coins':{'available':True,'total':3,'collected':count,'items':[{'cell':[91,83]}],'pickups':[{'tick':1293,'time':66.744029}]}},'rules':[{'id':'coin_generation','title':'金币生成复算','status':'pass','details':{'private':'seed'}},{'id':'coin_pickup','title':'金币拾取复算','status':status,'details':{'private':'trace'}}],'performance':{'score':20,'referenceScore':20,'components':{'coins':10}}}


class CoinReportTests(unittest.TestCase):
 def test_authoritative_collection_count_is_public_but_trace_is_private(self):
  for count in range(4):
   result=public_report(report(count));self.assertEqual(result['rules'][1]['summary'],f'已确认拾取 {count} / 3 枚金币。')
   self.assertEqual(result['rules'][0]['summary'],'已复算金币位置与可达性。')
   text=json.dumps(result)
   for hidden in ('private','seed','cell','tick','pickups','metrics','66.744029'):self.assertNotIn(hidden,text)
 def test_failed_or_unavailable_check_never_claims_collection_success(self):
  for status in ('fail','disabled','insufficient','inconclusive'):
   raw=report(3,status);raw['rules'][1]['details']['blockedBy']=['combat']
   result=public_report(raw)['rules'][1]
   self.assertEqual(result['status'],status);self.assertNotIn('确认拾取',result['summary']);self.assertIn('金币奖励未计入',result['summary'])
   self.assertNotIn('blockedBy',json.dumps(result))
 def test_malformed_or_unverified_count_is_not_interpolated(self):
  for count in (True,-1,4,1.5,'<script>'):
   result=public_report(report(count))['rules'][1];self.assertEqual(result['summary'],'已完成金币拾取复算。')
  raw=report();raw['metrics']['coins']['available']=False
  self.assertEqual(public_report(raw)['rules'][1]['summary'],'已完成金币拾取复算。')
 def test_survival_exclusion_does_not_mislabel_the_route_or_add_a_penalty(self):
  value=score_adjustments({'score':35,'baseScore':60,'deductions':{'combat':25},'excludedBonuses':{'coins':['combat'],'tactics':['combat']}})
  self.assertEqual([item['points'] for item in value['items']],[-25])
  self.assertEqual(len(value['notes']),2)
  self.assertIn('生存状态',value['notes'][0]);self.assertNotIn('路线',value['notes'][0]);self.assertIn('战术',value['notes'][1])


class CoinPageTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 upload=fixtures.PlatformTests.upload
 web_headers=fixtures.PlatformTests.web_headers
 seed=fixtures.PlatformTests.seed
 def test_public_api_and_initial_html_both_include_coin_checks(self):
  key,_=self.seed(score=20,board='ranked',decision='approved');raw=report()
  with db(True) as c:c.execute('UPDATE runs SET report=? WHERE id=?',(dumps(raw),key))
  data=self.other.get('/api/runs/'+key).json['report'];self.assertEqual(data['rules'][1]['summary'],'已确认拾取 1 / 3 枚金币。')
  html=self.other.get('/run/'+key).get_data(as_text=True)
  for text in ('金币生成复算','金币拾取复算','已确认拾取 1 / 3 枚金币。'):self.assertIn(text,html)
  self.assertNotIn('1293',html);self.assertNotIn('66.744029',html)
