"""Signed local clock evidence. These clocks are independent, not remote attestation."""
import base64,math,struct
try:from layout import recording_layout
except ModuleNotFoundError:from .layout import recording_layout
class ClockSamples:
 def __init__(self,meta):self.data=base64.b64decode(meta['timing']['samples']);self.unpack=struct.Struct('<5Q')
 def __len__(self):return len(self.data)//40
 def __getitem__(self,i):
  if i<0:i+=len(self)
  if not 0<=i<len(self):raise IndexError(i)
  return self.unpack.unpack_from(self.data,i*40)

def inactive_between(previous,current):
 wall=max(0,current[0]-previous[0])/1e6;awake=max(0,current[4]-previous[4])/1e6;pause=max(0,current[3]-previous[3])/1e6
 sleep=max(0,wall-awake) if wall-awake>1 else 0.
 return min(wall,max(pause,sleep)),sleep

def summarize(meta):
 if not meta.get('timing'):return {'available':False,'basis':'simulation_legacy','duration':meta['simulationDuration']}
 clock=ClockSamples(meta);first,last=clock[0],clock[-1];valid=first[0]==first[3]==first[4]==0 and first[1]==meta['timing']['startedAtUs'];sleep=0.;previous=first
 for row in clock:
  valid=valid and row[0]>=previous[0] and row[3]>=previous[3] and row[4]>=previous[4] and row[3]<=row[0] and row[0]<=7*86400*1e6
  if row[3]==previous[3]:sleep+=inactive_between(previous,row)[1]
  previous=row
 valid=bool(valid and last[0]>0)
 wall=last[0]/1e6;pause=last[3]/1e6;active=max(0,wall-pause-sleep)
 return {'available':valid,'basis':'recorded_wall' if valid else 'invalid_clocks','duration':wall if valid else meta['simulationDuration'],'activeDuration':active,'pausedSeconds':pause,'suspendedSeconds':sleep,'startedAt':first[1]/1e6,'finishedAt':last[1]/1e6,'clockSource':meta['timing']['source'],'simulationDuration':meta['simulationDuration']}

def judge_timing(meta,frames,emit,source_params,speed_params):
 if not meta.get('timing'):return None
 clock=ClockSamples(meta);info=meta['timeInfo'];first,last=clock[0],clock[-1];stride=recording_layout(meta).stride
 emit('time_sources',0,info['available'],'独立时钟序列必须有效',info['basis'],'recorded_wall')
 expected={'windows':1,'macos':2,'linux':3}.get(meta['platform'])
 emit('time_sources',0,meta['timing']['source']==expected,'时钟来源与平台不符',meta['timing']['source'],expected)
 emit('time_sources',len(clock)-1,last[1]==meta['timing']['finishedAtUs'] and abs(meta['completedAt']-last[1]/1e6)<1,'完成时间戳与最后一帧不符',meta['timing']['finishedAtUs'],last[1])
 raw_sum=reference=sim_sum=0.;win_raw=win_ref=0.;windows=[];previous=first;audited=0;gaps=0
 tolerance=speed_params['ratio_tolerance']/100
 for i,row in enumerate(clock):
  dt=struct.unpack_from('<f',frames,i*stride)[0];raw=row[2]/1e9;sim_sum+=dt
  if not i:continue
  wall=(row[0]-previous[0])/1e6;awake=(row[4]-previous[4])/1e6;utc=(row[1]-previous[1])/1e6;paused=(row[3]-previous[3])/1e6
  emit('speed_control',i,abs(dt-min(raw,.05))<=speed_params['step_tolerance'],'模拟步长与未截断计时不符',dt,min(raw,.05))
  drift=abs((row[1]-first[1])/1e6-row[0]/1e6)
  emit('time_sources',i,wall>=0 and awake>=0 and awake<=wall+source_params['slack'],'系统时钟顺序异常',[wall,awake],'>= 0')
  emit('time_sources',i,drift<=source_params['utc_slack']+row[0]/1e6*source_params['drift_percent']/100,'UTC 与独立单调时钟不一致',drift,source_params['utc_slack'])
  # Pause/resume bridges and OS suspend gaps are not speed evidence.
  # The raw frame interval still has to produce the recorded clamped step.
  if paused>0 or wall-awake>1:
   if win_ref>=.5:windows.append((i,win_raw,win_ref))
   win_raw=win_ref=0.;gaps+=1
  elif wall>=0 and awake>=0:
   win_raw+=raw;win_ref+=awake;raw_sum+=raw;reference+=awake;audited+=1
   if win_ref>=speed_params['window_seconds']:
    windows.append((i,win_raw,win_ref));win_raw=win_ref=0.
  previous=row
 if win_ref>0 or win_raw>0:windows.append((len(clock)-1,win_raw,win_ref))
 for tick,recorded,real in windows:
  allowed=speed_params['clock_slack']+real*tolerance
  emit('speed_control',tick,abs(recorded-real)<=allowed,'游戏计时与独立系统计时倍率不一致',recorded/max(real,1e-9),1)
 emit('speed_control',len(clock)-1,abs(raw_sum-reference)<=speed_params['clock_slack']+reference*speed_params['total_tolerance']/100,'全程计时倍率不一致',raw_sum/max(reference,1e-9),1)
 emit('speed_control',len(clock)-1,reference>=min(.5,info.get('activeDuration',0)*.5) and audited>0,'缺少可复核的活动计时区间',reference,.5)
 return {'gameClockSeconds':raw_sum,'referenceSeconds':reference,'gameClockRatio':raw_sum/reference if reference>0 else None,'simulationRatio':sim_sum/max(info.get('activeDuration',0),1e-9),'auditedFrames':audited,'excludedBridges':gaps,'windows':len(windows),'trust':'本地多时钟记录，非服务器见证；同时篡改各时钟仍可能绕过。'}

def valid_tick_dt(tick,row,previous,clocks,maximum):
 if tick==0:return row[0]==0
 if 0<row[0]<=maximum:return True
 # A resume can sample the same game-clock instant twice. Accept only a
 # recorded pause bridge with zero raw interval and no simulated state change.
 return bool(row[0]==0 and clocks and clocks[tick][2]==0 and clocks[tick][3]>clocks[tick-1][3] and all(v==0 for v in row[2:6]) and row[6:]==previous[6:])
