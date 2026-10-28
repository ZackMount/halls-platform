#!/usr/bin/env python3
"""Build media against the current client, never the frozen judge model."""
import argparse,hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--client',type=Path,default=ROOT.parent/'halls-client');p.add_argument('--output',type=Path,default=ROOT/'output/guide-0102');p.add_argument('--only',default='all');p.add_argument('--preview',action='store_true');a=p.parse_args()
client=a.client.resolve();project=a.output/'capture-project';source=project/'src';source.mkdir(parents=True,exist_ok=True)
(project/'Cargo.toml').write_text('[package]\nname="halls-guide-capture"\nversion="0.1.0"\nedition="2024"\n[dependencies]\nhalls={path='+json.dumps(str(client))+',features=["tools"]}\n[profile.release]\nopt-level=3\nlto="thin"\ncodegen-units=1\n')
(source/'main.rs').write_text((ROOT/'tools/guide_scenes.rs').read_text())
# Use the exact production footer formatter; only its output sink is replaced.
terminal=(client/'src/terminal.rs').read_text();start=terminal.index('        // Each run specifies');end=terminal.index('        self.out.flush()?;',start)
footer=terminal[start:end];assert 'padded_number(percent' in footer
start=terminal.index('    fn cursor(');end=terminal.index('    pub fn present(',start);cursor=terminal[start:end]
(source/'hud.rs').write_text('use halls::console::Buffer;\npub struct Hud{out:Buffer}\nimpl Hud{\n'+cursor+'\npub fn capture(w:usize,footer:&str,charge:f32,on:bool)->String{let mut hud=Self{out:Buffer::default()};hud.draw(w,footer,Some((charge,on)))}\nfn draw(&mut self,w:usize,footer:&str,battery:Option<(f32,bool)>)->String{let rows=0;\n'+footer+'\nstd::mem::take(&mut self.out).into_text()\n}\n}\n')
frames=a.output/('preview' if a.preview else 'frames');frames.mkdir(parents=True,exist_ok=True)
command=['cargo','run','--manifest-path',str(project/'Cargo.toml'),'--release','--',str(frames),a.only]
if a.preview:command.append('--preview')
subprocess.run(command,check=True,cwd=ROOT)
files=['src/render.rs','src/mesh.rs','src/entity.rs','src/battery.rs','src/terminal.rs']
info={'client':str(client),'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=client,text=True).strip(),'version':next(line.split('"')[1]for line in (client/'Cargo.toml').read_text().splitlines()if line.startswith('version =')),'sha256':{f:hashlib.sha256((client/f).read_bytes()).hexdigest()for f in files},'renderer':'halls::render::Renderer','fps':24,'resolution':[960,540],'supersampling':1,'flashlightSpeed':1,'note':'Demonstration staging and cameras; production geometry, lighting, animation, battery and footer formatter.'}
(a.output/'provenance.json').write_text(json.dumps(info,indent=2))
