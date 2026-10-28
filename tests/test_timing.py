import base64,copy,json,math,struct,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from timing import summarize,judge_timing
from judge import defaults
from codec import parse,ProofError
from replay import convert
from visual_codec import load_chunk
class TimingTests(unittest.TestCase):
 def sample(self,factor=1.,pause=False,lag=False,sleep=False):
  frames=[];clocks=[];wall=awake=paused=sim=0.;start=1791030000000000
  for i in range(401):
   delta=0 if i==0 else (.12 if lag else .02);raw=delta*(factor(i) if callable(factor) else factor)
   wall+=delta;awake+=delta
   if i==200 and (pause or sleep):
    wall+=3
    if pause:paused+=3;awake+=3
   dt=min(raw,.05);sim+=dt;row=[0.]*72;row[0]=dt;row[6:9]=[3+sim,1.55,3];row[12:15]=row[6:9];row[18]=1.396;row[19]=100;row[22]=sim
   frames.append(struct.pack('<72f',*row));clocks.append(struct.pack('<5Q',round(wall*1e6),start+round(wall*1e6),round(raw*1e9),round(paused*1e6),round(awake*1e6)))
  meta={'timing':{'source':3,'startedAtUs':start,'finishedAtUs':start+round(wall*1e6),'samples':base64.b64encode(b''.join(clocks)).decode()},'completedAt':int(start/1e6+wall),'simulationDuration':sim,'platform':'linux','frames':len(frames),'seed':'1','spawnPosition':[3,3],'tile':2,'ceiling':2.65,'eye':1.55,'exit':[5,1],'bitmap':base64.b64encode(bytes(8192)).decode(),'formSeeds':['1','2','3','4']}
  meta['timeInfo']=summarize(meta);meta['duration']=meta['timeInfo']['activeDuration'];meta['replayDuration']=meta['timeInfo']['duration'];return meta,b''.join(frames)
 def analyze(self,meta,frames):
  events=[];p=defaults();result=judge_timing(meta,frames,lambda *e:events.append(e),p['time_sources']['params'],p['speed_control']['params']);return result,[e for e in events if not e[2]]
 def test_normal_low_fps_pause_and_sleep_are_not_speedhacks(self):
  for kw in ({},{'lag':True},{'pause':True},{'sleep':True}):
   meta,frames=self.sample(**kw);result,failures=self.analyze(meta,frames);self.assertEqual(failures,[],kw);self.assertAlmostEqual(result['gameClockRatio'],1)
 def test_fast_slow_and_changed_midway_are_found(self):
  for factor in (2.,.5,1.02,lambda i:2 if i>200 else 1):
   meta,frames=self.sample(factor);_,failures=self.analyze(meta,frames);self.assertTrue(any(e[0]=='speed_control' for e in failures))
 def fluctuating_render_load(self,factor=1.,platform='windows'):
  meta,_=self.sample();frames=[];clocks=[];wall=paused=sim=0.;start=meta['timing']['startedAtUs']
  # Alternate small and very expensive rendered frames, with repeated menu
  # pauses between scale changes. Windows reference clocks are coarser.
  for i in range(801):
   delta=0 if i==0 else (1/120,.016,.034,.049,.051,.12,.65,2.4)[(i//9)%8]
   wall+=delta
   if i and i%61==0:wall+=.7;paused+=.7
   raw=delta*factor;dt=min(raw,.05);sim+=dt
   row=[0.]*72;row[0]=dt;row[19]=100;row[22]=sim;frames.append(struct.pack('<72f',*row))
   reference=math.floor(wall/.015625)*.015625 if platform=='windows' else wall
   clocks.append(struct.pack('<5Q',round(reference*1e6),start+round(wall*1e6),round(raw*1e9),round(paused*1e6),round(reference*1e6)))
  meta['timing'].update(source={'windows':1,'macos':2,'linux':3}[platform],finishedAtUs=start+round(wall*1e6),samples=base64.b64encode(b''.join(clocks)).decode())
  meta.update(platform=platform,frames=len(frames),completedAt=int(start/1e6+wall),simulationDuration=sim)
  meta['timeInfo']=summarize(meta);return meta,b''.join(frames)
 def test_repeated_scale_changes_and_long_frames_do_not_look_like_clock_scaling(self):
  for platform in ('windows','macos','linux'):
   meta,frames=self.fluctuating_render_load(platform=platform);result,failed=self.analyze(meta,frames)
   self.assertEqual(failed,[],platform);self.assertLess(result['simulationRatio'],.2)
   self.assertAlmostEqual(result['gameClockRatio'],1,delta=.002)
 def test_real_clock_scaling_is_still_detected_during_the_same_render_stalls(self):
  for factor in (.5,1.03,2):
   meta,frames=self.fluctuating_render_load(factor);_,failed=self.analyze(meta,frames)
   self.assertTrue(any(e[0]=='speed_control' for e in failed),factor)
 def test_utc_adjustment_is_clock_review_not_speed_accusation(self):
  meta,frames=self.sample();b=bytearray(base64.b64decode(meta['timing']['samples']));x=struct.unpack_from('<Q',b,300*40+8)[0];struct.pack_into('<Q',b,300*40+8,x+10_000_000);meta['timing']['samples']=base64.b64encode(b).decode();_,failed=self.analyze(meta,frames);self.assertTrue(any(e[0]=='time_sources' for e in failed));self.assertFalse(any(e[0]=='speed_control' for e in failed))
 def test_changing_simulation_dt_only_is_detected(self):
  m,f=self.sample();f=bytearray(f);struct.pack_into('<f',f,100*288,.04);_,failures=self.analyze(m,f);self.assertTrue(any(e[0]=='speed_control' and e[1]==100 for e in failures))
 def test_real_replay_span_keeps_pauses_and_bounds_sample_rate(self):
  meta,frames=self.sample(2,pause=True)
  with tempfile.TemporaryDirectory() as folder:
   out=Path(folder);manifest=convert(meta,frames,out);self.assertAlmostEqual(manifest['duration'],11);self.assertEqual(manifest['timeBasis'],'recorded_wall');self.assertTrue(manifest['idleRanges']);self.assertGreater(meta['simulationDuration'],meta['duration']);self.assertLess(manifest['samples'],150)
   self.assertTrue(all(a<b for a,b in zip(manifest['times'],manifest['times'][1:])))
   a,b=manifest['idleRanges'][0];self.assertAlmostEqual(b-a,3)
   rows=load_chunk(out,manifest,0);keys=[r for r in rows if abs(r[0]-a)<.001 or abs(r[0]-b)<.001];self.assertEqual(len(keys),2);self.assertEqual(keys[0][1:43],keys[1][1:43])
 def test_legacy_has_no_claim_of_real_time(self):
  self.assertEqual(summarize({'simulationDuration':12})['basis'],'simulation_legacy')
 def test_native_hlr3_capture_decodes_without_changing_model_words(self):
  # The fixture is optional in clean checkouts; synthetic coverage is unconditional.
  for kind,expected in [('normal',False),('fast',True),('slow',True),('win-normal',False),('win-fast',True),('win-slow',True),('render-normal',False),('render-fast',True),('render-slow',True)]:
   path=Path(__file__).resolve().parents[2]/'halls-client/output'/('clock-'+kind)/'clock.raw'
   if not path.exists() or path.read_bytes()[:4]!=b'HLR4':continue
   meta,frames=parse(path.read_bytes(),{});self.assertEqual(meta['recordWords'],85);self.assertEqual(len(frames),meta['frames']*288);self.assertTrue(meta['timeInfo']['available']);_,failed=self.analyze(meta,frames);self.assertEqual(any(e[0]=='speed_control' for e in failed),expected,(kind,failed[:3]));self.assertFalse(any(e[0]=='time_sources' for e in failed),(kind,failed[:3]))
