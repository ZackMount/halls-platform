"""Build a self-contained private guide with matching site styles and fonts."""
from pathlib import Path
import zipfile,re,base64,shutil
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1];build=root/'build';build.mkdir(exist_ok=True)
guide=(root/'private-docs/api-guide.html').read_text()
class Text(HTMLParser):
 def __init__(self):super().__init__();self.text=''
 def handle_data(self,value):self.text+=value
parser=Text();parser.feed(guide);chars={ord(c) for c in parser.text};embedded=[]
for block in re.findall(r'@font-face\s*\{.*?\}',(root/'web/fonts/ui.css').read_text(),re.S):
 ranges=re.search('unicode-range:([^;}]+)',block).group(1)
 needed=any(any(int(b[0],16)<=c<=int(b[-1],16) for c in chars) for b in [p.strip()[2:].split('-') for p in ranges.split(',')])
 if needed:
  path=re.search(r'url\((.*?)\)',block).group(1);data=(root/'web'/path.removeprefix('/assets/')).read_bytes()
  embedded.append(block.replace(path,'data:font/woff2;base64,'+base64.b64encode(data).decode()))
guide=guide.replace('__UI_FONTS__','\n'.join(embedded)).replace('__SITE_CSS__',(root/'web/site-inline.css').read_text()).replace('__GUIDE_CSS__',(root/'web/api-guide.css').read_text())
guide=re.sub(r'<link[^>]+href="/assets/[^>]+>','',guide)
guide=guide.replace('href="/admin','href="http://127.0.0.1:8771/admin').replace('href="/api/admin','href="http://127.0.0.1:8771/api/admin')
html_path=build/'HALLS-API-Guide-2.0.html';html_path.write_text(guide)
archive=build/'HALLS-API-Guide-2.0.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 z.write(html_path,html_path.name);z.write(root/'private-docs/openapi.json','halls-openapi-3.1.json');z.write(root/'web/fonts/OFL.txt','FONT-LICENSE.txt')
shutil.copy2(archive,root/'private-docs'/archive.name)
print('Built private API guide:',archive.name)
