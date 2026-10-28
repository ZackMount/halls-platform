"""Differential tests for the proof compression wire format, without signing keys."""
import random
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'engine'))
import codec
from validation import ProofError


def pack_tokens(tokens):
    """A token is one literal byte or a (distance, length) reference."""
    packed = bytearray()
    for offset in range(0, len(tokens), 8):
        group = tokens[offset:offset + 8]
        packed.append(sum(1 << bit for bit, token in enumerate(group)
                          if isinstance(token, tuple)))
        for token in group:
            if isinstance(token, tuple):
                distance, length = token
                packed.extend((((distance - 1) << 5) | (length - 3)).to_bytes(2, 'little'))
            else:
                packed.append(token)
    return bytes(packed)


def reference_decompress(data, size):
    """Simple byte-at-a-time format oracle, intentionally without block copying."""
    if not 64 < size <= codec.MAX_PLAIN:
        raise ProofError('Invalid decompressed size')
    output = bytearray()
    cursor = 0
    while len(output) < size:
        if cursor == len(data):
            raise ProofError('Truncated compression group')
        flags = data[cursor]
        cursor += 1
        for bit in range(8):
            if len(output) == size:
                if flags >> bit:
                    raise ProofError('Noncanonical compression flags')
                break
            if flags & (1 << bit):
                if len(data) - cursor < 2:
                    raise ProofError('Truncated back reference')
                value = data[cursor] | data[cursor + 1] << 8
                cursor += 2
                distance, length = (value >> 5) + 1, (value & 31) + 3
                if distance > len(output) or length > size - len(output):
                    raise ProofError('Invalid back reference')
                for _ in range(length):
                    output.append(output[len(output) - distance])
            else:
                if cursor == len(data):
                    raise ProofError('Truncated literal')
                output.append(data[cursor])
                cursor += 1
    if cursor != len(data):
        raise ProofError('Trailing compressed bytes')
    return bytes(output)


class CompressionTests(unittest.TestCase):
    def assert_matches_reference(self, packed, size):
        try:
            expected = reference_decompress(packed, size)
        except ProofError as expected_error:
            with self.assertRaises(ProofError) as caught:
                codec.decompress(packed, size)
            self.assertEqual(caught.exception.detail, expected_error.detail)
            self.assertEqual(caught.exception.code, expected_error.code)
            self.assertEqual(caught.exception.status, expected_error.status)
        else:
            self.assertEqual(codec.decompress(packed, size), expected)

    def test_every_distance_and_length_including_overlapping_references(self):
        rng = random.Random(0x484c5046)
        tokens = list(rng.randbytes(2048))
        size = len(tokens)
        # Includes distance 1, both overlap boundaries, and maximum token 0xffff.
        for distance in range(1, 2049):
            for length in range(3, 35):
                tokens.append((distance, length))
                size += length
        self.assert_matches_reference(pack_tokens(tokens), size)

    def test_chained_overlap_is_periodic_not_a_snapshot_of_only_available_bytes(self):
        tokens = list(b'ab') + [(2, 34)] * 12
        self.assertEqual(codec.decompress(pack_tokens(tokens), 410), b'ab' * 205)

    def test_deterministic_random_valid_streams(self):
        rng = random.Random(0xc0dec)
        for case in range(100):
            size = rng.randrange(65, 8000)
            tokens = []
            emitted = 0
            while emitted < size:
                remaining = size - emitted
                if emitted and remaining >= 3 and rng.randrange(4):
                    distance = rng.randint(1, min(2048, emitted))
                    length = rng.randint(3, min(34, remaining))
                    tokens.append((distance, length))
                    emitted += length
                else:
                    tokens.append(rng.randrange(256))
                    emitted += 1
            with self.subTest(case=case):
                self.assert_matches_reference(pack_tokens(tokens), size)

    def test_literal_groups_and_every_partial_group_padding(self):
        for size in range(65, 81):
            raw = bytes(range(size))
            packed = pack_tokens(list(raw))
            self.assertEqual(codec.decompress(packed, size), raw)
            if size % 8:
                bad = bytearray(packed)
                last_group = (size // 8) * 9
                bad[last_group] |= 1 << (size % 8)
                self.assert_matches_reference(bytes(bad), size)

    def test_malformed_streams_keep_strict_error_checks(self):
        prefix = pack_tokens([65] * 64)
        cases = [
            (b'', 65, 'Truncated compression group'),
            (prefix + b'\0', 65, 'Truncated literal'),
            (prefix + b'\1', 67, 'Truncated back reference'),
            (prefix + b'\1\0', 67, 'Truncated back reference'),
            (b'\1\0\0', 65, 'Invalid back reference'),
            (prefix + b'\1\0\x08', 67, 'Invalid back reference'),
            (prefix + b'\1\x1f\0', 97, 'Invalid back reference'),
            (prefix + b'\2A', 65, 'Noncanonical compression flags'),
            (prefix + b'\0AZ', 65, 'Trailing compressed bytes'),
        ]
        for packed, size, message in cases:
            with self.subTest(message=message, data=packed[-4:]):
                with self.assertRaisesRegex(ProofError, '^' + message + '$'):
                    codec.decompress(packed, size)
                self.assert_matches_reference(packed, size)

    def test_random_mutations_and_truncations_match_reference(self):
        rng = random.Random(0xbadc0de)
        tokens = list(rng.randbytes(80)) + [(rng.randrange(1, 81), rng.randrange(3, 35))
                                          for _ in range(100)]
        size = 80 + sum(length for _, length in tokens[80:])
        packed = pack_tokens(tokens)
        for end in range(len(packed)):
            self.assert_matches_reference(packed[:end], size)
        for _ in range(300):
            bad = bytearray(packed)
            at = rng.randrange(len(bad))
            bad[at] ^= 1 << rng.randrange(8)
            self.assert_matches_reference(bytes(bad), size)

    def test_declared_size_limits_are_unchanged(self):
        for size in (-1, 0, 64, codec.MAX_PLAIN + 1):
            with self.subTest(size=size):
                self.assert_matches_reference(b'', size)

    def test_processing_deadline_is_checked_before_output_and_after_checkpoint(self):
        packed = pack_tokens([65] + [(1, 34)] * 4000)
        size = 1 + 34 * 4000
        for clock in ([0, 31], [0, 0, 31]):
            with self.subTest(clock=clock), patch.object(codec.time, 'monotonic', side_effect=clock):
                with self.assertRaises(ProofError) as caught:
                    codec.decompress(packed, size)
                self.assertEqual(caught.exception.code, 'processing_limit')
                self.assertEqual(caught.exception.status, 413)
        self.assertEqual(codec.PROCESS_SECONDS, 30)


if __name__ == '__main__':
    unittest.main()
