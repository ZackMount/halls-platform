#![cfg_attr(not(any(feature = "tools", test)), no_std)]
#![cfg_attr(not(any(feature = "tools", test)), no_main)]
#[cfg(all(
    not(all(target_os = "windows", target_arch = "x86_64")),
    not(any(feature = "tools", test))
))]
compile_error!("Windows x64 player only; the parent project provides portable builds.");
#[cfg(not(any(feature = "tools", test)))]
#[global_allocator]
static ALLOCATOR: halls::runtime::Allocator = halls::runtime::Allocator;
#[cfg(not(any(feature = "tools", test)))]
#[panic_handler]
fn panic(_: &core::panic::PanicInfo<'_>) -> ! {
    halls::runtime::exit(1)
}
use halls::{
    app, console,
    error::Result,
    menu::{self, Choice},
    world::{Map, fresh_seed},
};
fn run() -> Result<()> {
    let mut scale = 1;
    loop {
        let map = Map::procedural(fresh_seed())?;
        if menu::start(&map, &mut scale)? == Choice::Quit || !app::run(map, &mut scale)?.return_menu
        {
            break;
        }
    }
    Ok(())
}
fn entry() -> i32 {
    match run() {
        Ok(()) => 0,
        Err(error) => {
            console::error(error.message());
            1
        }
    }
}
#[cfg(not(any(feature = "tools", test)))]
#[unsafe(no_mangle)]
pub extern "system" fn halls_entry() -> ! {
    halls::runtime::exit(entry())
}
#[cfg(any(feature = "tools", test))]
fn main() {
    std::process::exit(entry());
}

// Stock alloc can retain unwind metadata even in an aborting application.
// Any unexpected foreign unwind terminates instead of entering a Rust unwinder.
#[cfg(not(any(feature = "tools", test)))]
#[unsafe(no_mangle)]
pub extern "C" fn rust_eh_personality() -> ! {
    halls::runtime::exit(1)
}
