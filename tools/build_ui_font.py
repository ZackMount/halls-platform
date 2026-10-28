"""Subset Noto Sans SC 2.004 by rendered UI use; rare names retain full fallback."""
import argparse,hashlib,json,re
from html.parser import HTMLParser
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://raw.githubusercontent.com/notofonts/noto-cjk/Sans2.004/Sans/Variable/TTF/Subset/NotoSansSC-VF.ttf'
class Text(HTMLParser):
 def __init__(self):super().__init__();self.value=''
 def handle_data(self,text):self.value+=text

def codes(text):return {ord(c) for c in re.sub(r'\\u([0-9a-fA-F]{4})',lambda m:chr(int(m[1],16)),text)}
def css_range(values):
 groups=[]
 for value in sorted(values):
  if groups and value==groups[-1][1]+1:groups[-1][1]=value
  else:groups.append([value,value])
 return ','.join(f'U+{a:X}'+(f'-{b:X}' if a!=b else '') for a,b in groups)

def build(source):
 texts=[p.read_text() for root in (ROOT/'web',ROOT/'templates') for p in root.rglob('*') if p.suffix in ('.html','.js') and 'vendor' not in p.parts and not p.name.endswith('-entry.js')]
 parser=Text();parser.feed((ROOT/'web/index.html').read_text()+(ROOT/'web/home-content.html').read_text())
 common=codes(parser.value+'载入中…正在载入回放…回放玩家暂时无法打开游戏下载暂未开放暂无可用下载暂未开放回放预览')|set(range(32,256))
 public=(ROOT/'web/site.js').read_text().split('async function admin(')[0]+(ROOT/'web/replay/app.js').read_text()+(ROOT/'web/replay/index.html').read_text()+(ROOT/'public_report.py').read_text()
 public+=''.join(p.read_text() for p in (ROOT/'templates').glob('*.html') if not p.name.startswith('admin-'))
 guide=(ROOT/'web/about-content.html').read_text()
 api_text=Text();api_text.feed((ROOT/'private-docs/api-guide.html').read_text())
 groups=[('ui',common),('ui-pages',codes(public)),('ui-guide',codes(guide)),('ui-admin',codes(''.join(texts))),('ui-api',codes(api_text.value))];covered=set();css=[];info=[]
 for name,values in groups:
  font=TTFont(source,recalcTimestamp=False);values=(values&font.getBestCmap().keys())-covered;covered|=values
  if not values:continue
  options=subset.Options();options.layout_features=['*'];options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
  cutter=subset.Subsetter(options);cutter.populate(unicodes=values);cutter.subset(font)
  for record in font['name'].names:
   value={1:'HALLS UI Sans',3:'HALLS-UI-Sans-2.004',4:'HALLS UI Sans',6:'HALLSUISans',16:'HALLS UI Sans',25:'HALLSUISans'}.get(record.nameID)
   if value:record.string=value.encode(record.getEncoding())
  font.flavor='woff2';target=ROOT/f'web/fonts/{name}.woff2';font.save(target)
  css.append('@font-face{font-family:"Noto Sans SC";font-style:normal;font-weight:100 900;font-display:swap;src:url(/assets/fonts/'+name+'.woff2) format("woff2");unicode-range:'+css_range(values)+'}')
  info.append({'file':target.name,'glyphs':len(values),'bytes':target.stat().st_size});print(info[-1])
 (ROOT/'web/fonts/ui.css').write_text('\n'.join(css)+'\n')
 (ROOT/'web/fonts/ui-source.json').write_text(json.dumps({'source':SOURCE,'sha256':hashlib.sha256(Path(source).read_bytes()).hexdigest(),'subsets':info,'license':'OFL.txt'},indent=2)+'\n')
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);build(parser.parse_args().source)
