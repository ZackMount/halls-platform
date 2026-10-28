#!/usr/bin/env python3
"""Read-only proof/model preflight. Never imports the store or creates DB records.

Use the release's Python environment and worker HALLS_KEY environment. Production
proofs use all rules by default. --developer-fixtures is only for the intentionally
modified-exit, accelerated-clock short course; it is not ranked-score approval.
"""
import argparse,json,os,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'engine'))
from codec import decode
from judge import adjudicate,defaults


def preflight(path,key=None,trust=None,settings=None,developer_fixture=False,model_runner=None):
 meta,frames=decode(Path(path).read_bytes(),key,trust)
 if developer_fixture and not meta.get('testFixture'):
  raise ValueError('--developer-fixtures requires a signed developer-fixture flag')
 if settings is None:settings=defaults(meta)
 settings=json.loads(json.dumps(settings))
 if developer_fixture:
  for name in ('production','exit','time_sources','speed_control'):
   settings.setdefault(name,{})['enabled']=False
  settings.setdefault('input',{}).setdefault('params',{})['exact_keys']=0
 report=adjudicate(meta,frames,settings,**({'model_runner':model_runner} if model_runner else {}))
 unavailable=[r['id'] for r in report['rules'] if r['status']=='inconclusive']
 summary={'path':str(path),'authenticated':True,'version':meta['version'],'recordingBuild':meta['recordingBuild'],'entities':meta['entities'],'words':meta['words'],'recordWords':meta['recordWords'],'frames':meta['frames'],'model':report['engine'],'verdict':report['verdict'],'failed':report['failed'],'unavailable':unavailable,'modelMaxErrors':{r['id']:r['maxError'] for r in report['rules'] if r['id'] in ('spawn','player_model','entity_motion','entity_ai','combat','camera')},'effectiveSpeeds':{'walk':report['policy']['player_speed']['params']['walk'],'run':report['policy']['player_speed']['params']['run'],'chase':report['policy']['entity_speed']['params']['maximum']},'scope':'developer short course; modified exit and synthetic capture clocks excluded' if developer_fixture else 'authenticated proof with configured policy','readOnly':True}
 return summary,bool(report['engine'] and not report['failed'] and not unavailable)


def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('proofs',type=Path,nargs='+');parser.add_argument('--key',type=Path,default=os.environ.get('HALLS_KEY'));parser.add_argument('--trust',type=Path,default=os.environ.get('HALLS_TRUST'));parser.add_argument('--developer-fixtures',action='store_true')
 source=parser.add_mutually_exclusive_group();source.add_argument('--policy-file',type=Path);source.add_argument('--legacy-default-policy',action='store_true')
 args=parser.parse_args();settings=None
 if args.policy_file:
  settings=json.loads(args.policy_file.read_text());settings=settings.get('judge',settings)
 elif args.legacy_default_policy:settings=defaults({'recordingBuild':0xa0002})
 results=[];ok=True
 for path in args.proofs:
  try:
   summary,passed=preflight(path,args.key,args.trust,settings,args.developer_fixtures);results.append(summary);ok=ok and passed
  except Exception as exc:results.append({'path':str(path),'passed':False,'errorType':type(exc).__name__,'error':str(exc),'readOnly':True});ok=False
 print(json.dumps({'passed':ok,'proofs':results,'readOnly':True},ensure_ascii=False,indent=2))
 return 0 if ok else 1

if __name__=='__main__':raise SystemExit(main())
