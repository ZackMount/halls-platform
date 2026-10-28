use std::{env, path::PathBuf, process::Command};
fn run(command: &mut Command) {
    assert!(command.status().expect("native model compiler").success());
}
fn main() {
    let out = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let target = env::var("TARGET").unwrap();
    let windows = target.contains("windows");
    println!("cargo:rerun-if-changed=src/entity_vm.s");
    println!("cargo:rerun-if-changed=src/model_os.c");
    let assembly = std::fs::read_to_string("src/entity_vm.s").unwrap();
    let assembly = assembly
        .lines()
        .filter(|line| windows || !line.trim().starts_with(".seh_"))
        .collect::<Vec<_>>()
        .join("\n");
    std::fs::write(out.join("entity_vm.s"), assembly).unwrap();
    let suffix = target.replace('-', "_");
    let setting = |key: &str| env::var(format!("{key}_{suffix}")).or_else(|_| env::var(key));
    let object = out.join(if windows {
        "model_os.obj"
    } else {
        "model_os.o"
    });
    let archive = out.join(if windows {
        "model_os.lib"
    } else {
        "libmodel_os.a"
    });
    if windows {
        run(Command::new(setting("CC").unwrap_or_else(|_| "cl".into()))
            .args(["/nologo", "/O1", "/c", "src/model_os.c"])
            .arg(format!("/Fo{}", object.display())));
        run(Command::new(setting("AR").unwrap_or_else(|_| "lib".into()))
            .arg("/nologo")
            .arg(format!("/OUT:{}", archive.display()))
            .arg(object));
        println!("cargo:rustc-link-lib=bcrypt");
    } else {
        run(Command::new(setting("CC").unwrap_or_else(|_| "cc".into()))
            .args(["-Os", "-c", "src/model_os.c", "-o"])
            .arg(&object));
        run(Command::new(setting("AR").unwrap_or_else(|_| "ar".into()))
            .arg("crs")
            .arg(archive)
            .arg(object));
        if !target.contains("apple") {
            println!("cargo:rustc-link-lib=m");
        }
    }
    println!("cargo:rustc-link-search=native={}", out.display());
    println!("cargo:rustc-link-lib=static=model_os");
}
