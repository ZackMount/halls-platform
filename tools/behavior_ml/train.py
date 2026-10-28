#!/usr/bin/env python3
"""Fit portable forests from authenticated caches and organizer-confirmed labels."""
import argparse,hashlib,json,platform,struct,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path[:0]=[str(ROOT/'engine'),str(ROOT)]
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import sklearn
from behavior_features import FEATURES,SCHEMA,extract,eligible_windows
from behavior_model import predict,suspicion
from timing import ClockSamples
from tools.behavior_ml.augmentation import PULSE_PROFILES,pulse_projection,tempo_style
from tools.behavior_ml.synthetic import FAMILIES,generate

CONFIG={'held':{'max_depth':5,'min_samples_leaf':4,'recorded_mass':.75},
        'pulse':{'max_depth':5,'min_samples_leaf':4,'recorded_mass':.9}}
TREES=160

class Rows:
 def __init__(self,data,words,kind='f'):self.data=data;self.item=struct.Struct('<'+str(words)+kind)
 def __len__(self):return len(self.data)//self.item.size
 def __getitem__(self,i):return self.item.unpack_from(self.data,i*self.item.size)

def eligible(windows):return eligible_windows(windows)
def aggregate(predictions,operating_point=.9):
 return None if len(predictions)<3 else round(suspicion(sorted(predictions,reverse=True)[2],operating_point),2)

def fit(samples,seed,config):
 x=np.asarray([s['values'] for s in samples]);y=np.asarray([s['label'] for s in samples]);groups={}
 for s in samples:groups[s['group']]=groups.get(s['group'],0)+1
 # Balance classes, then source domains, then recordings. Extra synthetic seeds
 # and human projections cannot drown out independently labeled recordings.
 weights=np.array([1/groups[s['group']] for s in samples]);kinds=np.array(['human' if not s['label'] else s['kind'] for s in samples])
 masses={'human':1.,'recorded_bot':config['recorded_mass'],'synthetic_bot':1-config['recorded_mass']}
 bot_mass=sum(v for k,v in masses.items() if k!='human' and (kinds==k).any())
 for kind,mass in masses.items():
  mask=kinds==kind
  if mask.any():weights[mask]*=mass/weights[mask].sum()/(bot_mass if kind!='human' else 1.)
 assert abs(weights[y==0].sum()-weights[y==1].sum())<1e-9
 model=RandomForestClassifier(n_estimators=TREES,max_depth=config['max_depth'],min_samples_leaf=config['min_samples_leaf'],max_features=.75,random_state=seed,n_jobs=-1)
 model.fit(x,y,sample_weight=weights);return model

def export_head(model,operating_point):
 trees=[]
 for estimator in model.estimators_:
  t=estimator.tree_;tree=[]
  for i in range(t.node_count):
   value=t.value[i,0];prob=float(value[1]/sum(value))
   tree.append([int(t.feature[i]),float(t.threshold[i]),int(t.children_left[i]),int(t.children_right[i]),prob])
  trees.append(tree)
 return {'operatingPoint':operating_point,'trees':trees}

def evaluate(model,records,operating_point=.9):
 results=[]
 for record in records:
  windows=eligible(record['windows'])
  probabilities=model.predict_proba(np.asarray([w['values'] for w in windows]))[:,1].tolist() if windows else []
  results.append({k:record[k] for k in ('id','label','family')}|{'windows':len(windows),'score':aggregate(probabilities,operating_point),'supports':probabilities})
 return results

def probes(record):
 transformed=tempo_style(record['windows'],record['id'])
 return [record]+[{**record,'windows':transformed[style::10]} for style in range(10)]

def human_calibration(samples,records,config,seed):
 results=[]
 for ident in sorted({r['id'] for r in records}):
  # Exactly the same source balance and bot population as the final fit; only
  # the complete held-out human group (including every projection) is removed.
  model=fit([s for s in samples if s['group']!=ident],seed,config)
  for record in records:
   if record['id']==ident:results.extend(evaluate(model,probes(record)))
 maximum=max((sorted(r['supports'],reverse=True)[2] for r in results if len(r['supports'])>=3),default=0.)
 point=max(.9,maximum+.02)
 if point>.99:raise RuntimeError('Human calibration leaves no safe operating range')
 for r in results:r['score']=aggregate(r['supports'],point)
 return point,maximum,results

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--records',type=Path,required=True);parser.add_argument('--labels',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);parser.add_argument('--report',type=Path,required=True);parser.add_argument('--parity-output',type=Path);parser.add_argument('--seed',type=int,default=20261023);parser.add_argument('--per-family',type=int,default=24);args=parser.parse_args()
 started=time.monotonic();labels=json.loads(args.labels.read_text());records=[];human_records={'held':[],'pulse':[]};raw_hash=hashlib.sha256()
 for ident,label in labels.items():
  meta=json.loads((args.records/(ident+'.meta.json')).read_text());raw=(args.records/(ident+'.frames')).read_bytes();raw_hash.update(hashlib.sha256(raw).digest());raw_hash.update(json.dumps(meta,sort_keys=True).encode());raw_hash.update(json.dumps(label,sort_keys=True).encode())
  rows,keys,clocks=Rows(raw,meta['words']),Rows(raw,meta['words'],'I'),ClockSamples(meta)
  record={'id':ident,**label,'inputMode':meta['inputMode'],'windows':eligible(extract(rows,keys,clocks))};records.append(record)
  if label['label']==0 and not label.get('holdout'):
   human_records[meta['inputMode']].append(record)
   if meta['inputMode']=='held':
    for delay,period in PULSE_PROFILES:
     for last_key in (False,True):
      projected=pulse_projection(rows,keys,clocks,delay,period,last_key,args.seed)
      human_records['pulse'].append({**record,'inputMode':'pulse','projection':[delay,period,last_key],'windows':eligible(projected)})
 print('recorded',len(records),'confirmed_humans',sum(r['label']==0 for r in records),'confirmed_bots',sum(r['label']==1 for r in records),flush=True)
 synthetics={'held':[],'pulse':[]}
 for family_index,family in enumerate(FAMILIES):
  for index in range(args.per_family):
   seed=args.seed+family_index*10000+index;rows,keys,clocks=generate(family,seed);group=f'synthetic:{family}:{seed}'
   base={'id':group,'family':family,'label':1,'test':index>=args.per_family*3//4}
   synthetics['held'].append({**base,'windows':eligible(extract(rows,keys,clocks))})
   delay,period=PULSE_PROFILES[index%len(PULSE_PROFILES)]
   synthetics['pulse'].append({**base,'windows':eligible(pulse_projection(rows,keys,clocks,delay,period,bool(index%2),seed))})
  print('generated',family,args.per_family,'seeds in both input protocols',flush=True)
 heads={};reports={};vectors=[];maximum_error=0.
 for mode,config in CONFIG.items():
  known=[r for r in records if r['label']==1 and not r.get('holdout') and r['inputMode']==mode and len(r['windows'])>=3]
  synthetic_train=[r for r in synthetics[mode] if not r['test']]
  samples=[]
  for r in human_records[mode]:samples.extend(tempo_style(r['windows'],r['id']))
  for r in known: samples.extend({**w,'group':r['id'],'label':1,'kind':'recorded_bot','family':r['family']} for w in r['windows'])
  for r in synthetic_train:samples.extend({**w,'group':r['id'],'label':1,'kind':'synthetic_bot','family':r['family']} for w in r['windows'])
  point,maximum,calibration=human_calibration(samples,human_records[mode],config,args.seed)
  final=fit(samples,args.seed,config);head=export_head(final,point);heads[mode]=head
  audit=evaluate(final,[r for r in records if r['inputMode']==mode],point)
  tests=evaluate(final,[r for r in synthetics[mode] if r['test']],point)
  family_folds=[]
  for family in sorted({r['family'] for r in known}):
   ids={r['id'] for r in known if r['family']==family}
   fold=fit([s for s in samples if s['group'] not in ids and not (s['kind']=='synthetic_bot' and s['family']==family)],args.seed,config)
   family_folds.append({'family':family,'results':evaluate(fold,[r for r in known if r['family']==family],point)})
  novel=[]
  for lineage,families in [('steering_feedback',('pursuit','pid')),('axis_navigation',('waypoint','noisy_waypoint','grid'))]:
   ids={r['id'] for r in known if r['family'] in families}
   fold=fit([s for s in samples if s['group'] not in ids and not (s['kind']=='synthetic_bot' and s['family'] in families)],args.seed,config)
   scores=evaluate(fold,[r for r in synthetics[mode] if r['family'] in families],point)
   novel.append({'lineage':lineage,'excludedFamilies':list(families),'runs':len(scores),'detected':sum(r['score'] is not None and r['score']>50 for r in scores)})
  reference=[w['values'] for r in synthetics[mode] if r['test'] for w in r['windows']]+[w['values'] for r in records if r['inputMode']==mode for w in r['windows']]
  expected=final.predict_proba(np.asarray(reference))[:,1];actual=np.array([predict(v,head) for v in reference]);error=float(np.max(abs(expected-actual)));maximum_error=max(error,maximum_error)
  assert error<1e-8,error
  for i in range(0,min(60,len(reference)),5):vectors.append({'inputMode':mode,'values':reference[i],'support':float(expected[i])})
  human_false=sum(r['score'] is not None and r['score']>50 for r in calibration)
  known_scores={r['id']:r['score'] for r in audit}
  missed=[r['id'] for r in known if known_scores[r['id']] is None or known_scores[r['id']]<=50]
  reports[mode]={'config':config,'trainingWindows':len(samples),'recordedBotRecordings':len(known),'humanGroups':len({r['id'] for r in human_records[mode]}),
   'calibration':{'method':'whole-record-out human calibration with final-fit bot population and source weights','maximumHumanSupport':maximum,'margin':.02,'operatingPoint':point,'isIndependentHumanTest':False},
   'humanGroupCalibration':calibration,'humanCalibrationPenalties':human_false,'knownBotMisses':missed,'recordedAudit':audit,'recordedSourceFamilyFolds':family_folds,
   'heldOutSyntheticRuns':len(tests),'heldOutSyntheticDetected':sum(r['score'] is not None and r['score']>50 for r in tests),'excludedSyntheticLineages':novel,
   'featureImportance':dict(zip(FEATURES,map(float,final.feature_importances_)))}
  print(mode,'point',round(point,6),'human_calibration_penalties',human_false,'known_bot_misses',missed,'synthetic_test',reports[mode]['heldOutSyntheticDetected'],'/',len(tests),flush=True)
 metadata={'tool':'sklearn.RandomForestClassifier','sklearn':sklearn.__version__,'host':platform.system()+'/'+platform.machine(),'seed':args.seed,'treesPerProtocol':TREES,
  'featureSchema':SCHEMA,'humanRecordings':sum(r['label']==0 and not r.get('holdout') for r in records),
  'recordedBotRecordings':sum(v['recordedBotRecordings'] for v in reports.values()),'labelledBotRecordings':sum(r['label']==1 for r in records),
  'heldOutBotRecordings':sum(r['label']==1 and bool(r.get('holdout')) for r in records),
  'syntheticFamilies':list(FAMILIES),'syntheticRuns':len(synthetics['held']),'dataFingerprint':raw_hash.hexdigest(),
  'humanInputModes':sorted({r['inputMode'] for r in records if r['label']==0 and not r.get('holdout')}),
  'protocolCoverage':{'held':'confirmed_recordings','pulse':'same-human-group terminal-buffer projections'},
  'sourceBalance':{k:v['recorded_mass'] for k,v in CONFIG.items()},
  'calibration':{mode:r['calibration'] for mode,r in reports.items()},
  'humanAugmentationsAreIndependent':False,'modelOutputIsCalibratedProbability':False,'rawProofsIncluded':False}
 limitations=['Only three independent confirmed human recordings; no population false-positive estimate.',
  'Pulse human coverage uses terminal-buffer projections, not independently recorded human macOS/Linux games.',
  'Human folds and source-family comparisons are development/calibration evidence, not a blinded population test.',
  'A sufficiently human-like controller can remain undetected.']
 artifact={'schema':SCHEMA,'features':list(FEATURES),'modelVersion':'forest-2','heads':heads,'training':metadata}
 report={'metadata':metadata,'seconds':round(time.monotonic()-started,2),'protocols':reports,'portableMaximumError':maximum_error,'limitations':limitations}
 args.report.parent.mkdir(parents=True,exist_ok=True);args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2))
 if any(r['humanCalibrationPenalties'] or r['knownBotMisses'] for r in reports.values()):raise RuntimeError('Calibration or known-record audit failed; candidate not exported')
 args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(artifact,separators=(',',':'),allow_nan=False))
 if args.parity_output:
  args.parity_output.parent.mkdir(parents=True,exist_ok=True);args.parity_output.write_text(json.dumps(vectors,indent=2,allow_nan=False))
 summary={'modelSha256':hashlib.sha256(args.output.read_bytes()).hexdigest(),'bytes':args.output.stat().st_size,'training':metadata,
  'evaluation':{mode:{'humanGroups':r['humanGroups'],'humanCalibrationPenalties':r['humanCalibrationPenalties'],'knownBotMisses':len(r['knownBotMisses']),
   'recordedBotRecordings':r['recordedBotRecordings'],'recordedSourceFamilyRuns':sum(len(f['results']) for f in r['recordedSourceFamilyFolds']),
   'recordedSourceFamilyDetected':sum(v['score'] is not None and v['score']>50 for f in r['recordedSourceFamilyFolds'] for v in f['results']),
   'heldOutSyntheticRuns':r['heldOutSyntheticRuns'],'heldOutSyntheticDetected':r['heldOutSyntheticDetected'],'excludedSyntheticLineages':r['excludedSyntheticLineages']} for mode,r in reports.items()},
  'heldOutRecordedBotRuns':sum(r['label']==1 and bool(r.get('holdout')) for r in records),
  'heldOutRecordedBotsDetected':sum(a['score'] is not None and a['score']>50 for report in reports.values() for a in report['recordedAudit'] if labels[a['id']].get('holdout') and a['label']==1),
  'maximumPortableInferenceError':maximum_error,'limitations':limitations}
 args.output.with_suffix('.summary.json').write_text(json.dumps(summary,indent=2,allow_nan=False))
 print(json.dumps({'artifact':str(args.output),'bytes':summary['bytes'],'seconds':report['seconds'],'portableMaximumError':maximum_error}),flush=True)

if __name__=='__main__':main()
