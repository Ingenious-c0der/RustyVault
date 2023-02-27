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


//something here throws state not managed error by tauri

struct AppState{
    conn  : Mutex<SqliteConnection>,
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



fn main() {
    let conn = db::establish_connection();
    let state = AppState {
        conn: Mutex::new(db::establish_connection()),
    };
  
  diesel_migrations::run_pending_migrations(&conn).expect("Error migrating");
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![greet,register])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

