"""Authenticated per-tick exit snapshots, separate from core simulation words."""
import base64
import struct
try:
 from .timing import ClockSamples
except ImportError:
 from timing import ClockSamples


class ExitSamples:
 def __init__(self,meta):
  source=meta.get('exitSamples')
  self.data=b'' if source is None else base64.b64decode(source['samples'],validate=True)
  if source is not None and (source.get('encoding')!='u32le-pair' or len(self.data)!=meta['frames']*8):
   raise ValueError('Invalid exit snapshot encoding or length')
  self.unpack=struct.Struct('<2I')
 def __len__(self):return len(self.data)//8
 def __getitem__(self,index):
  if index<0:index+=len(self)
  if not 0<=index<len(self):raise IndexError(index)
  return self.unpack.unpack_from(self.data,index*8)


def valid_cell(cell):return len(cell)==2 and all(type(value) is int and 0<=value<256 for value in cell)


def exit_events(meta,samples=None):
 """Render exact changes on the replay's wall clock; never synthesize legacy data."""
 samples=ExitSamples(meta) if samples is None else samples
 if not len(samples):return []
 if not meta.get('timeInfo',{}).get('available'):raise ValueError('Exit timeline requires valid wall clocks')
 clock=ClockSamples(meta)
 if len(clock)!=len(samples):raise ValueError('Exit and clock sample counts differ')
 events=[];previous=None
 for index,cell in enumerate(samples):
  if not valid_cell(cell):raise ValueError('Exit snapshot outside map')
  if cell==previous:continue
  stamp=clock[index][0]/1e6
  if not events:
   if stamp!=0:raise ValueError('Initial exit snapshot must begin at zero')
  elif stamp<=events[-1]['time']:
   # Keep the raw per-tick evidence, but do not invent sub-clock change times.
   raise ValueError('Exit changes have ambiguous wall timestamps')
  events.append({'time':stamp,'cell':list(cell)});previous=cell
 return events
