"""Reproducible source bundle: no keys, passwords, proofs, databases or demo data."""
from pathlib import Path
import hashlib,json,tarfile,zipfile
ROOT=Path(__file__).resolve().parent;DEST=ROOT.parent/'build';DEST.mkdir(exist_ok=True)
paths=[]
for p in ROOT.rglob('*'):
 if not p.is_file() or p.name=='.DS_Store':continue
 rel=p.relative_to(ROOT)
 if any(x in {'.venv','data','secrets','output','__pycache__','.git','target','downloads'} for x in rel.parts):continue
 if rel.parts[:2]==('engine','model'):continue
 if p.suffix in {'.pem','.hproof','.sqlite3','.pyc'}:raise RuntimeError('Unexpected private file '+str(rel))
 paths.append(p)
name='HALLS-Records-1.0.0'
with zipfile.ZipFile(DEST/(name+'-source.zip'),'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(paths):z.write(p,Path(name)/p.relative_to(ROOT))
with tarfile.open(DEST/(name+'-source.tar.gz'),'w:gz',compresslevel=9) as tar:
 for p in sorted(paths):tar.add(p,arcname=str(Path(name)/p.relative_to(ROOT)),recursive=False)
for p in [DEST/(name+'-source.zip'),DEST/(name+'-source.tar.gz')]:print(p,p.stat().st_size,hashlib.sha256(p.read_bytes()).hexdigest())
