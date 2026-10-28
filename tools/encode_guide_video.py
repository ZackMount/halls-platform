#!/usr/bin/env python3
"""Encode current-client footage. All game motion is 24 fps, at real speed.

The only editorial effects are half-second shot dissolves and a camera crop
that enlarges the real battery footer. Loop fades are composited by the site.
"""
import argparse
import bisect
import csv
import json
import re
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FPS, W, H = 24, 960, 540

def ansi_footer(text, font):
    """Render the real footer with the flashlight state and battery cells."""
    im = Image.new('RGBA', (W, 16))
    draw = ImageDraw.Draw(im)
    color, background, col, row = (160, 160, 160), (15, 15, 15), 0, 0
    for part in re.split(r'(\x1b\[[0-9;]*[A-Za-z])', text):
        if part.startswith('\x1b['):
            values = [int(v or 0) for v in part[2:-1].split(';')]
            if part.endswith('H'):
                row, col = values[0] - 1, values[1] - 1
            elif part == '\x1b[2K':
                draw.rectangle((0, row * 16, W, row * 16 + 15), fill=background)
            elif part == '\x1b[0m':
                color, background = (160, 160, 160), (15, 15, 15)
            elif part.endswith('m') and values[0] in (38, 48):
                if values[1] == 2:
                    rgb = tuple(values[2:5])
                else:
                    n = values[2]
                    if n >= 232:
                        rgb = (8 + (n - 232) * 10,) * 3
                    else:
                        n -= 16
                        levels = [0, 95, 135, 175, 215, 255]
                        rgb = tuple(levels[v] for v in (n // 36, n // 6 % 6, n % 6))
                if values[0] == 38:
                    color = rgb
                else:
                    background = rgb
            continue
        for char in part:
            if col >= W // 8:
                break
            x, y = col * 8, row * 16
            if char.isprintable():
                draw.rectangle((x, y, x + 7, y + 15), fill=background)
                if char == '▏':
                    draw.line((x, y, x, y + 15), fill=color)
                elif char == '▀':
                    draw.rectangle((x, y, x + 7, y + 7), fill=color)
                else:
                    draw.text((x, y + 2), char, font=font, fill=color)
            col += 1
    return im

def battery_frame(path, row, font):
    im = Image.new('RGB', (W, H))
    im.paste(Image.open(path), (0, 0))
    footer = ansi_footer(path.with_suffix('.ansi').read_text(), font)
    im.paste(footer, (0, 524), footer)
    # Zoom towards the bottom-right HUD without changing the simulation clock.
    zoom = 1 + 1.0 * float(row['zoom'])
    crop = im.crop((W - W / zoom, H - H / zoom, W, H))
    im = crop.resize((W, H), Image.Resampling.LANCZOS)
    t = float(row['video_seconds'])
    if 1 <= t < 2.5:
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((20, 18, 58, 56), radius=3, fill=(224, 216, 177))
        d.text((39, 37), 'F', font=font, fill=(35, 35, 28), anchor='mm')
    return im

def encode_pipe(ffmpeg, dest, images, crf):
    proc = subprocess.Popen([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
        '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf),
        '-pix_fmt', 'yuv420p', '-g', str(FPS * 2), '-movflags', '+faststart', str(dest)],
        stdin=subprocess.PIPE)
    count = 0
    try:
        for im in images:
            proc.stdin.write(im.convert('RGB').tobytes())
            count += 1
    finally:
        proc.stdin.close()
    if proc.wait():
        raise RuntimeError(f'Encoding failed: {dest}')
    return count

def trailer_frames(folder):
    shots = list(csv.DictReader((folder / 'shots.csv').open()))
    previous = None
    for shot in shots:
        frames = sorted((folder / f"shot-{shot['shot']}").glob('*.ppm'))
        assert len(frames) == int(shot['frames'])
        overlap = FPS // 2
        start = 0
        if previous:
            for i, old in enumerate(previous):
                # Smoothstep blend: no GIF palettes or simulated pause at cuts.
                a = (i + 1) / overlap
                a = a * a * (3 - 2 * a)
                yield Image.blend(Image.open(old), Image.open(frames[i]), a)
            start = overlap
        end = len(frames) if int(shot['shot']) == len(shots) - 1 else len(frames) - overlap
        for path in frames[start:end]:
            yield Image.open(path)
        previous = frames[end:]

def proof_frames(folder):
    files = sorted(folder.glob('*.png'))
    images = [Image.open(f).convert('RGB') for f in files]
    durations = json.loads((folder / 'durations.json').read_text())
    assert len(images) == len(durations)
    ends, clock = [], 0
    for d in durations:
        clock += d
        ends.append(clock)
    for i in range(round(clock * FPS / 1000)):
        yield images[min(bisect.bisect_right(ends, i * 1000 / FPS), len(images) - 1)]

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', type=Path, default=ROOT / 'output/guide-0102')
    p.add_argument('--media', type=Path, default=ROOT / 'web/media')
    p.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
    p.add_argument('--font', type=Path, default=Path('/System/Library/Fonts/Menlo.ttc'))
    p.add_argument('--only', default='all')
    args = p.parse_args()
    if not args.ffmpeg:
        p.error('Pass --ffmpeg /path/to/ffmpeg')
    args.media.mkdir(parents=True, exist_ok=True)
    raw = args.input / 'frames'
    font = ImageFont.truetype(str(args.font), 13)
    results = []
    for name in ('exploration', 'walk', 'alert', 'attack', 'exit', 'flashlight', 'proof-save'):
        if args.only != 'all' and args.only != name:
            continue
        if name == 'exploration':
            frames = trailer_frames(raw)
            poster = Image.open(raw / 'shot-0/0120.ppm')
        elif name == 'flashlight':
            rows = list(csv.DictReader((raw / 'flashlight.csv').open()))
            frames = (battery_frame(raw / 'flashlight' / f"{int(row['frame']):04}.ppm", row, font) for row in rows)
            # Enlarged mid-run battery is useful when reduced motion is enabled.
            poster = battery_frame(raw / 'flashlight/0144.ppm', rows[144], font)
        elif name == 'proof-save':
            frames = proof_frames(args.input / 'proof-save/frames')
            poster = Image.open(args.input / 'proof-save/poster.png')
        else:
            paths = sorted((raw / name).glob('*.ppm'))
            frames = (Image.open(f) for f in paths)
            poster = Image.open(paths[0 if name == 'attack' else len(paths) // 3])
        dest = args.media / f'{name}-demo.mp4'
        count = encode_pipe(args.ffmpeg, dest, frames, 17 if name in ('flashlight', 'proof-save') else 23)
        poster.save(args.media / f'{name}.png', optimize=True)
        result = {'name': name, 'seconds': count / FPS, 'fps': FPS, 'frames': count, 'bytes': dest.stat().st_size}
        results.append(result)
        print(result, flush=True)
    (args.input / 'video-manifest.json').write_text(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
