//! Guide-only camera tour using the production procedural map and renderer.
use halls::{entity, error::Result, mesh::Mesh, player::Player, render::Renderer, world::Map};
use std::{
    f32::consts::{PI, TAU},
    path::Path,
};
fn main() -> Result<()> {
    let folder = std::env::args().nth(1).expect("frame directory");
    let folder = Path::new(&folder);
    std::fs::create_dir_all(folder)?;
    let map = Map::procedural(104729)?;
    let player = Player::new(&map);
    let start = [
        (player.camera.position.x / 2.) as usize,
        (player.camera.position.z / 2.) as usize,
    ];
    let route = entity::path(&map, start, map.exit);
    let mut points = vec![[player.camera.position.x, player.camera.position.z]];
    points.extend(route.iter().map(|n| {
        [
            (*n as usize % map.width()) as f32 * 2. + 1.,
            (*n as usize / map.width()) as f32 * 2. + 1.,
        ]
    }));
    assert!(points.len() > 30);
    let point = |distance: f32| {
        let mut left = distance;
        for pair in points.windows(2) {
            let dx = pair[1][0] - pair[0][0];
            let dz = pair[1][1] - pair[0][1];
            let length = dx.hypot(dz);
            if left <= length {
                return [
                    pair[0][0] + dx * left / length,
                    pair[0][1] + dz * left / length,
                ];
            }
            left -= length;
        }
        *points.last().unwrap()
    };
    let mesh = Mesh::from_map(&map);
    let mut renderer = Renderer::default();
    let mut camera = player.camera;
    let first = point(1.2);
    camera.yaw = (first[0] - points[0][0]).atan2(first[1] - points[0][1]);
    // Thirty seconds of moving footage; fades are applied in place after capture.
    for i in 0..600 {
        let t = i as f32 / 20.;
        let p = point(t * 1.7);
        let ahead = point(t * 1.7 + 1.2);
        let desired = (ahead[0] - p[0]).atan2(ahead[1] - p[1]);
        let angle = (desired - camera.yaw + PI).rem_euclid(TAU) - PI;
        camera.yaw = (camera.yaw + angle * 0.19).rem_euclid(TAU);
        camera.position.x = p[0];
        camera.position.z = p[1];
        camera.position.y = map.eye_height + (t * 5.5).sin() * 0.012;
        camera.pitch = (t * 0.3).sin() * 0.018;
        renderer
            .render_scaled(&mesh, camera, 640, 360, 2)
            .ppm(&folder.join(format!("{i:04}.ppm")))?;
    }
    println!("600 frames / 30 seconds / 51 metres");
    Ok(())
}
