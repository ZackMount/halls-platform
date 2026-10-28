#!/usr/bin/env python3
"""Build and attest the small native visibility-graph solver on the target host."""
import hashlib,json,os,platform,shlex,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def build():
 source=ROOT/'engine/race_exact.cpp';arch=platform.machine().lower();arch={'amd64':'x86_64','aarch64':'arm64'}.get(arch,arch)
 name='race-exact-'+platform.system().lower()+'-'+arch+('.exe' if os.name=='nt' else '')
 target=ROOT/'engine/model'/name;target.parent.mkdir(parents=True,exist_ok=True)
 temp=target.with_suffix('.building');subprocess.run([*shlex.split(os.environ.get('CXX','c++')),'-O3','-std=c++17',str(source),'-o',str(temp)],check=True)
 temp.replace(target)
 target.with_suffix(target.suffix+'.json').write_text(json.dumps({'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'binarySha256':hashlib.sha256(target.read_bytes()).hexdigest()}))
 print(target)
if __name__=='__main__':build()
