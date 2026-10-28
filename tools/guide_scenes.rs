//! Staged shots, using the current client's renderer, entity animation and battery.
use halls::{
    entity::{self, Entity, Mood},
    error::Result,
    game::Game,
    math::{Camera, Vec3},
    mesh::Mesh,
    player::Player,
    render::Renderer,
    world::Map,
};
use std::path::Path;
mod hud;
const FPS: usize = 24;
const DT: f32 = 1. / FPS as f32;
fn ease(t: f32) -> f32 {
    let t = t.clamp(0., 1.);
    t * t * t * (t * (t * 6. - 15.) + 10.)
}
fn v(x: f32, y: f32, z: f32) -> Vec3 {
    Vec3::new(x, y, z)
}
fn glide(from: Vec3, to: Vec3, time: f32) -> Vec3 {
    let delta = to - from;
    from + delta * (1.2 * time / delta.dot(delta).sqrt())
}
fn look(at: Vec3, target: Vec3, roll: f32) -> Camera {
    let d = target - at;
    Camera {
        position: at,
        yaw: d.x.atan2(d.z),
        pitch: d.y.atan2(d.x.hypot(d.z)),
        roll,
        fov: 70f32.to_radians(),
    }
}
fn save(
    r: &mut Renderer,
    m: &Mesh,
    c: Camera,
    dir: &Path,
    i: usize,
    n: usize,
    preview: bool,
    height: usize,
) -> Result<()> {
    if !preview || i == 0 || i == n / 2 || i == n - 1 {
        r.render(m, c, 960, height)
            .ppm(&dir.join(format!("{i:04}.ppm")))?;
    }
    Ok(())
}
fn studio() -> Result<Map> {
    let mut m = Map::backrooms(65, 42)?;
    m.halls.clear();
    m.entities.clear();
    m.elevations.clear();
    m.blocks.clear();
    for z in 0..65 {
        for x in 0..65 {
            m.set_wall(x, z, true);
        }
    }
    for [x0, z0, x1, z1] in [
        [2, 2, 18, 20],
        [3, 20, 8, 62],
        [18, 6, 37, 8],
        [34, 8, 37, 27],
        [16, 20, 26, 22],
        [23, 20, 38, 35],
        [37, 26, 42, 30],
        [39, 28, 50, 38],
    ] {
        for z in z0..=z1 {
            for x in x0..=x1 {
                m.set_wall(x, z, false);
            }
        }
    }
    for [x, z] in [
        [5, 7],
        [11, 7],
        [5, 14],
        [11, 14],
        [16, 14],
        [26, 25],
        [31, 28],
        [35, 24],
        [44, 33],
    ] {
        m.set_wall(x, z, true);
    }
    m.spawn.x = 8.;
    m.spawn.z = 9.;
    m.spawn.yaw = 0.;
    m.exit = [48, 36];
    Ok(m)
}
fn patrol(m: &Map, start: [usize; 2], target: [usize; 2], seed: u64) -> Entity {
    let mut e = Entity::at_cell(m, start, seed);
    e.target = target;
    e.path = entity::path(m, start, target);
    e.replan = 100.;
    e.idle = 0.;
    e.yaw = ((target[0] as f32 - start[0] as f32).atan2(target[1] as f32 - start[1] as f32))
        .rem_euclid(std::f32::consts::TAU);
    e
}
fn draw_exit(
    game: &mut Game,
    player: &mut Player,
    map: &Map,
    mesh: &mut Mesh,
    camera: Camera,
    time: f32,
) {
    player.camera = camera;
    game.tick(map, player, 0.);
    game.progress.seconds = time;
    game.add_geometry(map, mesh);
}
fn trailer(root: &Path, preview: bool) -> Result<()> {
    let map = studio()?;
    let mut mesh = Mesh::from_map(&map);
    let base = mesh.triangles.len();
    let mut observer = Player::new(&map);
    observer.camera.position = v(123., 1.55, 123.);
    let mut r = Renderer {
        retro: false,
        ..Default::default()
    };
    let mut game = Game::new(&map);
    game.progress.entities.clear();
    let mut ghost = Player::new(&map);
    let lengths = [5., 4.5, 5., 5., 5., 5.5];
    let mut shots = String::from("shot,seconds,frames\n");
    for (shot, seconds) in lengths.into_iter().enumerate() {
        let n = ((seconds + if shot < 5 { 0.5 } else { 0. }) * FPS as f32) as usize;
        let dir = root.join(format!("shot-{shot}"));
        std::fs::create_dir_all(&dir)?;
        let mut entities = if shot == 2 {
            vec![patrol(&map, [9, 10], [9, 18], 42)]
        } else {
            vec![]
        };
        for i in 0..n {
            let t = i as f32 / FPS as f32;
            let u = t / (seconds + if shot < 5 { 0.5 } else { 0. });
            for e in &mut entities {
                e.tick(&map, &observer, 20. + t, DT, 0., false);
                assert_eq!(e.mood, Mood::Roam);
            }
            let cam = match shot {
                0 => look(
                    glide(v(8., 1.65, 9.), v(13., 1.50, 14.), t),
                    v(27., 1.15, 34.),
                    -0.055 * u,
                ),
                1 => look(
                    glide(v(42., 0.72, 14.), v(58., 1.10, 14.3), t),
                    v(70., 1.25, 15.),
                    -0.10 + 0.17 * u,
                ),
                2 => look(
                    v(14.8, 1.45, 21.5 + 1.2 * t),
                    v(entities[0].position[0], 1.22, entities[0].position[1]),
                    -0.04 + 0.08 * u,
                ),
                3 => look(
                    glide(v(11., 2.02, 43.), v(12., 1.40, 55.), t),
                    v(11., 1.60, 126.),
                    0.095 - 0.19 * u,
                ),
                4 => look(
                    glide(v(55., 1.45, 48.), v(58., 1.70, 54.), t),
                    v(64., 1.2, 63.),
                    -0.065 + 0.11 * u,
                ),
                _ => look(
                    glide(v(92., 1.40, 67.), v(96., 1.0, 70.), t),
                    v(97., 0.30, 73.),
                    -0.05 + 0.065 * u,
                ),
            };
            assert!(
                map.walkable(cam.position.x, cam.position.z, 0.08),
                "camera inside wall shot {shot} frame {i}"
            );
            mesh.triangles.truncate(base);
            for e in &entities {
                e.draw(&map, &mut mesh, 20. + t);
            }
            draw_exit(&mut game, &mut ghost, &map, &mut mesh, cam, 20. + t);
            save(&mut r, &mesh, cam, &dir, i, n, preview, 540)?;
        }
        shots.push_str(&format!("{shot},{seconds},{n}\n"));
        println!("trailer shot {shot} ready");
    }
    std::fs::write(root.join("shots.csv"), shots)?;
    Ok(())
}
fn close_room() -> Result<Map> {
    let mut m = Map::backrooms(17, 42)?;
    m.halls.clear();
    m.entities.clear();
    m.blocks.clear();
    m.elevations.clear();
    for z in 1..16 {
        for x in 1..16 {
            m.set_wall(x, z, false);
        }
    }
    for p in [[5, 12], [11, 12], [8, 14]] {
        m.set_wall(p[0], p[1], true);
    }
    m.spawn.x = 17.;
    m.spawn.z = 9.;
    m.spawn.yaw = 0.;
    m.exit = [0, 0];
    Ok(m)
}
fn subjects(root: &Path, kind: &str, preview: bool) -> Result<()> {
    let map = close_room()?;
    let mut player = Player::new(&map);
    let mut mesh = Mesh::from_map(&map);
    let base = mesh.triangles.len();
    let mut r = Renderer {
        retro: false,
        flashlight: true,
        ..Default::default()
    };
    let dir = root.join(kind);
    std::fs::create_dir_all(&dir)?;
    if kind == "walk" {
        player.camera.position = v(3., 1.55, 3.);
        let mut e = patrol(&map, [8, 6], [8, 12], 42);
        let n = 7 * FPS;
        for i in 0..n {
            let t = i as f32 / FPS as f32;
            e.tick(&map, &player, 20. + t, DT, 0., false);
            let a = 2.42 + 0.3 * ease(t / 7.);
            let cam = look(
                v(
                    e.position[0] + a.cos() * 4.2,
                    1.28,
                    e.position[1] + a.sin() * 4.2,
                ),
                v(e.position[0], 1.2, e.position[1]),
                0.,
            );
            mesh.triangles.truncate(base);
            e.draw(&map, &mut mesh, 20. + t);
            save(&mut r, &mesh, cam, &dir, i, n, preview, 540)?;
        }
    } else if kind == "alert" {
        player.camera.position.z += 2.5;
        let mut e = Entity::at_cell(&map, [8, 7], 42);
        e.yaw = std::f32::consts::PI;
        let n = 7 * FPS;
        for i in 0..n {
            let t = i as f32 / FPS as f32;
            e.hate = ((t - 1.5) * halls::entity::HATE_GAIN).clamp(0., 100.);
            e.mood = if e.hate > 35. {
                Mood::Chase
            } else {
                Mood::Roam
            };
            mesh.triangles.truncate(base);
            e.draw(&map, &mut mesh, 20. + t);
            let cam = look(
                player.camera.position,
                v(e.position[0], 1.25, e.position[1]),
                0.,
            );
            save(&mut r, &mesh, cam, &dir, i, n, preview, 540)?;
        }
    } else {
        let mut game = Game::new(&map);
        game.progress.entities.clear();
        let mut e = Entity::at_cell(&map, [8, 6], 42);
        e.yaw = std::f32::consts::PI;
        e.hate = 100.;
        e.mood = Mood::Chase;
        game.progress.entities.push(e);
        let mut hits = 0;
        let mut hp = 100.;
        let mut dead = None;
        let mut trace = String::from("frame,health\n");
        let n = 10 * FPS;
        for i in 0..n {
            game.capture_damage_ready();
            game.tick(&map, &mut player, DT);
            game.progress.seconds = (i + 1) as f32 * DT;
            if game.progress.health < hp {
                hp = game.progress.health;
                hits += 1;
                trace.push_str(&format!("{i},{hp}\n"));
            }
            if game.dead() {
                if dead.is_none() {
                    dead = Some(i);
                }
                for e in &mut game.progress.entities {
                    e.speed = 0.;
                    e.move_blend = (e.move_blend - DT * 4.).max(0.);
                    e.attack_left = (e.attack_left - DT).max(0.);
                }
            }
            mesh.triangles.truncate(base);
            game.add_geometry(&map, &mut mesh);
            let cam = game.visual_camera(&player);
            if !preview || i == 0 || i == n / 2 || i == n - 1 {
                let mut f = r.render(&mesh, cam, 960, 540);
                if game.shock > 0. {
                    for p in &mut f.pixels {
                        p.0 = p.0.saturating_add((game.shock * 28.) as u8);
                        p.1 = (p.1 as f32 * 0.62) as u8;
                        p.2 = (p.2 as f32 * 0.56) as u8;
                    }
                }
                f.ppm(&dir.join(format!("{i:04}.ppm")))?;
            }
        }
        assert_eq!(hits, 3);
        assert!(game.dead() && n - dead.unwrap() > 2 * FPS);
        std::fs::write(root.join("attack-hits.csv"), trace)?;
        std::fs::write(
            root.join("attack-dead-frame.txt"),
            dead.unwrap().to_string(),
        )?;
    }
    println!("{kind} ready");
    Ok(())
}
fn exit(root: &Path, preview: bool) -> Result<()> {
    let map = studio()?;
    let mut player = Player::new(&map);
    player.camera.position = v(97., 1.55, 66.);
    player.camera.yaw = 0.;
    player.camera.pitch = -0.28;
    let mut game = Game::new(&map);
    game.progress.entities.clear();
    let mut mesh = Mesh::from_map(&map);
    let base = mesh.triangles.len();
    let mut r = Renderer {
        retro: false,
        ..Default::default()
    };
    let dir = root.join("exit");
    std::fs::create_dir_all(&dir)?;
    let n = 8 * FPS;
    let mut won = None;
    for i in 0..n {
        if i >= FPS && !player.won {
            player.move_by(&map, 2.7 * DT, 0.);
        }
        game.tick(&map, &mut player, DT);
        game.progress.seconds = (i + 1) as f32 * DT;
        if player.won && won.is_none() {
            won = Some(i);
        }
        mesh.triangles.truncate(base);
        game.add_geometry(&map, &mut mesh);
        save(&mut r, &mesh, player.camera, &dir, i, n, preview, 540)?;
    }
    assert!(player.won && n - won.unwrap() > 2 * FPS);
    std::fs::write(root.join("exit-won-frame.txt"), won.unwrap().to_string())?;
    println!("exit ready");
    Ok(())
}
fn flashlight(root: &Path, preview: bool) -> Result<()> {
    // An unlit passage bends into a lit corridor; the two broken fixtures in
    // the dark leg follow the production seeded lamp rule, not a lighting override.
    let mut map = Map::backrooms(17, 43)?;
    map.halls.clear();
    map.entities.clear();
    map.blocks.clear();
    map.elevations.clear();
    for z in 0..17 {
        for x in 0..17 {
            let dark = (3..=4).contains(&x) && (3..=6).contains(&z)
                || (1..=2).contains(&x) && (3..=4).contains(&z);
            let lit = (3..=10).contains(&x) && (7..=9).contains(&z);
            map.set_wall(x, z, !(dark || lit));
        }
    }
    map.spawn.x = 19.;
    map.spawn.z = 17.;
    map.exit = [9, 8];
    let mesh = Mesh::from_map(&map);
    let mut r = Renderer {
        retro: false,
        flashlight: true,
        ..Default::default()
    };
    let mut battery = halls::battery::Battery::default();
    let mut on = true;
    // Begin midway through a run; all time inside the delivered clip is real time.
    for _ in 0..1440 {
        battery.tick(&mut on, 0.05);
    }
    battery.toggle();
    battery.tick(&mut on, 0.);
    let dir = root.join("flashlight");
    std::fs::create_dir_all(&dir)?;
    let n = 10 * FPS;
    let mut trace = String::from("frame,video_seconds,charge,on,zoom\n");
    for i in 0..n {
        let t = i as f32 / FPS as f32;
        battery.tick(&mut on, if i == 0 { 0. } else { DT });
        if i == FPS {
            battery.toggle();
            battery.tick(&mut on, 0.);
        }
        r.flashlight = on;
        let zoom = if t < 3. {
            0.
        } else if t < 5. {
            ease((t - 3.) / 2.)
        } else {
            1.
        };
        let cam = Camera {
            position: v(10.5, 1.55, 16.0),
            yaw: -2.75 + 0.015 * (t * 0.35).sin(),
            pitch: -0.06,
            roll: 0.,
            fov: 70f32.to_radians(),
        };
        save(&mut r, &mesh, cam, &dir, i, n, preview, 524)?;
        let footer = hud::Hud::capture(
            120,
            "HP 100 / [ ] vol / M sound 100% / WALK / WASD / Z run / ESC pause",
            battery.charge,
            on,
        );
        std::fs::write(dir.join(format!("{i:04}.ansi")), footer)?;
        trace.push_str(&format!(
            "{i},{t:0.6},{:0.6},{},{zoom:0.6}\n",
            battery.charge, on as u8
        ));
    }
    std::fs::write(root.join("flashlight.csv"), trace)?;
    println!("flashlight ready (10 seconds, 1x)");
    Ok(())
}
fn main() -> Result<()> {
    let args: Vec<_> = std::env::args().collect();
    let root = Path::new(&args[1]);
    std::fs::create_dir_all(root)?;
    let only = args.get(2).map(String::as_str).unwrap_or("all");
    let preview = args.iter().any(|s| s == "--preview");
    if only == "all" || only == "exploration" {
        trailer(root, preview)?;
    }
    for kind in ["walk", "alert", "attack"] {
        if only == "all" || only == kind {
            subjects(root, kind, preview)?;
        }
    }
    if only == "all" || only == "exit" {
        exit(root, preview)?;
    }
    if only == "all" || only == "flashlight" {
        flashlight(root, preview)?;
    }
    Ok(())
}
