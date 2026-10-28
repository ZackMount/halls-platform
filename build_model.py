"""Build version-isolated HLR4 / HLR5 adjudicators without client signing keys.

--sync-client copies only gameplay dependency modules. Normal builds use the
checked-in snapshots; older signed builds never use the mutable current snapshot.
"""
import argparse,hashlib,json,os,platform,subprocess,time
from pathlib import Path

ROOT=Path(__file__).resolve().parent
CURRENT_FILES=('battery.rs','bitmap.rs','coins.rs','entity.rs','entity_model.hvm','entity_program.rs','entity_vm.s','error.rs','game.rs','math.rs','math_x87.rs','mesh.rs','player.rs','runtime.rs','world.rs','map_generator.rs','map_grammar.rs','map_file.rs','lighting.rs')
MODEL_SOURCES=(
 ('native','judge',(0xa0000,0xa0001,0xa0002)),
 ('native-v11','judge-v11',(0xb0000,0xb0001)),
 ('native-v113','judge-v113',(0xb0002,0xb0003)),
 ('native-current','judge-current',(0x01000000,0x01000001)),
)


def sync_client(client):
 source=Path(client).resolve();folder=ROOT/'native-current';hashes={}
 for name in CURRENT_FILES:
  data=(source/'src'/name).read_bytes();(folder/'src'/name).write_bytes(data);hashes['src/'+name]=hashlib.sha256(data).hexdigest()
 try:revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=source,text=True).strip()
 except (OSError,subprocess.CalledProcessError):revision=None
 (folder/'source-manifest.json').write_text(json.dumps({'build':'0x01000000','clientRevision':revision,'files':hashes},indent=2)+'\n')


def source_hash(crate):
 h=hashlib.sha256()
 for path in sorted((crate/'src').rglob('*')):
  if path.is_file():h.update(str(path.relative_to(crate)).encode()+b'\0'+path.read_bytes())
 for rel in ('examples/judge_model.rs','Cargo.toml','Cargo.lock','build.rs'):
  h.update(rel.encode()+b'\0'+(crate/rel).read_bytes())
 return h.hexdigest()


def install(folder,pending):
 # Concurrent architecture builds may finish together. Lock only installation,
 # then merge the latest manifest so one platform cannot erase another's entry.
 lock=folder/'.build-lock';deadline=time.monotonic()+120
 while True:
  try:lock.mkdir();break
  except FileExistsError:
   if time.monotonic()>=deadline:raise RuntimeError('Native manifest installation lock timed out')
   time.sleep(.2)
 try:
  manifest=folder/'manifest.json';data=json.loads(manifest.read_text()) if manifest.exists() else {}
  for name,binary,entry in pending:
   temporary=folder/(name+'.tmp-'+str(os.getpid()));temporary.write_bytes(binary);temporary.chmod(0o755);temporary.replace(folder/name);data[name]=entry
  temporary=folder/('manifest.json.tmp-'+str(os.getpid()));temporary.write_text(json.dumps(data,indent=2)+'\n');temporary.replace(manifest)
 finally:lock.rmdir()


def build(only=None,target_root=None):
 system=platform.system().lower();arch=platform.machine().lower()
 if system=='linux':arch={'amd64':'x86_64','arm64':'aarch64'}.get(arch,arch)
 folder=ROOT/'engine/model';folder.mkdir(exist_ok=True,parents=True);pending=[]
 for source,family,builds in MODEL_SOURCES:
  if only and family not in only:continue
  crate=ROOT/source;target=(Path(target_root).resolve()/source) if target_root else crate/'target'
  fingerprint=source_hash(crate)
  subprocess.run(['cargo','build','--target-dir',str(target),'--release','--locked','--features','tools','--example','judge_model'],cwd=crate,check=True)
  if source_hash(crate)!=fingerprint:raise RuntimeError('Native source changed during compilation: '+source)
  extension='.exe' if system=='windows' else '';name=f'{family}-{system}-{arch}'+extension
  binary=(target/('release/examples/judge_model'+extension)).read_bytes()
  pending.append((name,binary,{'sha256':hashlib.sha256(binary).hexdigest(),'sourceHash':fingerprint,'protocol':'HJM2','build':f'0x{builds[-1]:08x}','supportedBuilds':[f'0x{n:08x}' for n in builds]}))
 install(folder,pending)


if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--sync-client',type=Path);parser.add_argument('--sync-only',action='store_true')
 parser.add_argument('--only',choices=[item[1] for item in MODEL_SOURCES],action='append')
 parser.add_argument('--target-root',type=Path,help='Separate Cargo outputs for cross-platform/container builds')
 args=parser.parse_args()
 if args.sync_client:sync_client(args.sync_client)
 if not args.sync_only:build(args.only,args.target_root)
