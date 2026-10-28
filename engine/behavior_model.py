"""Portable JSON forest inference. Only offline training needs scikit-learn."""
import json,math,struct
from functools import lru_cache
from pathlib import Path
from behavior_features import FEATURES,SCHEMA,extract,eligible_windows

PATH=Path(__file__).resolve().parent/'models/behavior-forest.json'

class ModelError(ValueError):pass

def validate_head(head):
 trees=head['trees']
 if not 1<=len(trees)<=256:raise ModelError('Tree count outside limits')
 for tree in trees:
  if not 1<=len(tree)<=4095:raise ModelError('Tree size outside limits')
  pending=[(0,0)];visited=set()
  while pending:
   index,depth=pending.pop()
   if index in visited or depth>16 or not 0<=index<len(tree):raise ModelError('Invalid tree graph')
   visited.add(index);node=tree[index]
   if len(node)!=5 or not all(type(v) in (float,int) and math.isfinite(v) for v in node):raise ModelError('Invalid tree node')
   feature,threshold,left,right,value=node
   if not 0<=value<=1:raise ModelError('Invalid leaf value')
   if feature<0:
    if left!=-1 or right!=-1:raise ModelError('Invalid leaf edge')
   else:
    if type(feature) is not int or not 0<=feature<len(FEATURES) or type(left) is not int or type(right) is not int:raise ModelError('Invalid split')
    pending.extend(((left,depth+1),(right,depth+1)))
  if len(visited)!=len(tree):raise ModelError('Unreachable model nodes')
 if type(head['operatingPoint']) not in (float,int) or not .9<=head['operatingPoint']<=.99:raise ModelError('Unsupported operating point')

@lru_cache(maxsize=1)
def load_model():
 try:
  raw=PATH.read_bytes()
  if len(raw)>4*1024*1024:raise ModelError('Model size exceeds the inference budget')
  model=json.loads(raw)
  if model['schema']!=SCHEMA or tuple(model['features'])!=FEATURES:raise ModelError('Feature schema mismatch')
  heads=model['heads']
  if not isinstance(heads,dict) or not heads or set(heads)-{'held','pulse'}:raise ModelError('Invalid protocol heads')
  for head in heads.values():validate_head(head)
  if not model['training']['humanInputModes'] or any(v not in ('held','pulse') for v in model['training']['humanInputModes']):raise ModelError('Invalid protocol coverage')
  return model
 except (OSError,KeyError,TypeError,ValueError,RecursionError) as error:raise ModelError('Behavior model unavailable') from error

def predict(values,model,input_mode='held'):
 if len(values)!=len(FEATURES) or not all(math.isfinite(v) for v in values):raise ModelError('Invalid features')
 if 'heads' in model:
  if input_mode not in model['heads']:raise ModelError('Unsupported input protocol')
  model=model['heads'][input_mode]
 # sklearn tree inference receives float32 inputs, including at split boundaries.
 values=struct.unpack('<'+str(len(values))+'f',struct.pack('<'+str(len(values))+'f',*values));total=0.
 for tree in model['trees']:
  index=0
  for _ in range(17):
   feature,threshold,left,right,value=tree[index]
   if feature<0:total+=value;break
   index=left if values[feature]<=threshold else right
  else:raise ModelError('Tree depth exceeded')
 return total/len(model['trees'])

def suspicion(support,operating_point=.9):
 # The calibrated score is not a probability of cheating.
 return 50*support/operating_point if support<=operating_point else 50+50*(support-operating_point)/(1-operating_point)

def observe(rows,uints,clocks=None,check=lambda:None,input_mode='held',include_sparse=True):
 model=load_model();windows=extract(rows,uints,clocks,check)
 eligible=eligible_windows(windows) if include_sparse else [w for w in windows if w['events']>=6 and w['positions']>=3]
 head=model['heads'].get(input_mode);covered=head is not None
 predictions=[{**w,'support':predict(w['values'],head)} for w in eligible] if covered else []
 result={'available':True,'coveredProtocol':covered,'sufficient':False,'score':None,'persistent':False,'modelVersion':model['modelVersion'],'schema':SCHEMA,'windowPolicy':'moving-windows-2' if include_sparse else 'event-gated-1',
         'inputHead':input_mode if covered else None,'windows':len(windows),'eligibleWindows':len(eligible),'support':None,'evidence':[]}
 # Separate learned heads account for held-key and terminal-buffer transports.
 # Neither the protocol nor an isolated mechanical action determines suspicion.
 if len(predictions)>=3:
  strongest=sorted(predictions,key=lambda w:w['support'],reverse=True)[:3];support=min(w['support'] for w in strongest)
  result.update(sufficient=True,support=support,operatingPoint=head['operatingPoint'],persistent=support>head['operatingPoint'],score=round(min(100.,max(0.,suspicion(support,head['operatingPoint']))),2))
  result['evidence']=[{'startSeconds':round(w['startSeconds'],3),'endSeconds':round(w['endSeconds'],3),'support':round(w['support'],6),'events':w['events']} for w in sorted(strongest,key=lambda w:w['startSeconds'])]
 if not result['sufficient']:result['reason']='unsupported_input_protocol' if not covered else 'insufficient_activity_windows'
 return result
