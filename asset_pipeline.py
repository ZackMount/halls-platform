"""Version public assets independently from private APIs and proof storage."""
import hashlib,json,mimetypes,re,gzip
from pathlib import Path
TEXT={'.js','.css','.html','.svg','.json'}
class Assets:
 def __init__(self,web):
  self.web=Path(web)
  shell=self.web/'replay/index.html';frame=self.web/'replay/frame.html'
  if shell.is_file() and frame.is_file() and frame.read_text()!=shell.read_text().replace('class="replay-page"','class="replay-page parked"'):
   raise ValueError('Embedded replay page is stale; run tools/build_web.mjs before publishing assets.')
  self.check_build()
  self.files={str(p.relative_to(self.web)):p for p in sorted(self.web.rglob('*')) if p.is_file() and p.suffix!='.pyc' and all(not part.startswith('.') for part in p.relative_to(self.web).parts)}
  h=hashlib.sha256();self.digests={}
  for name,p in self.files.items():
   data=p.read_bytes();h.update(name.encode()+b'\0'+data);self.digests[name]=hashlib.sha256(data).hexdigest()
  self.version=h.hexdigest()[:16];self.prefix='/static/'+self.version;self.memo={}
  vendor=[name for name in self.files if name.startswith('replay/vendor/')]
  self.vendor_version=hashlib.sha256(''.join(self.digests[name] for name in vendor).encode()).hexdigest()[:16]
  fonts=[name for name in self.files if name.startswith('fonts/')]
  self.font_version=hashlib.sha256(''.join(name+self.digests[name] for name in fonts).encode()).hexdigest()[:16]
  replay=[name for name in self.files if name.startswith('replay/') and not name.startswith('replay/vendor/')]
  self.replay_version=hashlib.sha256((''.join(name+self.digests[name] for name in replay)+self.vendor_version+self.font_version+self.digests.get('i18n.js','')).encode()).hexdigest()[:16]
 def check_build(self):
  # Verify bundled assets match their sources before publication.
  generated=('site-entry.js','replay/replay-entry.js','site-inline.css')
  if not any((self.web/name).is_file() for name in generated):return
  try:
   manifest=json.loads((self.web/'.build-manifest.json').read_text())
   if manifest['version']!=1:raise ValueError('Unknown web build manifest')
   for name in generated:
    if (self.web/name).is_file() and name not in manifest['artifacts']:raise ValueError('Missing web build artifact')
   for name,artifact in manifest['artifacts'].items():
    for relative,expected in {name:artifact['sha256'],**artifact['inputs']}.items():
     path=Path(relative)
     if path.is_absolute() or '..' in path.parts or hashlib.sha256((self.web/path).read_bytes()).hexdigest()!=expected:raise ValueError('Web build hash mismatch')
  except (OSError,ValueError,KeyError,TypeError) as error:
   raise ValueError('Web bundles are stale or unverified; run tools/build_web.mjs before publishing assets.') from error
 def resource_version(self,name):
  p=self.source(name)
  if p is None:return self.version
  relative=str(p.relative_to(self.web))
  if relative.startswith('replay/vendor/'):return self.vendor_version
  if relative.startswith('replay/'):return self.replay_version
  if relative.startswith('fonts/') and p.suffix=='.css':return self.font_version
  if relative=='i18n.js':return self.digests[relative][:16]
  if p.suffix in {'.mp4','.woff2','.png','.webp','.gif','.svg'} or relative=='no-prefetch.json':return self.digests[relative][:16]
  return self.version
 def url(self,name):return '/static/'+self.resource_version(name)+'/'+name
 def rewrite(self,text):
  return re.sub(r'/(assets|replay-assets)/([A-Za-z0-9_./-]*)',lambda m:self.url(m.group(1)+'/'+m.group(2)),text)
 def source(self,name):
  if name=='shell.html':return self.web/'index.html'
  if name.startswith('assets/'):return self.files.get(name[7:])
  if name.startswith('replay-assets/'):return self.files.get('replay/'+name[14:])
 def content(self,name):
  if name=='preload.json':return json.dumps(self.preload()).encode(),'application/json'
  p=self.source(name)
  if p is None:return None,None
  if p.suffix in TEXT:
   if name not in self.memo:
    text=p.read_text()
    if name=='shell.html':
     for marker,file in [('__UI_FONTS__','fonts/ui.css'),('__SITE_CSS__','site-inline.css')]:
      if file in self.files:text=text.replace(marker,self.files[file].read_text())
    self.memo[name]=self.rewrite(text).encode()
   return self.memo[name],mimetypes.guess_type(p.name)[0] or 'text/plain'
  return p.read_bytes(),mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
 def preload(self):
  # Guide preloading is initiated from its actual DOM, never from other pages.
  return []
 def media_map(self):
  needed={'media/menu.png','favicon.svg'}
  for page in ('about-content.html','about-content.en.html'):
   if page in self.files:needed.update(re.findall(r'/assets/(media/[^"\s]+)',self.files[page].read_text()))
  result={}
  for name,p in self.files.items():
   if p.suffix=='.woff2' or name in needed or name.startswith('replay/vendor/'):
    route='replay-assets/'+name[7:] if name.startswith('replay/') else 'assets/'+name
    result[route]={'url':self.url(route),'sha256':self.digests[name]}
  return result
 def build(self,destination):
  target=Path(destination)/self.version;target.mkdir(parents=True,exist_ok=True)
  names=['shell.html','preload.json']+['assets/'+name for name in self.files if not name.startswith('replay/')] + ['replay-assets/'+name[7:] for name in self.files if name.startswith('replay/')]
  for name in names:
   data,mime=self.content(name);p=target/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
   if p.suffix in TEXT and len(data)>1024:p.with_name(p.name+'.gz').write_bytes(gzip.compress(data,compresslevel=9,mtime=0))
   stable=self.url(name)
   if stable.startswith('/static/') and not stable.startswith(self.prefix+'/'):
    other=Path(destination)/stable.removeprefix('/static/');other.parent.mkdir(parents=True,exist_ok=True)
    if other.exists():continue
    other.write_bytes(data)
    if other.suffix in TEXT and len(data)>1024:other.with_name(other.name+'.gz').write_bytes(gzip.compress(data,compresslevel=9,mtime=0))
  return target
if __name__=='__main__':
 import sys
 print(Assets(Path(__file__).parent/'web').build(sys.argv[1]))
