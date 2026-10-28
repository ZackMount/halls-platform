"""Signed build contracts; never select gameplay from an uploaded bitmap."""
from dataclasses import dataclass

CURRENT_BUILD=0x01000001
@dataclass(frozen=True)
class Layout:
 build:int
 version:str
 magic:bytes
 entities:int
 walk:float
 run:float
 chase:float
 exit_words:int=0
 @property
 def words(self):return 24+self.entities*12
 @property
 def record_words(self):return self.words+13+self.exit_words
 @property
 def exit_offset(self):return self.words+13
 @property
 def stride(self):return self.words*4
 @property
 def header(self):return 88+self.entities*8+8192
 @property
 def entity_offsets(self):return range(24,self.words,12)

LAYOUTS={
 0xa0000:Layout(0xa0000,'0.10.0',b'HLR4',4,2.7,4.6,4.876),
 0xa0001:Layout(0xa0001,'0.10.1',b'HLR4',4,2.7,4.6,4.876),
 0xa0002:Layout(0xa0002,'0.10.3',b'HLR4',4,2.7,4.6,4.876),
 0xb0000:Layout(0xb0000,'0.11.0',b'HLR5',5,2.,5.,5.4),
 0xb0001:Layout(0xb0001,'0.11.1',b'HLR5',5,2.,5.,5.4),
 0xb0002:Layout(0xb0002,'0.11.2',b'HLR5',5,2.,5.,6.5),
 0xb0003:Layout(0xb0003,'0.11.3',b'HLR5',5,2.,5.,6.5),
 0x01000000:Layout(0x01000000,'1.0.0',b'HLR5',5,2.,5.,6.5),
 CURRENT_BUILD:Layout(CURRENT_BUILD,'1.0.1',b'HLR5',5,2.,5.,6.5,2),
}

def recording_layout(meta):
 build=meta.get('recordingBuild')
 if build is None:
  build=next((n for n,v in LAYOUTS.items() if v.version==meta.get('version')),0xa0001)
 if build not in LAYOUTS:raise ValueError('Unsupported recording build')
 layout=LAYOUTS[build]
 if any(meta.get(k,v)!=v for k,v in (('words',layout.words),('entities',layout.entities),('recordWords',layout.record_words))):raise ValueError('Recording metadata/layout mismatch')
 return layout
