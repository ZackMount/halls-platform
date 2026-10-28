//! Organizer-only, version-pinned replay model. No part is linked into halls.exe.
use halls::{entity, game::Game, math::Vec3, player::Player, world::Map};
use std::io::{self, Read, Write};

fn snapshot(game: &Game, player: &Player) -> [u32; 84] {
    let mut row = [0; 84];
    let p = player.camera;
    let c = game.visual_camera(player);
    for (at, value) in [
        p.position.x,
        p.position.y,
        p.position.z,
        p.yaw,
        p.pitch,
        player.distance,
        c.position.x,
        c.position.y,
        c.position.z,
        c.yaw,
        c.pitch,
        c.roll,
        c.fov,
        game.progress.health,
        game.knocked,
        game.shock,
        game.progress.seconds,
    ]
    .into_iter()
    .enumerate()
    {
        row[6 + at] = value.to_bits();
    }
    row[23] = player.won as u32 | ((game.dead() as u32) << 1);
    for (i, e) in game.progress.entities.iter().enumerate() {
        let k = 24 + i * 12;
        for (at, value) in [
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
        ]
        .into_iter()
        .enumerate()
        {
            row[k + at] = value.to_bits();
        }
        row[k + 11] = e.mood as u32;
    }
    row
}

// Condition each step on the observed public state, retaining the independently
// reconstructed path, RNG, goal, idle/sight timers, strike flag and damage immunity.
// This limits cross-platform rounding drift without accepting the next state.
fn anchor(row: &[u32], game: &mut Game, player: &mut Player) {
    let f = |n: usize| f32::from_bits(row[n]);
    player.camera.position = Vec3::new(f(6), f(7), f(8));
    player.camera.yaw = f(9);
    player.camera.pitch = f(10);
    player.distance = f(11);
    player.won = row[23] & 1 != 0;
    game.progress.health = f(19);
    game.knocked = f(20);
    game.shock = f(21);
    game.progress.seconds = f(22);
    for (i, e) in game.progress.entities.iter_mut().enumerate() {
        let k = 24 + i * 12;
        e.position = [f(k), f(k + 1)];
        e.yaw = f(k + 2);
        e.travel = f(k + 3);
        e.move_blend = f(k + 4);
        e.attack_left = f(k + 5);
        e.hate = f(k + 6);
        e.speed = f(k + 7);
        e.last_seen = f(k + 8);
        e.cooldown = f(k + 9);
        e.replan = f(k + 10);
        e.mood = [
            entity::Mood::Roam,
            entity::Mood::Investigate,
            entity::Mood::Chase,
            entity::Mood::Search,
        ][row[k + 11] as usize];
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<_> = std::env::args().skip(1).collect();
    if !args.is_empty() {
        if args.len() != 2 || args[0] != "--lamps" {
            return Err("model arguments".into());
        }
        let map = Map::procedural(args[1].parse::<u64>()?)?;
        io::stdout().write_all(&halls::lighting::bits(&map))?;
        return Ok(());
    }
    let mut input = Vec::new();
    io::stdin()
        .take(256 * 1024 * 1024 + 65)
        .read_to_end(&mut input)?;
    // The server selects this engine only for the authenticated HLR5 build.
    if input.len() < 64
        || &input[..4] != b"HJM2"
        || !matches!(
            u32::from_le_bytes(input[4..8].try_into()?),
            0x000B_0002 | 0x000B_0003
        )
    {
        return Err("model build/header".into());
    }
    let build = u32::from_le_bytes(input[4..8].try_into()?);
    input.drain(4..8);
    let u64_at = |n| u64::from_le_bytes(input[n..n + 8].try_into().unwrap());
    let seed = u64_at(4);
    let forms: Vec<_> = (0..5).map(|i| u64_at(12 + i * 8)).collect();
    let exit = [
        u16::from_le_bytes(input[52..54].try_into()?) as usize,
        u16::from_le_bytes(input[54..56].try_into()?) as usize,
    ];
    let count = u32::from_le_bytes(input[56..60].try_into()?) as usize;
    if !(2..=900_000).contains(&count)
        || input.len() != 60 + count * 336
        || exit.iter().any(|&n| n >= 256)
    {
        return Err("model length/exit".into());
    }
    let words: Vec<u32> = input[60..]
        .as_chunks::<4>()
        .0
        .iter()
        .map(|b| u32::from_le_bytes(*b))
        .collect();
    // Independent hard bounds protect the model from untrusted signed input.
    for row in words.as_chunks::<84>().0 {
        let f = |i| f32::from_bits(row[i]);
        for (i, &value) in row.iter().enumerate() {
            if i == 1 || i == 23 || (i >= 24 && (i - 24) % 12 == 11) {
                continue;
            }
            if !f32::from_bits(value).is_finite() || f32::from_bits(value).abs() > 1.0e7 {
                return Err("model numeric range".into());
            }
        }
        if !(0.0..=0.1).contains(&f(0))
            || (2..6).any(|i| f(i).abs() > 1.0)
            || !(0.0..512.0).contains(&f(6))
            || !(0.0..512.0).contains(&f(8))
        {
            return Err("model input range".into());
        }
        for k in (24..84).step_by(12) {
            if !(0.0..512.0).contains(&f(k))
                || !(0.0..512.0).contains(&f(k + 1))
                || row[k + 11] > 3
                || !(0.0..=10.0).contains(&f(k + 7))
            {
                return Err("model entity range".into());
            }
        }
    }
    let mut map = Map::procedural(seed)?;
    let canonical_exit = map.exit;
    let run_seed = forms[0] ^ seed ^ 0x9e3779b97f4a7c15;
    let mut game = Game::new(&map);
    game.progress.entities = entity::spawn_with_seed(&map, run_seed);
    if game.progress.entities.len() != 5 {
        return Err("model entity count".into());
    }
    let mut player = Player::new(&map);
    let mut out = io::BufWriter::new(io::stdout().lock());
    out.write_all(b"HJO2")?;
    for n in canonical_exit {
        out.write_all(&(n as u16).to_le_bytes())?;
    }
    for e in &game.progress.entities {
        out.write_all(&e.form_seed.to_le_bytes())?;
    }
    for byte in 0..8192 {
        let bits = (0..8).fold(0u8, |bits, b| {
            let i = byte * 8 + b;
            bits | ((map.wall(i % 256, i / 256) as u8) << b)
        });
        out.write_all(&[bits])?;
    }
    // Exit policy is separate from dynamics: even a shortened test course can
    // be evaluated, but the canonical-exit rule rejects it by default.
    map.exit = exit;
    for (tick, row) in words.as_chunks::<84>().0.iter().enumerate() {
        if tick != 0 {
            let f = |i| f32::from_bits(row[i]);
            game.running = row[1] & 256 != 0;
            // The recorded lamp flag is the result of this tick, not its input.
            // Rebuild the battery before AI perception, in the same order as app.rs.
            if row[1] & 1024 != 0 {
                game.battery.toggle();
            }
            // Resource consistency is also checked independently by the server.
            if game.knocked <= 0.0 && !game.dead() && !player.won {
                player.turn(f(4), f(5));
                player.move_by(&map, f(2), f(3));
            }
            game.tick(&map, &mut player, f(0));
        }
        for value in snapshot(&game, &player) {
            out.write_all(&value.to_le_bytes())?;
        }
        anchor(row, &mut game, &mut player);
    }
    if build >= 0x000B_0003 {
        out.write_all(&halls::lighting::bits(&map))?;
    }
    out.flush()?;
    Ok(())
}
