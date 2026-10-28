import base64
import copy
import struct
import unittest

import test_proof_format as signing
from test_version_0110 import recording, bitmap
from codec import parse, ProofError
from exits import ExitSamples, exit_events
from layout import LAYOUTS, CURRENT_BUILD
from eligibility import MINIMUM_CLIENT, require_current_submission


def exit_recording(cells,build=CURRENT_BUILD):
    layout=LAYOUTS[build];count=len(cells);start=1770000000000000;finish=start+(count-1)*50000
    head=layout.magic+struct.pack('<IHHBBHIQQHHfffIqiQQI',build,256,256,layout.entities,1,layout.record_words,count,42,999,1,1,2,2.65,1.55,8192,finish//1000000,480,start,finish,1)
    head+=struct.pack('<5Q',1,2,3,4,5)+bitmap()
    previous=[0]*layout.record_words;body=bytearray()
    for tick,cell in enumerate(cells):
        row=[0.]*84;row[0]=.05 if tick else 0.;row[6:9]=[3+tick*.1,1.55,3];row[12:15]=row[6:9];row[18]=1.3962634015954636;row[19]=100.;row[22]=tick*.05;row[11]=tick*.1
        for offset in range(24,84,12):row[offset:offset+2]=[11.,11.]
        words=list(struct.unpack('<84I',struct.pack('<84f',*row)));words[1]=512;words[23]=int(tick==count-1)
        words.extend(struct.unpack('<3I',struct.pack('<ffI',100.,0.,1)))
        for value in (tick*50000,start+tick*50000,50000000 if tick else 0,0,tick*50000):words.extend([value&0xffffffff,value>>32])
        if layout.exit_words:words.extend(cell)
        for offset in range(0,len(words),8):
            mask=len(body);body.append(0)
            for bit in range(min(8,len(words)-offset)):
                index=offset+bit;delta=words[index]^previous[index];previous[index]=words[index]
                if not delta:continue
                body[mask]|=1<<bit
                while delta>=128:body.append((delta&127)|128);delta>>=7
                body.append(delta)
    return head+body


class ExitSampleTests(unittest.TestCase):
    setUpClass=classmethod(signing.FormatTests.setUpClass.__func__)
    seal=signing.FormatTests.seal
    decode=signing.FormatTests.decode

    @classmethod
    def tearDownClass(cls):cls.tmp.cleanup()

    def test_authenticated_99_words_keep_core_battery_and_five_clocks_separate(self):
        cells=[[1,1],[7,9],[1,1]]
        meta,frames=self.decode(self.seal(exit_recording(cells)))
        self.assertEqual((meta['version'],meta['recordWords'],meta['words']),('1.0.1',99,84))
        self.assertEqual(len(frames),3*84*4)
        self.assertEqual(len(base64.b64decode(meta['battery']['samples'])),3*12)
        self.assertEqual(len(base64.b64decode(meta['timing']['samples'])),3*40)
        self.assertEqual(list(ExitSamples(meta)),[(1,1),(7,9),(1,1)])
        self.assertEqual(ExitSamples(meta)[-1],(1,1))
        self.assertEqual(meta['exit'],[1,1])
        self.assertEqual(meta['exitEvents'],[{'time':0.,'cell':[1,1]},{'time':.05,'cell':[7,9]},{'time':.1,'cell':[1,1]}])
        self.assertTrue(meta['playbackSafe'])

    def test_unchanged_snapshots_become_one_initial_event(self):
        meta,_=parse(exit_recording([[1,1]]*3),{})
        self.assertEqual(meta['exitEvents'],[{'time':0.,'cell':[1,1]}])

    def test_invalid_exit_stays_in_judge_evidence_but_never_visual_events(self):
        for bad in (256,0xffffffff):
            with self.subTest(bad=bad):
                meta,_=self.decode(self.seal(exit_recording([[1,1],[bad,9],[1,1]])))
                self.assertEqual(ExitSamples(meta)[1],(bad,9));self.assertFalse(meta['playbackSafe']);self.assertEqual(meta['exitEvents'],[])
                self.assertTrue(any('exit cell' in entry['message'] for entry in meta['violations']))

    def test_history_100_remains_decodable_but_only_101_is_admitted(self):
        old,frames=parse(recording(0x01000000),{})
        self.assertEqual((old['version'],old['recordWords']),('1.0.0',97));self.assertEqual(len(frames),672)
        self.assertNotIn('exitSamples',old);self.assertEqual(len(ExitSamples(old)),0);self.assertEqual(exit_events(old),[])
        self.assertEqual(MINIMUM_CLIENT,'1.0.1')
        with self.assertRaisesRegex(ValueError,'1.0.1'):require_current_submission(old)
        current,_=parse(exit_recording([[1,1]]*2),{});require_current_submission(current)

    def test_build_and_record_width_are_bound(self):
        old=bytearray(recording(0x01000000));struct.pack_into('<I',old,4,CURRENT_BUILD)
        with self.assertRaises(ProofError):parse(old,{})
        new=bytearray(exit_recording([[1,1]]*2));struct.pack_into('<I',new,4,0x01000000)
        with self.assertRaises(ProofError):parse(new,{})

    def test_aux_shape_and_clock_aliases_do_not_invent_exit_history(self):
        meta,_=parse(exit_recording([[1,1],[7,9]]),{})
        invalid=copy.deepcopy(meta);invalid['exitSamples']['samples']=base64.b64encode(bytes(9)).decode()
        with self.assertRaises(ValueError):ExitSamples(invalid)
        clocks=bytearray(base64.b64decode(meta['timing']['samples']));struct.pack_into('<Q',clocks,40,0);meta['timing']['samples']=base64.b64encode(clocks).decode()
        with self.assertRaisesRegex(ValueError,'ambiguous'):exit_events(meta)


if __name__=='__main__':unittest.main()
