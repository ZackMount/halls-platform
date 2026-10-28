//! Organizer-only build of exact client gameplay modules, without signing keys.
#[macro_use]
extern crate alloc;
#[allow(unused_imports)]
mod prelude {
    pub use crate::runtime::Float;
    pub use alloc::{
        boxed::Box,
        string::{String, ToString},
        vec::Vec,
    };
}
pub mod battery;
pub mod bitmap;
pub mod coins;
pub mod entity;
pub mod error;
pub mod game;
pub mod lighting;
mod map_file;
mod map_generator;
mod map_grammar;
pub mod math;
#[cfg(target_arch = "x86_64")]
mod math_x87;
pub mod mesh;
pub mod player;
#[allow(dead_code)]
pub mod runtime;
pub mod world;
