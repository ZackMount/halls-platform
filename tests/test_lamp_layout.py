import base64
import hashlib
import platform
import tempfile
import sys
from pathlib import Path
from unittest.mock import patch
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'engine'))
from replay import lamp_bits


class LampLayout(unittest.TestCase):
 def test_signed_build_selects_the_matching_lamp_layout(self):
  for seed,expected in (
   (0,'56baa119e06df3b75aba04ebe5336320200441a5fc3a653b7f241ba1ab1c53f0'),
   (42,'88dd64d46b039d028243aaa60f7a9aab3925035c2802099dfc2a57f0c9b052fa'),
   (104729,'65c39f1e4e37ba25da5cb966e21a5d22b08902c7807babc2706ca9a36f90105b'),
   (1<<40,'61c64e96500e8703e55e5a68666c4627d8c2947dcf28bf2e96f9d66c34e00df3'),
   ((1<<64)-1,'0eb22d6f7162a91dcf2a3b33bf634a9e6d75fe1d40f283d99f2d45819a3b8a1f'),
  ):
   meta={'seed':str(seed),'tile':2,'spawnPosition':[255,263],'recordingBuild':0xb0001}
   current=lamp_bits(meta);self.assertEqual(hashlib.sha256(current).hexdigest(),expected)
   self.assertEqual(current,lamp_bits({**meta,'recordingBuild':0,'version':'0.11.1'}))
   old=lamp_bits({**meta,'recordingBuild':0xb0000})
   self.assertTrue(all(new&~prior==0 for new,prior in zip(current,old)))
   old_count=new_count=0
   for z in range(256):
    for x in range(256):
     i=z*256+x;mask=1<<(i%8);prior=([x,z]==[127,131] or ((x*37+z*19)^seed)%7!=0)
     self.assertEqual(bool(old[i//8]&mask),prior)
     if (x+2*z)%4==0 or [x,z]==[127,131]:
      old_count+=int(prior);new_count+=int(bool(current[i//8]&mask))
   self.assertTrue(.68<new_count/old_count<.72)
   spawn=131*256+127;self.assertTrue(current[spawn//8]&(1<<(spawn%8)))

 def test_terrain_lamps_use_native_result_without_disclosing_seed(self):
  from replay import convert
  from visual_codec import load_manifest
  from test_version_0110 import metadata,recording
  meta,frames=metadata(recording());bits=bytes([0x81])*8192
  meta['_renderLampBits']=bits
  with tempfile.TemporaryDirectory() as folder,patch('engine.judge.native_lamp_bits') as rebuild:
   convert(meta,frames,Path(folder));rebuild.assert_not_called();manifest=load_manifest(Path(folder))
  self.assertEqual(manifest['lampBits'],bits)
  self.assertTrue(manifest['terrainLighting']);self.assertNotIn('seed',manifest);self.assertNotIn('_renderLampBits',manifest)
  with self.assertRaises(ValueError):lamp_bits({**meta,'_renderLampBits':b'bad'})
 def test_private_terrain_preview_rebuilds_lamps_when_no_judgement_ran(self):
  meta={'recordingBuild':0xb0003,'seed':'42'};bits=bytes([0x42])*8192
  with patch('engine.judge.native_lamp_bits',return_value=bits) as rebuild:
   self.assertEqual(lamp_bits(meta),bits);rebuild.assert_called_once_with(meta)
 @unittest.skipUnless(list((Path(__file__).resolve().parents[1]/'engine/model').glob('judge-current-'+platform.system().lower()+'-*')),'Build current native judge first')
 def test_native_render_helper_matches_model_tail_and_old_build_keeps_old_lights(self):
  from judge import native_lamp_bits,native_model,adjudicate,defaults
  from test_version_0110 import metadata,recording
  for seed in ('42','104729',str((1<<64)-1)):
   meta,frames=metadata(recording());meta['seed']=seed;result=native_model(meta,frames)
   self.assertEqual(result['lampBits'],native_lamp_bits(meta));self.assertEqual(len(result['lampBits']),8192)
   self.assertNotEqual(lamp_bits(meta),lamp_bits({**meta,'recordingBuild':0xb0002,'version':'0.11.2'}))
   adjudicate(meta,frames,{k:{'enabled':k=='map'} for k in defaults()})
   self.assertEqual(meta['_renderLampBits'],result['lampBits'])


if __name__=='__main__':unittest.main()
