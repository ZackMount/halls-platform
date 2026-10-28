"""Publish render-only packets to a separate anonymous CDN namespace."""
import fcntl,gzip,hashlib,json,os,shutil,struct,tempfile
from pathlib import Path
from visual_codec import HEADER,CHUNK_SIZE

CACHE_CONTROL='no-store'
CDN_CACHE_CONTROL='public, max-age=60'
class CapacityError(Exception):pass

def size(folder):return sum(p.stat().st_size for p in Path(folder).rglob('*') if p.is_file())

def export(folder,budget=None):
 folder=Path(folder)
 with (folder/'cdn.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  # Read only the fixed header; do not decode all replay timestamps on page load.
  with gzip.open(folder/'init.hvi.gz','rb') as source:
   envelope=struct.unpack('<4sII',source.read(12));header=HEADER.unpack(source.read(HEADER.size))
  if envelope[0]!=b'HVI5' or header[0]!=b'HVM5' or not 1<=header[5]<=200000:raise ValueError('Invalid visual header')
  count=(header[5]+CHUNK_SIZE-1)//CHUNK_SIZE
  sources=[('manifest.bin',folder/'init.hvi.gz')]+[(f'{i}.bin',folder/f'{i}.hvc.gz') for i in range(1,count)]
  stamp=[[name,p.stat().st_size,p.stat().st_mtime_ns] for name,p in sources]
  root=folder/'cdn';catalog=root/'catalog.json'
  if catalog.exists():
   info=json.loads(catalog.read_text())
   if info['stamp']==stamp and all((root/info['revision']/name).is_file() for name,_ in sources):return info['revision']
  if budget is not None and sum(item[1] for item in stamp)+len(json.dumps(stamp))+256>budget:raise CapacityError()
  root.mkdir(exist_ok=True)
  stage=Path(tempfile.mkdtemp(prefix='.building-',dir=root));h=hashlib.sha256()
  try:
   for name,source in sources:
    h.update(name.encode()+b'\0')
    with source.open('rb') as inp,(stage/name).open('wb') as out:
     while chunk:=inp.read(131072):h.update(chunk);out.write(chunk)
   revision=h.hexdigest();destination=root/revision
   if destination.exists():shutil.rmtree(stage)
   else:os.replace(stage,destination)
   pending=root/'catalog.next';pending.write_text(json.dumps({'revision':revision,'stamp':stamp},separators=(',',':')));os.replace(pending,catalog)
   for old in root.iterdir():
    if old.is_dir() and old!=destination:shutil.rmtree(old)
   return revision
  finally:
   if stage.exists():shutil.rmtree(stage)

def withdraw(folder):
 # Fresh origin reads stop immediately; already-public CDN copies expire in 60s.
 root=Path(folder)/'cdn'
 if root.exists():shutil.rmtree(root)
