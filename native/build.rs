use std::{env, path::PathBuf, process::Command};
fn run(command: &mut Command) {
    let status = command
        .status()
        .unwrap_or_else(|e| panic!("{command:?}: {e}"));
    assert!(status.success(), "{command:?}: {status}");
}
fn words(s: &str) -> Vec<String> {
    let mut words = Vec::new();
    let mut word = String::new();
    let mut quote = None;
    for c in s.chars() {
        if Some(c) == quote {
            quote = None;
        } else if quote.is_none() && (c == '\'' || c == '"') {
            quote = Some(c);
        } else if quote.is_none() && c.is_whitespace() {
            if !word.is_empty() {
                words.push(std::mem::take(&mut word));
            }
        } else {
            word.push(c);
        }
    }
    if !word.is_empty() {
        words.push(word);
    }
    words
}
fn main() {
    let target = env::var("TARGET").unwrap();
    let host = env::var("HOST").unwrap();
    let out = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let windows = target.contains("windows");
    println!("cargo:rerun-if-changed=src/entity_vm.s");
    let assembly = std::fs::read_to_string("src/entity_vm.s").unwrap();
    let assembly = assembly
        .lines()
        .filter(|line| windows || !line.trim().starts_with(".seh_"))
        .collect::<Vec<_>>()
        .join("\n");
    std::fs::write(out.join("entity_vm.s"), assembly).unwrap();
    let suffix = target.replace('-', "_");
    let setting = |key: &str| env::var(format!("{key}_{suffix}")).or_else(|_| env::var(key));
    let mut compiler =
        setting("CC").unwrap_or_else(|_| if windows { "cl".into() } else { "cc".into() });
    let mut native_includes = Vec::new();
    let mut librarian = PathBuf::from("lib");
    if windows && host.contains("windows") && compiler == "cl" && env::var_os("INCLUDE").is_none() {
        let base = env::var_os("ProgramFiles(x86)")
            .map(PathBuf::from)
            .unwrap_or_else(|| PathBuf::from("C:/Program Files (x86)"));
        let vs = Command::new(base.join("Microsoft Visual Studio/Installer/vswhere.exe"))
            .args([
                "-latest",
                "-products",
                "*",
                "-requires",
                "Microsoft.VisualStudio.Component.VC.Tools.x86.x64",
                "-property",
                "installationPath",
            ])
            .output()
            .expect("Install Visual Studio C++ build tools");
        let install = PathBuf::from(String::from_utf8_lossy(&vs.stdout).trim());
        let latest = |folder: PathBuf| {
            let mut entries: Vec<_> = std::fs::read_dir(folder)
                .unwrap()
                .filter_map(Result::ok)
                .map(|v| v.path())
                .collect();
            entries.sort();
            entries.pop().unwrap()
        };
        let msvc = latest(install.join("VC/Tools/MSVC"));
        compiler = msvc.join("bin/Hostx64/x64/cl.exe").to_string_lossy().into();
        librarian = msvc.join("bin/Hostx64/x64/lib.exe");
        native_includes.push(msvc.join("include"));
        let sdk = latest(base.join("Windows Kits/10/Include"));
        for dir in ["ucrt", "um", "shared"] {
            native_includes.push(sdk.join(dir));
        }
    }
    println!("cargo:rerun-if-changed=src/proof_keys.h");
    let mut objects = Vec::new();
    for source in [
        "audio_backend",
        "terminal_backend",
        "runtime_backend",
        "proof_backend",
    ] {
        println!("cargo:rerun-if-changed=src/{source}.c");
        let object = out.join(format!("{source}.{}", if windows { "obj" } else { "o" }));
        let mut c = Command::new(&compiler);
        if windows {
            let crt = if env::var("CARGO_CFG_TARGET_FEATURE")
                .unwrap_or_default()
                .contains("crt-static")
            {
                "/MT"
            } else {
                "/MD"
            };
            c.args([
                "/nologo", "/O1", "/W3", "/std:c11", crt, "/GS-", "/Zl", "/c",
            ])
            .arg(format!("/Fo{}", object.display()));
            for dir in &native_includes {
                c.arg(format!("/I{}", dir.display()));
            }
        } else {
            c.args([
                "-Os",
                "-std=c11",
                "-D_DEFAULT_SOURCE",
                "-ffunction-sections",
                "-fdata-sections",
                "-c",
                "-o",
            ])
            .arg(&object);
        }
        if let Ok(flags) = setting("CFLAGS") {
            c.args(words(&flags));
        }
        c.arg(format!("src/{source}.c"));
        run(&mut c);
        objects.push(object);
    }
    let archive = out.join(if windows {
        "halls_native.lib"
    } else {
        "libhalls_native.a"
    });
    if windows {
        println!("cargo:rustc-link-arg=/DEBUG:NONE");
        let ar = setting("AR").map(PathBuf::from).unwrap_or(librarian);
        run(Command::new(ar)
            .arg("/nologo")
            .arg(format!("/OUT:{}", archive.display()))
            .args(&objects));
        println!("cargo:rustc-link-lib=winmm");
        println!("cargo:rustc-link-lib=bcrypt");
        println!("cargo:rustc-link-lib=kernel32");

        if env::var_os("CARGO_FEATURE_TOOLS").is_none() {
            println!("cargo:rustc-link-arg-bin=halls=/ENTRY:halls_entry");
            println!("cargo:rustc-link-arg-bin=halls=/NODEFAULTLIB");
            println!("cargo:rustc-link-arg-bin=halls=/SUBSYSTEM:CONSOLE");
        }
    } else {
        run(Command::new(setting("AR").unwrap_or_else(|_| "ar".into()))
            .arg("crs")
            .arg(&archive)
            .args(&objects));
        if target.contains("apple") {
            println!("cargo:rustc-link-lib=framework=AudioToolbox");
            println!("cargo:rustc-link-lib=System");
        } else {
            println!("cargo:rustc-link-lib=dl");
            println!("cargo:rustc-link-lib=pthread");
            println!("cargo:rustc-link-lib=m");
            println!("cargo:rustc-link-lib=c");
            println!("cargo:rustc-link-lib=gcc_s");
        }
    }
    println!("cargo:rustc-link-search=native={}", out.display());
    println!("cargo:rustc-link-lib=static=halls_native");
}
