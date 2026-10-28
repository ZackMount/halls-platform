"""Build-bound HLR4/HLR5 layouts, caps, fifth entity, and row consumers."""
import base64,copy,math,platform,struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from codec import parse,ProofError
from judge import Rows,adjudicate,defaults,policy,native_model
from layout import LAYOUTS,CURRENT_BUILD,recording_layout
from battery import judge_battery
from timing import judge_timing
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from similarity import fingerprint


def bitmap():
 b=bytearray(8192)
 for z in range(256):
  for x in range(256):
   if x in (0,255) or z in (0,255):b[(z*256+x)//8]|=1<<(x%8)
 return bytes(b)

def recording(build=CURRENT_BUILD,move=.25,fifth_move=.2):
 layout=LAYOUTS[build];start=1770000000000000
 header=layout.magic+struct.pack('<IHHBBHIQQHHfffIqiQQI',build,256,256,layout.entities,1,layout.record_words,2,42,999,1,1,2,2.65,1.55,8192,(start+50000)//1000000,480,start,start+50000,1)
 header+=struct.pack(f'<{layout.entities}Q',*range(1,layout.entities+1))+bitmap()
 previous=[0]*layout.record_words;body=bytearray()
 for tick in range(2):
  row=[0.]*layout.words;row[0]=tick*.05;row[6:9]=[3+tick*move,1.55,3];row[12:15]=row[6:9];row[18]=math.radians(80);row[19]=100;row[22]=tick*.05
  for e,k in enumerate(layout.entity_offsets):row[k:k+2]=[11+e*2+tick*(fifth_move if e==4 else 0),11]
  current=list(struct.unpack(f'<{layout.words}I',struct.pack(f'<{layout.words}f',*row)))
  current[1]=512|(256 if tick else 0);current[23]=tick;current[2]=struct.unpack('<I',struct.pack('<f',tick*move))[0]
  if tick and layout.entities==5:current[83]=2
  current.extend(struct.unpack('<3I',struct.pack('<ffI',100.,0.,1)))
  for value in (tick*50000,start+tick*50000,tick*50000000,0,tick*50000):current.extend([value&0xffffffff,value>>32])
  if layout.exit_words:current.extend([1,1])
  for offset in range(0,layout.record_words,8):
   mask_at=len(body);body.append(0)
   for bit in range(min(8,layout.record_words-offset)):
    k=offset+bit;delta=current[k]^previous[k];previous[k]=current[k]
    if delta:
     body[mask_at]|=1<<bit
     while delta>=128:body.append((delta&127)|128);delta>>=7
     body.append(delta)
 return header+body

def metadata(raw):
 m,f=parse(raw,{});m.update(sha256='test',signature='valid',keyId='test',fileBytes=len(raw));return m,f

def native_metadata(meta,build):
 layout=LAYOUTS[build];result={**meta,'recordingBuild':build,'version':layout.version,'recordWords':layout.record_words,'words':layout.words,'entities':layout.entities}
 if layout.exit_words:result['exitSamples']={'samples':base64.b64encode(struct.pack('<II',*result['exit'])*result['frames']).decode(),'encoding':'u32le-pair'}
 else:result.pop('exitSamples',None)
 return result


def only(*names):return {k:{'enabled':k in names} for k in defaults()}

class Version0110(unittest.TestCase):
 def test_signed_contract_has_five_full_entities_and_separate_battery_clocks(self):
  m,f=metadata(recording());self.assertEqual((m['version'],m['entities'],m['words'],m['recordWords']),('1.0.1',5,84,99));self.assertEqual(len(f),2*336)
  rows=Rows(f,words=84);self.assertAlmostEqual(rows[-1][72],19.2,places=5);self.assertEqual(len(base64.b64decode(m['battery']['samples'])),24);self.assertEqual(len(base64.b64decode(m['timing']['samples'])),80)
  self.assertAlmostEqual(rows[-1][0],.05);self.assertEqual(m['formSeeds'],['1','2','3','4','5'])
 def test_current_and_previous_hlr5_contracts_match_without_accepting_previous_formal_build(self):
  self.assertEqual(CURRENT_BUILD,0x01000001)
  old,old_frames=metadata(recording(0xb0000));current,current_frames=metadata(recording())
  self.assertEqual((old['version'],current['version']),('0.11.0','1.0.1'))
  self.assertEqual(old_frames,current_frames)
  self.assertEqual((old['entities'],old['words'],old['recordWords']),(5,84,97))
 def test_old_and_new_magic_build_count_words_are_bound(self):
  for field,fmt,value in ((0,'4s',b'HLR4'),(4,'I',0xa0002),(12,'B',4),(14,'H',85)):
   raw=bytearray(recording());struct.pack_into('<'+fmt,raw,field,value)
   with self.subTest(field=field),self.assertRaises(ProofError):parse(raw,{})
  old=bytearray(recording(0xa0002,move=.23));struct.pack_into('<4s',old,0,b'HLR5')
  with self.assertRaises(ProofError):parse(old,{})
 def test_hlr4_still_has_original_speeds_and_stride(self):
  m,f=metadata(recording(0xa0002,move=.23));self.assertEqual((m['entities'],m['words'],m['recordWords']),(4,72,85));self.assertEqual(len(f),2*288)
  self.assertEqual((recording_layout(m).walk,recording_layout(m).run),(2.7,4.6));self.assertFalse(any('movement' in v['message'] for v in m['violations']))
 def test_signed_build_selects_chase_caps_and_saved_default_policy(self):
  saved={'player_speed':{'params':{'walk':2.,'run':5.}},'entity_speed':{'params':{'maximum':5.4}}}
  for build,speed,status in ((0xb0000,5.4,'fail'),(0xb0001,5.4,'fail'),(0xb0002,6.5,'pass'),(0xb0003,6.5,'pass'),(CURRENT_BUILD,6.5,'pass')):
   m,f=metadata(recording(build,fifth_move=.3));self.assertEqual(recording_layout(m).chase,speed)
   self.assertEqual(policy(saved,m)['entity_speed']['params']['maximum'],speed)
   report=adjudicate(m,f,only('entity_speed'))
   self.assertEqual(next(r for r in report['rules'] if r['id']=='entity_speed')['status'],status)
  custom=copy.deepcopy(saved);custom['entity_speed']['params']['maximum']=6.
  self.assertEqual(policy(custom,{'recordingBuild':CURRENT_BUILD})['entity_speed']['params']['maximum'],6.)
 def test_fifth_entity_is_in_speed_checks_and_chase_metrics(self):
  for delta,expected in ((.2,'pass'),(.8,'fail')):
   m,f=metadata(recording(fifth_move=delta));report=adjudicate(m,f,only('entity_speed'))
   rule=next(r for r in report['rules'] if r['id']=='entity_speed');self.assertEqual(rule['status'],expected)
   self.assertAlmostEqual(report['metrics']['chaseSeconds'],.05);self.assertEqual(report['metrics']['raceReference']['speed'],5.)
   if expected=='fail':self.assertEqual(rule['evidence'][0]['entity'],5)
 def test_player_speed_and_reference_respect_each_build(self):
  for build,delta,expected,speed in ((CURRENT_BUILD,.25,'pass',5.),(0xa0002,.25,'fail',4.6)):
   m,f=metadata(recording(build,move=delta));report=adjudicate(m,f,only('player_speed'),model_runner=lambda *_: (_ for _ in ()).throw(RuntimeError('disabled model in cap test')))
   rule=next(r for r in report['rules'] if r['id']=='player_speed');self.assertEqual(rule['status'],expected if expected=='fail' else 'inconclusive');self.assertEqual(report['metrics']['raceReference']['speed'],speed)
 def test_saved_default_caps_migrate_but_custom_policy_is_preserved(self):
  settings={'player_speed':{'params':{'walk':2.7,'run':4.6}},'entity_speed':{'params':{'maximum':4.876}}}
  new=policy(settings,{'recordingBuild':CURRENT_BUILD});self.assertEqual(new['player_speed']['params']['run'],5.);self.assertEqual(new['player_speed']['params']['walk'],2.);self.assertEqual(new['entity_speed']['params']['maximum'],6.5)
  old=policy(defaults(),{'recordingBuild':0xa0002});self.assertEqual(old['player_speed']['params']['run'],4.6)
  custom=policy({'player_speed':{'params':{'run':6.}}},{'recordingBuild':CURRENT_BUILD});self.assertEqual(custom['player_speed']['params']['run'],6.)
  settings['player_speed']['params']['run']=5.
  old_custom=policy(settings,{'recordingBuild':0xa0002});self.assertEqual(old_custom['player_speed']['params']['run'],5.);self.assertEqual(old_custom['player_speed']['params']['walk'],2.7)
 def test_battery_timing_and_operations_use_84_word_stride(self):
  m,f=metadata(recording());report=adjudicate(m,f,only('time_sources','speed_control','flashlight'))
  for name in ('time_sources','speed_control','flashlight'):
   rule=next(r for r in report['rules'] if r['id']==name);self.assertEqual(rule['status'],'pass',(name,rule))
  self.assertAlmostEqual(report['metrics']['operations']['requestedMeters'],.25)
 def test_similarity_fingerprint_reads_five_entity_rows_at_the_right_stride(self):
  meta,frames=metadata(recording(move=.75));value=fingerprint(meta,frames)
  self.assertAlmostEqual(value['length'],.75);self.assertEqual(value['mapGenerator'],1);self.assertEqual(value['points'][-1],[3.75,3.])
 @unittest.skipUnless(list((Path(__file__).resolve().parents[1]/'engine/model').glob('judge-current-'+platform.system().lower()+'-*')),'Build current native judge first')
 def test_current_native_model_regenerates_all_five_spawns_and_rejects_fifth_tampering(self):
  m,f=metadata(recording());initial=native_model(m,f)
  row=list(struct.unpack_from('<84I',initial['frames']));row[1]=512
  first=struct.pack('<84I',*row);row[0]=struct.unpack('<I',struct.pack('<f',.05))[0]
  frames=first+struct.pack('<84I',*row)
  m.update(formSeeds=list(map(str,initial['forms'])),bitmap=base64.b64encode(initial['bitmap']).decode(),exit=initial['exit'])
  valid=adjudicate(m,frames,only('map','spawn'))
  self.assertEqual(next(r for r in valid['rules'] if r['id']=='map')['status'],'pass')
  self.assertEqual(next(r for r in valid['rules'] if r['id']=='spawn')['status'],'pass')
  self.assertEqual(valid['engine']['file'].split('-')[:2],['judge','current'])
  previous=native_model(native_metadata(m,0xb0000),frames)
  self.assertTrue(previous['engine']['file'].startswith('judge-v11-'));self.assertEqual(previous['frames'],native_model(native_metadata(m,0xb0001),frames)['frames'])
  self.assertEqual(initial['engine']['supportedBuilds'],['0x01000000','0x01000001'])
  self.assertEqual(previous['engine']['supportedBuilds'],['0x000b0000','0x000b0001'])
  b2=native_model(native_metadata(m,0xb0002),frames)
  self.assertEqual(initial['bitmap'],b2['bitmap']);self.assertEqual(initial['exit'],b2['exit']);self.assertEqual(initial['forms'],b2['forms']);self.assertTrue(b2['engine']['file'].startswith('judge-v113-'));self.assertEqual(b2['engine']['supportedBuilds'],['0x000b0002','0x000b0003']);self.assertEqual(native_model(native_metadata(m,0xb0003),frames)['frames'],b2['frames'])
  self.assertEqual(len(initial['lampBits']),8192);self.assertIsNone(b2['lampBits'])
  changed=bytearray(frames);struct.pack_into('<f',changed,72*4,struct.unpack_from('<f',changed,72*4)[0]+.1)
  bad=adjudicate(m,changed,only('spawn'));rule=next(r for r in bad['rules'] if r['id']=='spawn');self.assertEqual(rule['status'],'fail');self.assertEqual(rule['evidence'][0]['entity'],5)
 @unittest.skipUnless(list((Path(__file__).resolve().parents[1]/'engine/model').glob('judge-current-'+platform.system().lower()+'-*')),'Build current native judge first')
 def test_each_signed_hlr5_model_enforces_its_own_actual_pursuit_speed(self):
  meta,frames=metadata(recording());initial=native_model(meta,frames);bits=initial['bitmap']
  def open_cell(x,z):return not bits[(z*256+x)//8]&(1<<(x%8))
  x,z=next((x,z) for z in range(2,254) for x in range(2,248) if all(open_cell(x+d,z) for d in range(7)))
  for build,cap,family in ((0xb0000,5.4,'judge-v11-'),(0xb0001,5.4,'judge-v11-'),(0xb0002,6.5,'judge-v113-'),(0xb0003,6.5,'judge-v113-'),(CURRENT_BUILD,6.5,'judge-current-')):
   row=list(struct.unpack_from('<84I',initial['frames']))
   def put(at,value):row[at]=struct.unpack('<I',struct.pack('<f',value))[0]
   row[1]=512;row[23]=0
   for at,value in ((6,x*2+11.),(8,z*2+1.),(24,x*2+1.),(25,z*2+1.),(26,math.pi/2),(30,100.),(31,cap),(32,0.),(33,0.),(34,0.)):put(at,value)
   row[35]=2;first=struct.pack('<84I',*row);put(0,.05)
   result=native_model(native_metadata(meta,build),first+struct.pack('<84I',*row));output=struct.unpack_from('<84f',result['frames'],336)
   self.assertTrue(result['engine']['file'].startswith(family));self.assertAlmostEqual(output[31],cap,places=5)
   self.assertAlmostEqual((output[24]-(x*2+1.))/.05,cap,places=3)
 def test_metadata_mismatch_and_partial_frame_rejected(self):
  with self.assertRaises(ValueError):recording_layout({'recordingBuild':CURRENT_BUILD,'entities':4})
  with self.assertRaises(ValueError):Rows(bytes(335),words=84)
if __name__=='__main__':unittest.main()
