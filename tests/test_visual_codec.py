import copy,gzip,math,random,struct,tempfile,unittest
from pathlib import Path
from visual_codec import *
from visual_fixture import write_visual

class VisualCodecTests(unittest.TestCase):
 def fixture(self):
  with tempfile.TemporaryDirectory() as folder:
   write_visual(folder,health=(100,100000,99966,47.8583984375))
   meta=load_manifest(folder);rows=load_chunk(folder,meta,0)
  return meta,rows
 def test_metadata_preserves_precise_times_pause_spans_health_and_bitmaps(self):
  meta,_=self.fixture();meta.update(times=[0,.096725,.189432,.283367],idleRanges=[[.000001,.096724]],chaseRanges=[[.189432,.283367]],path=[[3.0001,4.0022],[4.0003,3.0004]],bitmap=bytes(range(256))*32,lampBits=bytes(reversed(range(256)))*32)
  decoded=decode_manifest(encode_manifest(meta))
  for key in ('times','idleRanges','chaseRanges','healthEvents','path','bitmap','lampBits','duration','eye','ceiling','spawnPosition'):self.assertEqual(decoded[key],meta[key],key)
 def test_terrain_flag_adds_no_payload_and_old_packets_keep_grid_lamps(self):
  meta,_=self.fixture();old=encode_manifest({**meta,'terrainLighting':False});new=encode_manifest({**meta,'terrainLighting':True})
  self.assertEqual(len(old),len(new));self.assertEqual(new[4],old[4]|16);self.assertEqual(old[:4]+old[5:],new[:4]+new[5:])
  self.assertFalse(decode_manifest(old)['terrainLighting']);self.assertTrue(decode_manifest(new)['terrainLighting'])
  changed=bytearray(new);changed[4]|=32
  with self.assertRaises(ValueError):decode_manifest(changed)
 def test_unquantizable_doubles_use_lossless_fallback(self):
  meta,_=self.fixture();meta.update(times=[0,1/3,2/3,1.0],path=[[math.pi,-math.e],[1/7,1/9]],healthEvents=[[1/3,100000],[2/3,47.8583984375]])
  blob=encode_manifest(meta);self.assertEqual(blob[4]&12,12);decoded=decode_manifest(blob)
  for key in ('times','path','healthEvents'):self.assertEqual(decoded[key],meta[key])
 def test_float_bits_and_all_control_combinations_survive_column_compression(self):
  meta,rows=self.fixture();rng=random.Random(4);rows=(rows*91)[:360];meta.update(samples=360,times=[i*.1 for i in range(360)])
  for i,row in enumerate(rows):
   rows[i]=row.copy();rows[i][1+(i%len(FIELDS))]=rng.choice([0.,-0.,1e9,-1e9,47.8583984375]);rows[i][-2]=i%1024;rows[i][-1]=i%256
   for e in range(4):rows[i][2+len(FIELDS)+e]=(i+e)%4
  decoded=decode_chunk(encode_chunk(rows),meta,0)
  for old,new in zip(rows,decoded):self.assertEqual(struct.pack('<'+str(len(FIELDS))+'f',*old[1:1+len(FIELDS)]),struct.pack('<'+str(len(FIELDS))+'f',*new[1:1+len(FIELDS)]));self.assertEqual(old[-6:],new[-6:])
 def test_five_entity_packets_keep_the_fifth_pose_mood_and_battery(self):
  with tempfile.TemporaryDirectory() as folder:
   write_visual(folder,health=(100,66,32),entities=5);meta=load_manifest(folder);rows=load_chunk(folder,meta,0)
   self.assertEqual((meta['entities'],meta['words'],len(meta['forms'])),(5,84,5))
   fields=fields_for_entities(5)
   for i,row in enumerate(rows):
    row[1+fields.index(72)]=123.25+i;row[1+fields.index(73)]=245.5-i;row[1+fields.index(3)]=99.-i;row[2+len(fields)+4]=3
   decoded=decode_chunk(encode_chunk(rows,5),meta,0)
   self.assertEqual(rows,decoded)
   with self.assertRaises(ValueError):decode_chunk(encode_chunk(rows,5),{**meta,'entities':4},0)
   with self.assertRaises(ValueError):encode_manifest({**meta,'entities':6})
   with self.assertRaises(ValueError):encode_manifest({**meta,'forms':[1,2,3,4]})
 def test_packet_checks_and_short_last_chunk(self):
  meta,rows=self.fixture()
  with tempfile.TemporaryDirectory() as folder:
   save_replay(folder,meta,rows);blob=gzip.decompress((Path(folder)/'init.hvi.gz').read_bytes());m,c=split_initial(blob)
   for changed in (blob[:7],blob[:-1],blob+b'x',b'BAD!'+blob[4:]):
    with self.assertRaises(ValueError):split_initial(changed)
   for changed in (m[:8],m[:-1],m+b'x',b'BAD!'+m[4:]):
    with self.assertRaises(ValueError):decode_manifest(changed)
   for changed in (c[:7],c[:-1],c+b'x',c[:4]+struct.pack('<H',5)+c[6:],c[:8]+b'\0\0'+c[8:]):
    with self.assertRaises(ValueError):decode_chunk(changed,meta,0)
   self.assertEqual(load_manifest(folder)['samples'],4);self.assertEqual(load_chunk(folder,meta,0)[1][1+FIELDS.index(19)],100000);self.assertEqual(sorted(p.name for p in Path(folder).iterdir()),['init.hvi.gz'])

class CoinMetadataTests(unittest.TestCase):
 fixture=VisualCodecTests.fixture
 def test_optional_coin_extension_preserves_positions_and_pickup_timeline(self):
  meta,_=self.fixture();meta.update(coins=[{'id':0,'cell':[5,6]},{'id':1,'cell':[100,200]},{'id':2,'cell':[17,9]}],coinPickups=[{'id':1,'time':.2}])
  blob=encode_manifest(meta);self.assertTrue(blob[4]&32);decoded=decode_manifest(blob)
  self.assertEqual(decoded['coins'][0],{'id':0,'cell':[5,6],'position':[11.,13.]})
  self.assertEqual(decoded['coinPickups'],[{'id':1,'time':.2}]);self.assertEqual(decoded['path'],meta['path'])
  self.assertEqual(decode_manifest(encode_manifest({**meta,'coins':[],'coinPickups':[]}))['coins'],[])
 def test_coin_extension_rejects_invalid_ids_cells_and_nonfinite_times(self):
  meta,_=self.fixture();meta.update(coins=[{'id':0,'cell':[5,6]}],coinPickups=[])
  for coins in ([{'id':3,'cell':[5,6]}],[{'id':0,'cell':[-1,6]}],[{'id':0,'cell':[5,6]}]*2):
   with self.assertRaises(ValueError):encode_manifest({**meta,'coins':coins})
  for pickup in ({'id':2,'time':.1},{'id':0,'time':float('nan')},{'id':0,'time':1.}):
   with self.assertRaises(ValueError):encode_manifest({**meta,'coinPickups':[pickup]})
  blob=encode_manifest(meta)
  for changed in (blob[:-1],blob[:-8]+struct.pack('<d',float('nan')),blob[:-8]+struct.pack('<d',-2.),blob[:-8]+struct.pack('<d',999)):
   with self.assertRaises(ValueError):decode_manifest(changed)

class ExitMetadataTests(unittest.TestCase):
 fixture=VisualCodecTests.fixture
 def test_converter_preserves_recorded_events_without_downsampling_and_marks_victory_separately(self):
  from replay import convert
  rows=[]
  for x,dt in [(3.,0.),(4.,.1)]:
   row=[0.]*84;row[0]=dt;row[6]=row[12]=x;row[7]=row[13]=1.55;row[8]=row[14]=3.;row[18]=1.396;row[19]=100.;row[22]=dt;rows.append(struct.pack('<84f',*row))
  events=[{'time':0.,'cell':[5,1]},{'time':.02,'cell':[7,2]},{'time':.03,'cell':[5,1]}]
  meta={'recordingBuild':0x01000000,'version':'1.0.0','entities':5,'frames':2,'words':84,'tile':2.,'ceiling':2.65,'eye':1.55,'exit':[5,1],'spawnPosition':[3.,3.],'formSeeds':['1','2','3','4','5'],'bitmap':bytes(8192),'duration':.1,'_renderLampBits':bytes(8192),'_objectives':{},'_canonicalExit':[5,1],'exitEvents':events,'_exitCompletionMismatch':True}
  with tempfile.TemporaryDirectory() as folder:
   convert(meta,b''.join(rows),Path(folder));decoded=load_manifest(folder)
  self.assertEqual(decoded['samples'],2);self.assertEqual(decoded['exitEvents'],events)
  self.assertEqual(decoded['exitCompletionMismatch'],{'position':[4.,3.]});self.assertEqual(decoded['canonicalExit'],[5,1])
 def test_old_packets_roundtrip_without_an_invented_exit_history(self):
  meta,_=self.fixture();blob=encode_manifest(meta);decoded=decode_manifest(blob)
  self.assertFalse(blob[4]&64);self.assertIsNone(decoded['canonicalExit']);self.assertEqual(decoded['exitEvents'],[])
  self.assertIsNone(decoded['exitCompletionMismatch']);self.assertEqual(encode_manifest(decoded),blob)
 def test_full_tick_exit_events_are_independent_of_visual_sample_rate(self):
  meta,_=self.fixture();events=[{'time':0.,'cell':[5,1]},{'time':.000001,'cell':[17,20]},{'time':.000002,'cell':[5,1]}]
  meta.update(canonicalExit=[5,1],exitEvents=events,coins=[{'id':0,'cell':[3,4]}],coinPickups=[{'id':0,'time':.05}])
  decoded=decode_manifest(encode_manifest(meta));self.assertEqual(decoded['exitEvents'],events);self.assertEqual(decoded['canonicalExit'],[5,1])
  self.assertEqual(decoded['coinPickups'],meta['coinPickups']);self.assertEqual(decoded['times'],meta['times'])
 def test_old_completion_mismatch_is_a_position_not_a_fabricated_exit(self):
  meta,_=self.fixture();meta.update(canonicalExit=[5,1],exitCompletionMismatch={'position':[31.75,49.125]})
  decoded=decode_manifest(encode_manifest(meta));self.assertEqual(decoded['exitCompletionMismatch'],meta['exitCompletionMismatch']);self.assertEqual(decoded['exitEvents'],[]);self.assertEqual(decoded['exit'],meta['exit'])
 def test_exit_extension_rejects_malformed_coordinates_and_timeline(self):
  meta,_=self.fixture();initial={'time':0.,'cell':[5,1]}
  for events in ([{'time':.1,'cell':[5,1]}],[initial,initial],[initial,{'time':.1,'cell':[5,1]}],[initial,{'time':float('nan'),'cell':[3,4]}],[initial,{'time':1.,'cell':[3,4]}],[initial,{'time':.1,'cell':[256,4]}]):
   with self.assertRaises(ValueError):encode_manifest({**meta,'exitEvents':events})
  for cell in ([1],[-1,4],[4,256],[True,4],[1.5,4]):
   with self.assertRaises(ValueError):encode_manifest({**meta,'canonicalExit':cell})
  for position in ([512,0],[0,float('nan')],[1]):
   with self.assertRaises(ValueError):encode_manifest({**meta,'exitCompletionMismatch':{'position':position}})
  blob=encode_manifest({**meta,'canonicalExit':[5,1]})
  for changed in (blob[:-1],blob[:-3]+b'\0'+blob[-2:],blob[:-3]+b'\x08'+blob[-2:],blob+b'x'):
   with self.assertRaises(ValueError):decode_manifest(changed)
