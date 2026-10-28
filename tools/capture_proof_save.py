#!/usr/bin/env python3
"""Render the real save_prompt UI with scripted keys and a demo export result.
Requires rustc and Pillow. No game binary or gameplay code is changed.
"""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--font',type=Path,default=Path('/System/Library/Fonts/Menlo.ttc'));p.add_argument('--client',type=Path,default=ROOT.parent/'halls-client');p.add_argument('--output',type=Path,default=ROOT/'output/guide-0102/proof-save');a=p.parse_args()
out=a.output;out.mkdir(parents=True,exist_ok=True)
source=(a.client/'src/proof.rs').read_text();prompt=source[source.index('pub fn save_prompt('):source.index('\n#[cfg(test)]',source.index('pub fn save_prompt('))]
harness=r'''
#![allow(dead_code,private_interfaces)]
mod error { pub type Result<T> = std::io::Result<T>; }
mod terminal {
 pub struct Terminal {pub frames:Vec<String>}
 impl Terminal {pub fn text_screen(&mut self,s:&str)->crate::error::Result<()>{self.frames.push(s.to_owned());Ok(())}pub fn key_releases(&self)->bool{true}}
}
mod event {
 use std::{collections::VecDeque,sync::{Mutex,OnceLock}};
 #[derive(PartialEq)] pub enum KeyCode {Char(char),Enter,Esc,Left,Right,Up,Down}
 #[derive(PartialEq)] pub enum KeyEventKind {Press,Release}
 pub struct KeyModifiers; impl KeyModifiers {pub const CONTROL:Self=Self;pub fn contains(&self,_:Self)->bool{false}}
 pub struct KeyEvent {pub code:KeyCode,pub kind:KeyEventKind,pub modifiers:KeyModifiers}
 pub enum Event {Key(KeyEvent),Resize}
 static KEYS:OnceLock<Mutex<VecDeque<Event>>>=OnceLock::new();
 pub fn setup(){let mut keys:VecDeque<_>="ZackMount".chars().map(|c|Event::Key(KeyEvent{code:KeyCode::Char(c),kind:KeyEventKind::Press,modifiers:KeyModifiers})).collect();
 for kind in [KeyEventKind::Press,KeyEventKind::Release,KeyEventKind::Press]{keys.push_back(Event::Key(KeyEvent{code:KeyCode::Enter,kind,modifiers:KeyModifiers}));}KEYS.set(Mutex::new(keys)).ok();}
 pub fn read()->crate::error::Result<Event>{Ok(KEYS.get().unwrap().lock().unwrap().pop_front().expect("scripted input exhausted"))}
}
struct Recording;impl Recording {fn export(&mut self,name:&str)->Result<(),i32>{assert_eq!(name,"ZackMount");Ok(())}}
fn valid_name(s:&str)->bool{!s.is_empty()}
'''+prompt+r'''
fn main()->std::io::Result<()>{event::setup();let mut terminal=terminal::Terminal{frames:vec![]};save_prompt(&mut terminal,&mut Recording,0)?;
 let folder=std::env::args().nth(1).unwrap();for(i,frame)in terminal.frames.iter().enumerate(){std::fs::write(format!("{folder}/{i:02}.txt"),frame)?;}Ok(())}
'''
(out/'capture.rs').write_text(harness)
subprocess.run(['rustc','--edition=2021','-O',str(out/'capture.rs'),'-o',str(out/'capture')],check=True)
subprocess.run([str(out/'capture'),str(out)],check=True)
texts=[f.read_text() for f in sorted(out.glob('*.txt'))];texts=list(dict.fromkeys(texts))
assert '> ZackMount.hproof' in texts[-1] and 'VICTORY PROOF SAVED' in texts[-1]
font=ImageFont.truetype(str(a.font),22);keyfont=ImageFont.truetype(str(a.font),20)
frames=[];durations=[]
def frame(text,duration,key=None,pressed=False):
 image=Image.new('RGB',(960,540),(15,17,18));draw=ImageDraw.Draw(image)
 for y,line in enumerate(text.replace('\r','').split('\n')):draw.text((20,20+y*37),line,font=font,fill=(223,224,217),stroke_width=0)
 if key:
  box=(750,429,906,486);draw.rectangle(box,fill=(220,210,160) if pressed else (26,28,27),outline=(220,210,160),width=2)
  draw.text((828,457),key,font=keyfont,anchor='mm',fill=(25,27,25) if pressed else (228,224,200))
 frames.append(image);durations.append(duration)
for i,text in enumerate(texts):
 if 'Signing and encrypting' in text:frame(text,360)
 elif 'VICTORY PROOF SAVED' in text:frame(text,2600)
 elif '> ZackMount.hproof' in text:
  frame(text,1000,'ENTER');frame(text,220,'ENTER',True)
 else:frame(text,1100 if i==0 else 170)
raw=out/'frames';raw.mkdir(exist_ok=True)
for i,im in enumerate(frames):im.save(raw/f'{i:03}.png')
(raw/'durations.json').write_text(json.dumps(durations))
frames[-1].save(out/'poster.png',optimize=True)
print(f'{len(frames)} frames, {sum(durations)/1000:.2f}s')
