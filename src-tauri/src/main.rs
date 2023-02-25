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

pub mod vault_access;
pub mod db; 
pub mod schema;



struct AppState{
    conn  : std::sync::Mutex<diesel::SqliteConnection>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[tauri::command]
fn register(state: tauri::State<AppState>,name: &str, password: &str) -> bool {
    let conn = state.conn.lock().unwrap();
    let hash_value = vault_access::generate_hash(password);
    let res = db::insert_pst(&conn, name, &hash_value);
    //print the result
    println!("Register result : {}", res);
    true
}



fn main() {
    let conn = db::establish_connection();
  diesel_migrations::run_pending_migrations(&conn).expect("Error migrating");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,register])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

