#![cfg_attr(not(any(feature = "tools", test)), no_std)]
#[macro_use]
extern crate alloc;
mod prelude {
    pub use crate::runtime::Float;
    pub use alloc::{
        boxed::Box,
        string::{String, ToString},
        vec::Vec,
    };
}
pub mod app;
pub mod audio;
pub mod bitmap;
pub mod console;
pub mod entity;
pub mod error;
pub mod event;
pub mod game;
pub mod math;
pub mod menu;
pub mod mesh;
pub mod player;
pub mod proof;
pub mod render;
pub mod runtime;
pub mod terminal;
pub mod world;

#[cfg(feature = "tools")]
mod map_file;

#[cfg(all(target_os = "windows", target_arch = "x86_64"))]
core::arch::global_asm!(include_str!("win64_memory.s"));

#[cfg(target_arch = "x86_64")]
mod math_x87;

mod map_generator;
mod map_grammar;
