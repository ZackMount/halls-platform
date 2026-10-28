"""Subset only KOH UI fonts; regenerate from the full public website copies.

Requires fontTools with WOFF2 support during authoring, never inside the image.
Player names outside these interface characters use the browser's system fallback.
"""
import re
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT=Path(__file__).resolve().parents[1]
KOH=ROOT/'koh'
inputs=[KOH/'app.py',KOH/'remote.py',KOH/'web/app.js',KOH/'web/index.html',ROOT/'competition.py',ROOT/'competition_receipts.py']
characters=set(range(32,127))
for path in inputs:characters.update(map(ord,path.read_text()))
original=ROOT/'web/fonts'
css=(original/'noto.css').read_text()
# Main-site CSS uses the same original font files but a different asset prefix.
css=css.replace('/assets/fonts/','/web/fonts/').replace('/fonts/','/web/fonts/')
# Normalize the already KOH-prefixed variant when the main site changes prefixes.
css=css.replace('/web/web/fonts/','/web/fonts/')
blocks=[];before=after=0;covered=set();kept=set()
for block in re.findall(r'@font-face\s*\{[^}]+\}',css):
 match=re.search(r'url\([^)]*?([^/()]+\.woff2)\)',block)
 if match is None:raise ValueError('Font source missing')
 declared=set()
 for value in re.search(r'unicode-range:\s*([^;]+);',block).group(1).split(','):
  parts=value.strip()[2:].split('-');first=int(parts[0],16);last=int(parts[-1],16)
  declared.update(range(first,last+1))
 if not characters&declared:continue
 name=match.group(1);source=original/name;font=TTFont(source,recalcTimestamp=False)
 wanted=characters&declared&set(font.getBestCmap());before+=source.stat().st_size
 options=subset.Options();options.recalc_timestamp=False
 worker=subset.Subsetter(options=options);worker.populate(unicodes=wanted);worker.subset(font)
 target=KOH/'web/fonts'/name;font.save(target);after+=target.stat().st_size;kept.add(name)
 retained=set(font.getBestCmap());covered.update(retained)
 ranges=', '.join('U+'+format(value,'X') for value in sorted(retained))
 block=re.sub(r'url\([^)]*\.woff2\)',f'url(/web/fonts/{name})',block)
 block=re.sub(r'unicode-range:\s*[^;]+;',f'unicode-range: {ranges};',block)
 blocks.append(block)
assert blocks
for path in (KOH/'web/fonts').glob('*.woff2'):
 if path.name not in kept:path.unlink()
(KOH/'web/fonts/noto.css').write_text('\n'.join(blocks)+'\n')
original_coverage=set()
for path in original.glob('*.woff2'):original_coverage.update(TTFont(path).getBestCmap())
missing=(characters&original_coverage)-covered
assert not missing,missing
print(f'KOH fonts {before} -> {after} bytes; {len(characters&original_coverage)} UI codepoints retained.')
