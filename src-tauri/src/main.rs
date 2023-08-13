#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use diesel_migrations::embed_migrations;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;
embed_migrations!("../migrations/");
use diesel::prelude::*;
use std::sync::Mutex;
pub mod crypto_process;
pub mod db;
pub mod hash_etching;
pub mod key_store;
pub mod schema;
pub mod user;
pub mod vault_access;

struct AppState {
    conn: Mutex<SqliteConnection>,
    etch_key: Mutex<key_store::EtchedKey>,
    user: Mutex<user::User>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn register(state: tauri::State<AppState>, name: &str, password: &str) -> serde_json::Value {
    println!("Registering user {0} {1}", name, password);
    let conn = state.conn.lock().unwrap();
    let hash_value = vault_access::generate_hash(password);
    let res = db::insert_pst(&conn, name, &hash_value);
    use serde_json::json;
    if res == "uexists" {
        //return json object with error

        let res_json = json!({
            "error":true,
            "message": "User already exists"
        });
        return res_json;
    }
    //print the result
    println!("Register result : {}", res);
    let res_json = json!({
        "error":false,
        "message": "User Registered Successfully"
    });
    return res_json;
}

#[tauri::command]
fn login(state: tauri::State<AppState>, name: &str, password: &str) -> bool {
    println!("Logging in user {0} {1}", name, password);
    let conn = state.conn.lock().unwrap();
    let res_json = db::get_pst(&conn, name).unwrap_or_else({
        |e| {
            println!("Error : {}", e);
            String::from("Error")
        }
    });
    let res_json: serde_json::Value = serde_json::from_str(&res_json).unwrap();
    let pass_hash = res_json["password"].to_string();
    let id = res_json["id"].to_string();
    if pass_hash == "Error" {
        return false;
    }
    let res = vault_access::verify_hash(&pass_hash, password);
    //print the result
    println!("creating etched key");
    let etched_key = hash_etching::etch_pass(&id, name, password);
    let id_i32 = 0; //id as i32
    if let Some(id) = res_json["id"].as_i64() {
        let id_i32 = id as i32;
        println!("ID as i32: {}", id_i32);
    } else {
        println!("No valid ID found in DB");
        return false;
    }
    state.etch_key.lock().unwrap().set_key(etched_key);
    state.user.lock().unwrap().set_id(id_i32);
    println!("Login result : {} {} ", res, pass_hash);
    res
}

// the vault json format should be as follows
// {
//     name: "xyzx",
//     data: "the password"
//     icon: "the icon path"
// }
// if data is empty auto gen password

#[tauri::command]
fn create_vault(state: tauri::State<AppState>, vault: serde_json::Value) -> serde_json::Value {
    use serde_json::json;
    let etched_key_gaurd = state.etch_key.lock().unwrap();
    let etched_key = etched_key_gaurd.get_key().unwrap();
    if etched_key == "Error" {
        let res_json = json!({
            "error":true,
            "message": "Error in creating vault,please Relogin!"
        });
        return res_json;
    };

    let mut password = vault["data"].to_string();

    use rand_core::{OsRng, RngCore};
    if password == "" {
        //create password if it does not exist
        let mut rng = OsRng::default();
        let random_pass: String = (0..15)
            .map(|_| {
                let random_byte = rng.next_u32() as u8;
                char::from(random_byte % 94 + 33) // Generate characters from ASCII range 33 to 126
            })
            .collect();
        password = random_pass;
    };
    let password = password.trim();
    let vault_name = vault["name"].as_str().unwrap().trim();
    let vault_icon = vault["icon"].as_str().unwrap().trim();
    let encrypted_pass = crypto_process::encrypt(&password, &etched_key);
    let user_id_guard = state.user.lock().unwrap();
    let user_id = user_id_guard.get_id().unwrap();
    let conn = state.conn.lock().unwrap();
    let res = db::insert_vault(&conn, &user_id, &vault_name, &encrypted_pass, &vault_icon).unwrap();
    println!("Vault creation result : {}", res);
    let res_json = json!({
        "error":false,
        "message": "Vault Created Successfully"
    });
    return res_json;
}


#[tauri::command]
fn get_password(state: tauri::State<AppState>,vault_id: &str) -> String{
    let etched_key_gaurd = state.etch_key.lock().unwrap();
    let etched_key = etched_key_gaurd.get_key().unwrap();
    if etched_key == "Error" {
        return String::from("Error getting etched key");
    };
    let conn = state.conn.lock().unwrap();
    let res_json = db::get_vault(&conn, vault_id).unwrap_or_else({
        |e| {
            println!("Error : {}", e);
            String::from("Error in getting vault")
        }
    });
    let res_json: serde_json::Value = serde_json::from_str(&res_json).unwrap();
    let encrypted_pass = res_json["key"].to_string();
    let password = crypto_process::decrypt(&encrypted_pass, &etched_key);
    password

}

fn main() {
    let conn = db::establish_connection();
    let state = AppState {
        conn: Mutex::new(db::establish_connection()),
        etch_key: Mutex::new(key_store::EtchedKey::new()),
        user: Mutex::new(user::User::new()),
    };
    diesel_migrations::run_pending_migrations(&conn).expect("Error migrating");
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            greet,
            register,
            login,
            create_vault,
            get_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
