#!/usr/bin/env python3
"""Fresh render frames -> lossless animated WebP, with moving fade-through-dark wraps.
Verify every decoded frame, including the whole transition, against the source.
"""
import argparse,json,bisect
from pathlib import Path
from PIL import Image,ImageChops
ROOT=Path(__file__).resolve().parents[1];MEDIA=ROOT/'web/media'
MASTERS=ROOT/'output/guide-fresh/lossless-masters';MASTERS.mkdir(parents=True,exist_ok=True)
p=argparse.ArgumentParser();p.add_argument('--frames',type=Path,default=ROOT/'output/guide-fresh/frames');a=p.parse_args()
results=[]
for name in ('exploration','walk','alert','attack','exit','proof-save'):
 if name=='proof-save':
  folder=ROOT/'output/proof-save/frames';paths=sorted(folder.glob('*.png'));original=[Image.open(path).convert('RGB') for path in paths];lengths=json.loads((folder/'durations.json').read_text());total=sum(lengths);ends=[];clock=0
  for d in lengths:clock+=d;ends.append(clock)
  durations=[min(50,total-t) for t in range(0,total,50)]
  frames=[original[bisect.bisect_right(ends,t)].copy() for t in range(0,total,50)]
  still=original[-1]
 else:
  paths=sorted((a.frames/name).glob('*.ppm'));assert paths,name
  if name=='exploration':assert len(paths)==600
  frames=[Image.open(path).convert('RGB') for path in paths];durations=[50]*len(frames);total=sum(durations);still=frames[0]
  if name in ('exit','attack'):
   marker='exit-won-frame.txt' if name=='exit' else 'attack-dead-frame.txt'
   ended=int((a.frames/marker).read_text());assert len(frames)-ended>=40
   for i in range(ended+1,len(frames)):
    assert ImageChops.difference(frames[i-1],frames[i]).getbbox(),f'{name} froze at frame {i}'
 still.save(MEDIA/f'{name}.png',optimize=True)
 dark=Image.new('RGB',frames[0].size,(15,17,18));clock=0
 for i,duration in enumerate(durations):
  t=max(0,min(clock/400,(total-clock-duration)/400,1));alpha=t*t*(3-2*t)
  if alpha<1:frames[i]=Image.blend(dark,frames[i],alpha)
  clock+=duration
 target=MASTERS/f'{name}-smooth.webp'
 frames[0].save(target,save_all=True,append_images=frames[1:],duration=durations,loop=0,lossless=True,method=4,minimize_size=False,kmin=9,kmax=17)
 if name=='proof-save':frames[0].save(MASTERS/'proof-save-smooth.gif',save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=True,disposal=2)
 check=Image.open(target);actual=0;expected=0;expected_end=durations[0]
 for i in range(check.n_frames):
  check.seek(i);check.load();decoded=check.convert('RGB');end=actual+check.info['duration']
  while expected<len(frames) and actual<end:
   assert ImageChops.difference(decoded,frames[expected]).getbbox() is None,(name,'pixel mismatch',i,expected)
   actual=min(end,expected_end)
   if actual==expected_end:
    expected+=1
    if expected<len(frames):expected_end+=durations[expected]
 assert actual==total and expected==len(frames),(name,actual,total,expected)
 if name=='exploration':assert total==30000
 assert ImageChops.difference(frames[0],frames[-1]).getbbox() is None
 results.append({'name':name,'frames':check.n_frames,'milliseconds':actual,'bytes':target.stat().st_size,'decodedPixels':'exact'})
 print(results[-1],flush=True)
(ROOT/'output/guide-fresh/manifest.json').write_text(json.dumps(results,indent=2))
