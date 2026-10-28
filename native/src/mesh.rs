#[allow(unused_imports)]
use crate::prelude::*;
use crate::{
    math::{Vec2, Vec3},
    world::Map,
};

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Material {
    Wall,
    Floor,
    Ceiling,
    Trim,
    Light,
    Exit,
    Panel,
    Green,
    Wire,
    Rage,
}
#[derive(Clone, Copy, Debug)]
pub struct Vertex {
    pub p: Vec3,
    pub uv: Vec2,
    pub light: f32,
}
#[derive(Clone, Copy, Debug)]
pub struct Triangle {
    pub vertices: [Vertex; 3],
    pub normal: Vec3,
    pub material: Material,
}
#[derive(Default)]
pub struct Mesh {
    pub triangles: Vec<Triangle>,
}

struct Builder<'a> {
    map: &'a Map,
    lights: Vec<Option<Vec3>>,
    triangles: Vec<Triangle>,
}
impl Builder<'_> {
    #[cfg_attr(feature = "size-audit", inline(never))]
    fn illumination(&self, p: Vec3, n: Vec3) -> f32 {
        let p = p + n * 0.025;
        let mut light = 0.065 + 0.045 * (n.y * 0.5 + 0.5);
        let cx = (p.x / self.map.tile_size).floor() as i32;
        let cz = (p.z / self.map.tile_size).floor() as i32;
        let radius = (7.0 / self.map.tile_size).ceil() as i32;
        for z in cz - radius..=cz + radius {
            for x in cx - radius..=cx + radius {
                if x < 0 || z < 0 || x >= self.map.width() as i32 || z >= self.map.height() as i32 {
                    continue;
                }
                let Some(lamp) = self.lights[z as usize * self.map.width() + x as usize] else {
                    continue;
                };
                let delta = lamp - p;
                let d2 = delta.dot(delta);
                if d2 > 49.0 {
                    continue;
                }
                let incidence = n.dot(delta.normalized()).max(0.0);
                if incidence > 0.0 && self.map.light_visible(p, lamp) {
                    light += 2.7 * incidence / (1.0 + d2 * 0.35);
                }
            }
        }
        light.min(1.6)
    }
    fn quad(&mut self, p: [Vec3; 4], uv: [Vec2; 4], material: Material) {
        let normal = (p[1] - p[0]).cross(p[2] - p[0]).normalized();
        let v = core::array::from_fn::<_, 4, _>(|i| Vertex {
            p: p[i],
            uv: uv[i],
            light: if matches!(material, Material::Light | Material::Exit | Material::Green) {
                1.0
            } else {
                self.illumination(p[i], normal)
            },
        });
        append_quad(&mut self.triangles, v, normal, material);
    }
    fn wall(&mut self, p: [Vec3; 4], material: Material, trim: bool) {
        let width = (p[1] - p[0]).length();
        let start = p[0].x + p[0].z;
        let uv = [
            Vec2::new(start, p[0].y),
            Vec2::new(start + width, p[1].y),
            Vec2::new(start + width, p[2].y),
            Vec2::new(start, p[3].y),
        ];
        self.quad(p, uv, material);
        if trim {
            let normal = (p[1] - p[0]).cross(p[2] - p[0]).normalized();
            let q = [
                p[0] + normal * 0.006,
                p[1] + normal * 0.006,
                p[1] + normal * 0.006 + Vec3::new(0.0, 0.12, 0.0),
                p[0] + normal * 0.006 + Vec3::new(0.0, 0.12, 0.0),
            ];
            self.quad(q, [Vec2::default(); 4], Material::Trim);
        }
    }
    #[cfg(any(feature = "tools", test))]
    #[cfg_attr(feature = "size-audit", inline(never))]
    fn box_mesh(&mut self, min: Vec3, max: Vec3, material: Material) {
        for (face, corners) in [
            [0, 4, 6, 2],
            [5, 1, 3, 7],
            [1, 0, 2, 3],
            [4, 5, 7, 6],
            [2, 6, 7, 3],
            [0, 1, 5, 4],
        ]
        .into_iter()
        .enumerate()
        {
            let p = corners.map(|i| {
                Vec3::new(
                    if i & 1 == 0 { min.x } else { max.x },
                    if i & 2 == 0 { min.y } else { max.y },
                    if i & 4 == 0 { min.z } else { max.z },
                )
            });
            if face < 4 {
                self.wall(p, material, false);
            } else {
                self.quad(p, [Vec2::default(); 4], material);
            }
        }
    }
}

impl Mesh {
    pub fn add_quad(&mut self, p: [Vec3; 4], material: Material) {
        let normal = (p[1] - p[0]).cross(p[2] - p[0]).normalized();
        let vertices = p.map(|p| Vertex {
            p,
            uv: Vec2::default(),
            light: 1.0,
        });
        append_quad(&mut self.triangles, vertices, normal, material);
    }
    pub fn from_map(map: &Map) -> Self {
        let s = map.tile_size;
        let c = map.ceiling;
        let mut lights = vec![None; map.width() * map.height()];
        let mut fixtures = vec![];
        for z in 0..map.height() {
            for x in 0..map.width() {
                if !map.wall(x as i32, z as i32)
                    && ((x + 2 * z) % 4 == 0
                        || [x, z] == [(map.spawn.x / s) as usize, (map.spawn.z / s) as usize])
                {
                    let lamp = Vec3::new((x as f32 + 0.5) * s, c - 0.15, (z as f32 + 0.5) * s);
                    let active = !((x * 37 + z * 19) as u64 ^ map.seed).is_multiple_of(7)
                        || [x, z] == [(map.spawn.x / s) as usize, (map.spawn.z / s) as usize];
                    fixtures.push((lamp, active));
                    if active {
                        lights[z * map.width() + x] = Some(lamp);
                    }
                }
            }
        }
        let mut b = Builder {
            map,
            lights,
            triangles: vec![],
        };
        for z in 0..map.height() {
            for x in 0..map.width() {
                if map.wall(x as i32, z as i32) {
                    continue;
                }
                let (x0, z0) = (x as f32 * s, z as f32 * s);
                let (x1, z1) = (x0 + s, z0 + s);
                let (h00, h10, h01, h11) = (
                    map.cell_floor(x, z, 0.0, 0.0),
                    map.cell_floor(x, z, 1.0, 0.0),
                    map.cell_floor(x, z, 0.0, 1.0),
                    map.cell_floor(x, z, 1.0, 1.0),
                );
                b.quad(
                    [
                        Vec3::new(x0, h00, z0),
                        Vec3::new(x0, h01, z1),
                        Vec3::new(x1, h11, z1),
                        Vec3::new(x1, h10, z0),
                    ],
                    [
                        Vec2::new(x0, z0),
                        Vec2::new(x0, z1),
                        Vec2::new(x1, z1),
                        Vec2::new(x1, z0),
                    ],
                    if [x, z] == map.exit {
                        Material::Green
                    } else {
                        Material::Floor
                    },
                );
                b.quad(
                    [
                        Vec3::new(x0, c, z0),
                        Vec3::new(x1, c, z0),
                        Vec3::new(x1, c, z1),
                        Vec3::new(x0, c, z1),
                    ],
                    [
                        Vec2::new(x0, z0),
                        Vec2::new(x1, z0),
                        Vec2::new(x1, z1),
                        Vec2::new(x0, z1),
                    ],
                    Material::Ceiling,
                );
                let boundaries = [
                    (
                        x as i32,
                        z as i32 - 1,
                        [
                            Vec3::new(x0, h00, z0),
                            Vec3::new(x1, h10, z0),
                            Vec3::new(x1, c, z0),
                            Vec3::new(x0, c, z0),
                        ],
                    ),
                    (
                        x as i32 + 1,
                        z as i32,
                        [
                            Vec3::new(x1, h10, z0),
                            Vec3::new(x1, h11, z1),
                            Vec3::new(x1, c, z1),
                            Vec3::new(x1, c, z0),
                        ],
                    ),
                    (
                        x as i32,
                        z as i32 + 1,
                        [
                            Vec3::new(x1, h11, z1),
                            Vec3::new(x0, h01, z1),
                            Vec3::new(x0, c, z1),
                            Vec3::new(x1, c, z1),
                        ],
                    ),
                    (
                        x as i32 - 1,
                        z as i32,
                        [
                            Vec3::new(x0, h01, z1),
                            Vec3::new(x0, h00, z0),
                            Vec3::new(x0, c, z0),
                            Vec3::new(x0, c, z1),
                        ],
                    ),
                ];
                for (nx, nz, p) in boundaries {
                    if map.wall(nx, nz) {
                        b.wall(p, Material::Wall, true);
                    } else {
                        // An exposed riser between different floor heights is actual geometry.
                        let at = |point: Vec3| {
                            map.cell_floor(
                                nx as usize,
                                nz as usize,
                                (point.x / s - nx as f32).clamp(0.0, 1.0),
                                (point.z / s - nz as f32).clamp(0.0, 1.0),
                            )
                        };
                        let (a, d) = (at(p[0]), at(p[1]));
                        if a > p[0].y + 0.001 || d > p[1].y + 0.001 {
                            b.wall(
                                [
                                    p[0],
                                    p[1],
                                    Vec3::new(p[1].x, d.max(p[1].y), p[1].z),
                                    Vec3::new(p[0].x, a.max(p[0].y), p[0].z),
                                ],
                                Material::Wall,
                                false,
                            );
                        }
                    }
                }
            }
        }
        for (lamp, active) in fixtures {
            let broad = 0.27;
            b.quad(
                [
                    Vec3::new(lamp.x - 0.55, c - 0.015, lamp.z - broad),
                    Vec3::new(lamp.x + 0.55, c - 0.015, lamp.z - broad),
                    Vec3::new(lamp.x + 0.55, c - 0.015, lamp.z + broad),
                    Vec3::new(lamp.x - 0.55, c - 0.015, lamp.z + broad),
                ],
                [Vec2::default(); 4],
                if active {
                    Material::Light
                } else {
                    Material::Panel
                },
            );
        }
        #[cfg(any(feature = "tools", test))]
        for block in &map.blocks {
            b.box_mesh(
                Vec3::new(block.min[0], block.min[1], block.min[2]),
                Vec3::new(block.max[0], block.max[1], block.max[2]),
                Material::Wall,
            );
        }

        Self {
            triangles: b.triangles,
        }
    }
}

fn append_quad(out: &mut Vec<Triangle>, v: [Vertex; 4], normal: Vec3, material: Material) {
    out.extend_from_slice(&[
        Triangle {
            vertices: [v[0], v[1], v[2]],
            normal,
            material,
        },
        Triangle {
            vertices: [v[0], v[2], v[3]],
            normal,
            material,
        },
    ]);
}
