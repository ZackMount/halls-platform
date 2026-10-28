import hashlib,json,tempfile,unittest,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from asset_pipeline import Assets
class AssetTests(unittest.TestCase):
 def test_versioned_graph_and_preload_exclude_private_and_obsolete_data(self):
  a=Assets(Path(__file__).resolve().parents[1]/'web');text,mime=a.content('assets/site.js')
  self.assertIn((a.prefix+'/assets/preview.js').encode(),text)
  scene,_=a.content('replay-assets/scene.js');self.assertIn(a.url('replay-assets/vendor/three.module.js').encode(),scene)
  self.assertEqual(a.preload(),[]);urls=[v['url'] for v in a.media_map().values()];self.assertTrue(any(u.endswith('exploration-demo.mp4') for u in urls));self.assertFalse(any('/api/' in u or 'proofs' in u for u in urls))
  self.assertIsNone(a.source('assets/../../app.py'));self.assertIsNone(a.source('keys/recipient.pem'))
 def test_stale_embedded_replay_page_blocks_asset_publication(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'replay').mkdir();shell=root/'replay/index.html';frame=root/'replay/frame.html'
   shell.write_text('<body class="replay-page"><svg>new</svg></body>')
   frame.write_text('<body class="replay-page parked"><svg>old</svg></body>')
   with self.assertRaisesRegex(ValueError,'Embedded replay page is stale'):Assets(root)
   frame.write_text(shell.read_text().replace('class="replay-page"','class="replay-page parked"'))
   assets=Assets(root);self.assertIn(b'<svg>new</svg>',assets.content('replay-assets/frame.html')[0])
 def test_stale_decoder_bundle_blocks_asset_publication(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'replay').mkdir()
   source=root/'replay/visual-codec.js';bundle=root/'replay/replay-entry.js'
   source.write_text('five entities');bundle.write_text('compiled five entities')
   with self.assertRaisesRegex(ValueError,'Web bundles are stale'):Assets(root)
   digest=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
   manifest={'version':1,'artifacts':{'replay/replay-entry.js':{'sha256':digest(bundle),'inputs':{'replay/visual-codec.js':digest(source)}}}}
   (root/'.build-manifest.json').write_text(json.dumps(manifest));Assets(root)
   source.write_text('six entities')
   with self.assertRaisesRegex(ValueError,'Web bundles are stale'):Assets(root)
   source.write_text('five entities');bundle.write_text('old four entity bundle')
   with self.assertRaisesRegex(ValueError,'Web bundles are stale'):Assets(root)
 def test_macos_sidecars_do_not_change_or_break_the_public_bundle(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'index.html').write_text('hello');before=Assets(root).version
   (root/'._site.js').write_bytes(b'\xff\x00');self.assertEqual(Assets(root).version,before);self.assertIsNone(Assets(root).source('assets/._site.js'))
 def test_build_retains_old_versions_and_gzipped_js(self):
  a=Assets(Path(__file__).resolve().parents[1]/'web')
  with tempfile.TemporaryDirectory() as tmp:
   out=a.build(tmp);self.assertTrue((out/'assets/site.js.gz').exists());self.assertTrue((out/'shell.html').exists());self.assertTrue((out/'replay-assets/vendor/three.module.js').exists())

 def test_media_fonts_and_vendor_addresses_survive_unrelated_ui_edits(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'media').mkdir();(root/'fonts').mkdir();(root/'replay/vendor').mkdir(parents=True)
   (root/'index.html').write_text('hello');(root/'site.js').write_text('v1');(root/'media/a.mp4').write_bytes(b'video');(root/'fonts/a.woff2').write_bytes(b'font');(root/'replay/vendor/three.module.js').write_text("import './three.core.js'");(root/'replay/vendor/three.core.js').write_text('core')
   before=Assets(root);(root/'site.js').write_text('v2');after=Assets(root);self.assertNotEqual(before.version,after.version)
   for key in ('assets/media/a.mp4','assets/fonts/a.woff2','replay-assets/vendor/three.module.js'):self.assertEqual(before.url(key),after.url(key))
   text=after.rewrite('/assets/media/a.mp4 /replay-assets/vendor/three.module.js');self.assertIn(after.url('assets/media/a.mp4'),text);self.assertNotIn('/static/'+after.version+'/static/',text)
   (root/'media/a.mp4').write_bytes(b'new video');self.assertNotEqual(after.url('assets/media/a.mp4'),Assets(root).url('assets/media/a.mp4'))
 def test_replay_graph_and_shared_fonts_survive_portal_edits_but_follow_dependencies(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);(root/'replay/vendor').mkdir(parents=True);(root/'fonts').mkdir()
   for name,data in {'site.js':'portal one','i18n.js':'shared language','fonts/noto.css':'url("/assets/fonts/a.woff2")','fonts/a.woff2':'font','replay/index.html':'/assets/fonts/noto.css /replay-assets/app.js','replay/app.js':'/assets/i18n.js /replay-assets/scene.js','replay/scene.js':'/replay-assets/vendor/three.module.js','replay/vendor/three.module.js':'vendor'}.items():(root/name).write_text(data)
   before=Assets(root);content=before.content('replay-assets/index.html')[0]
   (root/'site.js').write_text('portal two');after=Assets(root)
   for name in ('replay-assets/index.html','replay-assets/app.js','replay-assets/scene.js','assets/fonts/noto.css','assets/i18n.js'):self.assertEqual(before.url(name),after.url(name))
   self.assertEqual(content,after.content('replay-assets/index.html')[0])
   (root/'replay/scene.js').write_text('new renderer');changed=Assets(root);self.assertNotEqual(after.url('replay-assets/index.html'),changed.url('replay-assets/index.html'))
   (root/'fonts/a.woff2').write_text('new font');self.assertNotEqual(changed.url('assets/fonts/noto.css'),Assets(root).url('assets/fonts/noto.css'))
