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
use std::sync::Mutex;
use diesel::prelude::*;
pub mod vault_access;
pub mod db; 
pub mod schema;
pub mod key_store;
pub mod hash_etching;


//something here throws state not managed error by tauri

struct AppState{
    conn  : Mutex<SqliteConnection>,
    etch_key : Mutex<key_store::EtchedKey>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn register(state: tauri::State<AppState>,name: &str, password: &str) -> bool {
    println!("Registering user {0} {1}", name, password);
    let conn = state.conn.lock().unwrap();
    let hash_value = vault_access::generate_hash(password);
    let res = db::insert_pst(&conn, name, &hash_value);
    //print the result
    println!("Register result : {}", res);
    true
}

#[tauri::command]
fn login(state: tauri::State<AppState>,name: &str, password: &str) -> bool {
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
    let etched_key = hash_etching::etch_pass(&id, name, password);
    state.etch_key.lock().unwrap().set_key(etched_key);
    println!("Login result : {} {} ", res , pass_hash);
    res
}




// #[tauri::command]
// fn passwordGen()



fn main() {
    let conn = db::establish_connection();
    let state = AppState {
        conn: Mutex::new(db::establish_connection()),
        etch_key: Mutex::new(key_store::EtchedKey::new()),
    };
  diesel_migrations::run_pending_migrations(&conn).expect("Error migrating");
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![greet,register,login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

