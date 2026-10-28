import base64,json,struct,unittest
from unittest.mock import patch
import test_platform as fixtures
from test_platform import DATA,db
import test_timing as timing_fixtures
from visual_codec import load_manifest
import worker
from layout import CURRENT_BUILD,LAYOUTS

class WorkerVisualTests(unittest.TestCase):
 setUp=fixtures.PlatformTests.setUp
 web_headers=fixtures.PlatformTests.web_headers
 upload=fixtures.PlatformTests.upload
 def test_worker_finishes_with_binary_replay_and_similarity_tags(self):
  response=self.upload();key=response.json['id']
  with db(True) as c:c.execute("UPDATE runs SET status='processing' WHERE id=?",(key,))
  meta,frames=timing_fixtures.TimingTests().sample();meta.update(playbackSafe=True,keyId='fixture',runId='fixture',rawSha256='c'*64,recordingBuild=CURRENT_BUILD,version=LAYOUTS[CURRENT_BUILD].version,entities=5,words=84,recordWords=LAYOUTS[CURRENT_BUILD].record_words);meta['formSeeds'].append('5');frames=b''.join(frames[i:i+288]+bytes(48) for i in range(0,len(frames),288))
  meta['exitSamples']={'samples':base64.b64encode(struct.pack('<2I',*meta['exit'])*meta['frames']).decode(),'encoding':'u32le-pair'};meta['exitEvents']=[{'time':0.,'cell':meta['exit']}]
  report={'verdict':'rejected','rules':[{'id':'path_similarity','status':'fail'}],'failed':['path_similarity'],'performance':{'score':20,'grade':'D','badges':[]}}
  decision={'decision':'rejected','board':'unranked','mode':'automatic'}
  with patch('worker.decode',return_value=(meta,frames)),patch('worker.assess',return_value=(report,{})),patch('worker.automatic_decision',return_value=decision):worker.process(key)
  with db() as c:row=c.execute('SELECT * FROM runs WHERE id=?',(key,)).fetchone()
  self.assertEqual(row['status'],'done');self.assertIn('相似记录待复核',json.loads(row['tags']));self.assertEqual(load_manifest(DATA/'replays'/key)['format'],'HVR5')
  self.assertEqual(row['bytes'],(DATA/'proofs'/key).stat().st_size+sum(p.stat().st_size for p in (DATA/'replays'/key).iterdir()))
