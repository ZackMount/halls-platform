//! Lossless per-tick recording. No disk I/O occurs until a completed run is exported.
#[allow(unused_imports)]
use crate::prelude::*;
use crate::{game::Game, player::Player, world::Map};

const BASE_WORDS: usize = 24;
const ENTITY_WORDS: usize = 12;
unsafe extern "C" {
    fn halls_proof_time(out: *mut u8);
    fn halls_proof_sign(data: *const u8, size: u32, signature: *mut u8) -> i32;
    fn halls_proof_seal(data: *const u8, size: u32, plain_size: u32, out: *mut u8) -> i32;
    fn halls_proof_write(name: *const u8, data: *const u8, size: u32) -> i32;
}

pub struct Recording {
    data: Vec<u8>,
    previous: Vec<u32>,
    frames: u32,
    complete: bool,
}
impl Recording {
    pub fn new(map: &Map, game: &Game, player: &Player) -> Self {
        let mut data = b"HLR2".to_vec();
        data.extend_from_slice(&0x0008_0000u32.to_le_bytes());
        for n in [map.width() as u16, map.height() as u16] {
            data.extend_from_slice(&n.to_le_bytes());
        }
        data.push(game.progress.entities.len() as u8);
        data.push(1 | if cfg!(feature = "tools") { 128 } else { 0 }); // Mark developer recordings.
        let words = BASE_WORDS + ENTITY_WORDS * game.progress.entities.len();
        data.extend_from_slice(&(words as u16).to_le_bytes());
        data.extend_from_slice(&0u32.to_le_bytes());
        data.extend_from_slice(&map.seed.to_le_bytes());
        data.extend_from_slice(&crate::world::fresh_seed().to_le_bytes());
        for n in map.exit {
            data.extend_from_slice(&(n as u16).to_le_bytes());
        }
        for n in [map.tile_size, map.ceiling, map.eye_height] {
            data.extend_from_slice(&n.to_le_bytes());
        }
        data.extend_from_slice(&((map.walls.bits.len() * 8) as u32).to_le_bytes());
        data.extend_from_slice(&[0u8; 12]); // UTC Unix seconds + signed local offset minutes.
        for e in &game.progress.entities {
            data.extend_from_slice(&e.form_seed.to_le_bytes());
        }
        for bits in &map.walls.bits {
            data.extend_from_slice(&bits.to_le_bytes());
        }
        let mut record = Self {
            data,
            previous: vec![0; words],
            frames: 0,
            complete: false,
        };
        record.tick(game, player, 0., [0.; 4], 0);
        record
    }
    pub fn tick(&mut self, game: &Game, player: &Player, dt: f32, action: [f32; 4], held: u8) {
        if self.complete {
            return;
        }
        let camera = game.visual_camera(player);
        let mut words = Vec::with_capacity(self.previous.len());
        words.push(dt.to_bits());
        words.push(held as u32 | ((game.running as u32) << 8) | ((game.flashlight as u32) << 9));
        for x in action {
            words.push(x.to_bits());
        }
        for x in [
            player.camera.position.x,
            player.camera.position.y,
            player.camera.position.z,
            player.camera.yaw,
            player.camera.pitch,
            player.distance,
            camera.position.x,
            camera.position.y,
            camera.position.z,
            camera.yaw,
            camera.pitch,
            camera.roll,
            camera.fov,
            game.progress.health,
            game.knocked,
            game.shock,
            game.progress.seconds,
        ] {
            words.push(x.to_bits());
        }
        words.push(player.won as u32 | ((game.dead() as u32) << 1));
        for e in &game.progress.entities {
            for x in [
                e.position[0],
                e.position[1],
                e.yaw,
                e.travel,
                e.move_blend,
                e.attack_left,
                e.hate,
                e.speed,
                e.last_seen,
                e.cooldown,
                e.replan,
            ] {
                words.push(x.to_bits());
            }
            words.push(e.mood as u32);
        }
        for (group, old) in words.chunks(8).zip(self.previous.chunks_mut(8)) {
            let mask_at = self.data.len();
            self.data.push(0);
            for (i, (&value, prev)) in group.iter().zip(old).enumerate() {
                let mut delta = value ^ *prev;
                *prev = value;
                if delta != 0 {
                    self.data[mask_at] |= 1 << i;
                    while delta >= 128 {
                        self.data.push(delta as u8 | 128);
                        delta >>= 7;
                    }
                    self.data.push(delta as u8);
                }
            }
        }
        self.frames += 1;
        self.complete = player.won && !game.dead() && self.frames > 1;
        if self.complete {
            unsafe { halls_proof_time(self.data.as_mut_ptr().add(56)); }
        }
    }
    /// Non-winning runs cannot produce an authenticated export.
    pub fn export(&mut self, name: &str) -> core::result::Result<(), i32> {
        if !self.complete || !valid_name(name) {
            return Err(-1);
        }
        self.data[16..20].copy_from_slice(&self.frames.to_le_bytes());
        let mut signature = [0u8; 64];
        let size = u32::try_from(self.data.len()).map_err(|_| -1)?;
        if unsafe { halls_proof_sign(self.data.as_ptr(), size, signature.as_mut_ptr()) } != 0 {
            return Err(-2);
        }
        if self.data.len() > u32::MAX as usize - 64 {
            return Err(-1);
        }
        let mut signed = self.data.clone();
        signed.extend_from_slice(&signature);
        let compressed = compress(&signed);
        if compressed.len() > u32::MAX as usize - 308 {
            return Err(-1);
        }
        let mut sealed = vec![0; 308 + compressed.len()];
        if unsafe {
            halls_proof_seal(
                compressed.as_ptr(),
                compressed.len() as u32,
                signed.len() as u32,
                sealed.as_mut_ptr(),
            )
        } != 0
        {
            return Err(-2);
        }
        let mut filename = name.as_bytes().to_vec();
        if !name.ends_with(".hproof") {
            filename.extend_from_slice(b".hproof");
        }
        filename.push(0);
        let result =
            unsafe { halls_proof_write(filename.as_ptr(), sealed.as_ptr(), sealed.len() as u32) };
        if result == 0 { Ok(()) } else { Err(result) }
    }
    #[cfg(feature = "tools")]
    pub fn words_for_test(&self) -> &[u32] {
        &self.previous
    }
    #[cfg(feature = "tools")]
    pub fn raw(&mut self) -> &[u8] {
        self.data[16..20].copy_from_slice(&self.frames.to_le_bytes());
        &self.data
    }
}
pub fn valid_name(name: &str) -> bool {
    let base = name.split('.').next().unwrap_or("").to_ascii_uppercase();
    let reserved = matches!(
        base.as_str(),
        "CON" | "PRN" | "AUX" | "NUL" | "CONIN$" | "CONOUT$"
    ) || (base.len() == 4
        && (base.starts_with("COM") || base.starts_with("LPT"))
        && base.as_bytes()[3].is_ascii_digit());
    !reserved
        && !name.is_empty()
        && name.len() <= 160
        && !name.ends_with(['.', ' '])
        && !name
            .chars()
            .any(|c| c.is_control() || "\\/:*?\"<>|".contains(c))
        && name != "."
        && name != ".."
}
/// HLC1: 8-token groups; flag=1 denotes a 2-byte (11-bit distance, 5-bit length) match.
/// Window 2048, match length 3..34. The signed plain length terminates the stream.
pub fn compress(input: &[u8]) -> Vec<u8> {
    let mut table = vec![usize::MAX; 4096];
    let mut out = Vec::new();
    let mut at = 0;
    while at < input.len() {
        let flag = out.len();
        out.push(0);
        for bit in 0..8 {
            if at == input.len() {
                break;
            }
            let mut length = 0;
            let mut distance = 0;
            if at + 2 < input.len() {
                let hash = (input[at] as usize * 251
                    + input[at + 1] as usize * 31
                    + input[at + 2] as usize)
                    & 4095;
                let from = table[hash];
                table[hash] = at;
                if from < at && at - from <= 2048 {
                    while length < 34
                        && at + length < input.len()
                        && input[from + length] == input[at + length]
                    {
                        length += 1;
                    }
                    distance = at - from;
                }
            }
            if length >= 3 {
                out[flag] |= 1 << bit;
                out.extend_from_slice(
                    &((((distance - 1) << 5) | (length - 3)) as u16).to_le_bytes(),
                );
                at += length;
            } else {
                out.push(input[at]);
                at += 1;
            }
        }
    }
    out
}
/// Runs only after victory. A failed save keeps the in-memory recording available.
pub fn save_prompt(
    terminal: &mut crate::terminal::Terminal,
    record: &mut Recording,
    mut blocked: u8,
) -> crate::error::Result<()> {
    use crate::event::{self, Event, KeyCode, KeyEventKind, KeyModifiers};
    let mut name = String::new();
    let mut status = "Name your victory proof";
    let mut saved = false;
    let mut enter_held = false;
    loop {
        let mut screen = String::from("\r\n  HALLS / ESCAPED\r\n\r\n  ");
        screen.push_str(status);
        screen.push_str("\r\n\r\n  > ");
        screen.push_str(&name);
        if !name.ends_with(".hproof") {
            screen.push_str(".hproof");
        }
        screen.push_str(if saved {
            "\r\n\r\n  Saved beside halls.exe. ENTER / ESC: main menu\r\n"
        } else {
            "\r\n\r\n  ENTER: save   BACKSPACE: edit   ESC: skip export\r\n"
        });
        terminal.text_screen(&screen)?;
        let next_event = event::read()?;
        let Event::Key(key) = next_event else {
            continue;
        };
        let bit = match key.code {
            KeyCode::Char('w' | 'W') => 1,
            KeyCode::Char('s' | 'S') => 2,
            KeyCode::Char('a' | 'A') => 4,
            KeyCode::Char('d' | 'D') => 8,
            KeyCode::Left => 16,
            KeyCode::Right => 32,
            KeyCode::Up => 64,
            KeyCode::Down => 128,
            _ => 0,
        };
        if key.kind == KeyEventKind::Release {
            if key.code == KeyCode::Enter {
                enter_held = false;
            }
            blocked &= !bit;
            continue;
        }
        if blocked & bit != 0 {
            continue;
        }
        if key.code == KeyCode::Esc {
            return Ok(());
        }
        if key.modifiers.contains(KeyModifiers::CONTROL) {
            continue;
        }
        if key.code == KeyCode::Enter && terminal.key_releases() {
            if enter_held {
                continue;
            }
            enter_held = true;
        }
        match key.code {
            KeyCode::Enter if saved => return Ok(()),
            KeyCode::Enter => {
                if !valid_name(&name) {
                    status = "Use a filename, without a path";
                    continue;
                }
                terminal.text_screen("\r\n  Signing and encrypting proof...\r\n")?;
                match record.export(&name) {
                    Ok(()) => {
                        saved = true;
                        status = "VICTORY PROOF SAVED";
                    }
                    Err(80 | 183) => status = "File exists. Choose another name.",
                    Err(-2) => status = "Encryption failed. Press ENTER to retry.",
                    Err(_) => status = "Write failed. Check the game folder permissions.",
                }
            }
            KeyCode::Char('\u{8}' | '\u{7f}') if !saved => {
                name.pop();
            }
            KeyCode::Char(c) if !saved && !c.is_control() && name.len() + c.len_utf8() <= 160 => {
                name.push(c)
            }
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn names_cannot_escape_executable_directory() {
        for s in ["", "..", "../x", "x/y", "C:x", "x\\y", "x\n", "x.", "x "] {
            assert!(!valid_name(s));
        }
        assert!(valid_name("通关-2026"));
    }
    #[test]
    fn records_controls_hit_camera_and_every_entity_without_quantization() {
        let map = Map::procedural(42).unwrap();
        let mut game = Game::new(&map);
        let mut player = Player::new(&map);
        let mut record = Recording::new(&map, &game, &player);
        game.running = true;
        game.flashlight = false;
        game.progress.health = 66.;
        game.progress.seconds = 42.;
        game.knocked = 0.18;
        game.shock = 0.3;
        player.camera.pitch = -0.75;
        player.camera.yaw = 3.5;
        player.distance = 123.25;
        for e in &mut game.progress.entities {
            e.hate = 97.;
            e.attack_left = 0.31;
            e.move_blend = 0.82;
            e.mood = crate::entity::Mood::Chase;
            e.replan = -0.3;
        }
        let action = [-0.1, 0.2, -0.01, 0.02];
        record.tick(&game, &player, 0.05, action, 0xa5);
        let w = &record.previous;
        assert_eq!(w[1], 0x1a5);
        assert_eq!(&w[2..6], &action.map(f32::to_bits));
        assert_eq!(w[10], (-0.75_f32).to_bits());
        assert_eq!(w[11], 123.25_f32.to_bits());
        assert_eq!(w[19], 66_f32.to_bits());
        let camera = game.visual_camera(&player);
        assert_eq!(w[13], camera.position.y.to_bits());
        assert_eq!(w[17], camera.roll.to_bits());
        for i in 0..4 {
            let k = 24 + i * 12;
            assert_eq!(w[k + 5], 0.31_f32.to_bits());
            assert_eq!(w[k + 6], 97_f32.to_bits());
            assert_eq!(w[k + 10], (-0.3_f32).to_bits());
            assert_eq!(w[k + 11], 2);
        }
    }
    #[test]
    fn compression_roundtrips_overlap_and_incompressible_bytes() {
        for data in [
            vec![],
            vec![0; 10000],
            (0..20000).map(|i| ((i * i + i / 7) % 251) as u8).collect(),
        ] {
            let packed = compress(&data);
            let mut output = Vec::new();
            let mut i = 0;
            while output.len() < data.len() {
                let flags = packed[i];
                i += 1;
                for bit in 0..8 {
                    if output.len() == data.len() {
                        break;
                    }
                    if flags & (1 << bit) == 0 {
                        output.push(packed[i]);
                        i += 1;
                    } else {
                        let token = u16::from_le_bytes([packed[i], packed[i + 1]]) as usize;
                        i += 2;
                        for _ in 0..(token & 31) + 3 {
                            let b = output[output.len() - (token >> 5) - 1];
                            output.push(b);
                        }
                    }
                }
            }
            assert_eq!(i, packed.len());
            assert_eq!(output, data);
        }
    }
    #[test]
    fn death_never_unlocks_export_and_victory_freezes_recording() {
        let map = Map::generated(7, 42).unwrap();
        let mut game = Game::new(&map);
        let mut player = Player::new(&map);
        let mut lost = Recording::new(&map, &game, &player);
        player.won = true;
        game.progress.health = 0.;
        lost.tick(&game, &player, 0.02, [0.; 4], 0);
        assert_eq!(lost.export("lost"), Err(-1));
        player.won = false;
        game.progress.health = 100.;
        let mut won = Recording::new(&map, &game, &player);
        player.won = true;
        won.tick(&game, &player, 0.02, [0.; 4], 1);
        assert!(won.complete);
        let before = won.data.clone();
        won.tick(&game, &player, 0.02, [1.; 4], 255);
        assert_eq!(won.frames, 2);
        assert_eq!(won.data, before);
    }
    #[test]
    fn losing_or_unfinished_recordings_cannot_export() {
        let map = Map::generated(7, 42).unwrap();
        let game = Game::new(&map);
        let player = Player::new(&map);
        let mut record = Recording::new(&map, &game, &player);
        assert_eq!(record.export("test"), Err(-1));
    }
}
