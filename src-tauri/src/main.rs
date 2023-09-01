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
    //println!("Registering user {0} {1}", name, password);
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
    //println!("Register result : {}", res);
    let res_json = json!({
        "error":false,
        "message": "User Registered Successfully"
    });
    return res_json;
}

#[tauri::command]
fn login(state: tauri::State<AppState>, name: &str, password: &str) -> bool {
    //println!("Logging in user {0} {1}", name, password);
    let conn = state.conn.lock().unwrap();
    let res_json = db::get_pst(&conn, name).unwrap_or_else({
        |_e| {
            //println!("Error : {}", e);
            String::from("Login Error")
        }
    });
    let res_json: serde_json::Value = serde_json::from_str(&res_json).unwrap();
    let pass_hash = res_json["password"].to_string();
    let id = res_json["id"].to_string();
    //println!("ID as string {}", id);
    if pass_hash == "Error" {
        return false;
    }
    let res = vault_access::verify_hash(&pass_hash, password);
    if !res {
        return false;
    };

    //print the result
    //println!("creating etched key");
    let salt_input = format!("{}{}", id, name);
    //let etched_key = hash_etching::etch_pass( password,&salt_input);
    let etched_key = vault_access::generate_etch_key_mat(password, &salt_input);
    //println!("etched key : {}", etched_key);
    let id_i32: i32; //id as i32
    if let Some(id) = res_json["id"].as_i64() {
        id_i32 = id as i32;
        //println!("ID as i32: {}", id_i32);
    } else {
        //println!("No valid ID found in DB");
        return false;
    }
    //println!(" User id set in the state {}", id_i32);
    state.etch_key.lock().unwrap().set_key(etched_key);
    state.user.lock().unwrap().set_id(id_i32);
    state.user.lock().unwrap().set_name(name.to_string());
    //println!("Login result : {} {} ", res, pass_hash);
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
    //println!("Creating vault : {}", vault);

    use serde_json::json;
    let etched_key_gaurd = state.etch_key.lock().unwrap();
    let etched_key = etched_key_gaurd.get_key().unwrap();
    //println!("etched key : {}", etched_key);
    if etched_key == "Error" {
        let res_json = json!({
            "error":true,
            "message": "Error in creating vault,please Relogin!"
        });
        return res_json;
    };

    let mut password = vault["data"].to_string();
    // let  password_rectified = vault["data"].as_str().unwrap().trim();
    // assert_eq!(password_rectified,"");
    use rand_core::{OsRng, RngCore};
    //all hail json, empty string is in the actually {"data":"\"\""}
    // Fix with as_str as in password_rectified later
    if password == "\"\"" {
        //create password if it does not exist
        let mut rng = OsRng::default();
        let random_pass: String = (0..15)
            .map(|_| {
                let random_byte = rng.next_u32() as u8;
                char::from(random_byte % 94 + 33) // Generate characters from ASCII range 33 to 126
            })
            .collect();
        //println!("Generated password : {}", random_pass);
        password = random_pass;
    };
    let password = password.trim();
    let vault_name = vault["name"].as_str().unwrap().trim();
    //create a random number from 1-11
    let mut rng = OsRng::default();
    let random_num: u8 = rng.next_u32() as u8 % 11 + 1;
    let vault_icon = format!("{}", random_num);
    let encrypted_pass = crypto_process::encrypt(&password, &etched_key);
    //println!("Encrypted password : {}", encrypted_pass);

    let user_id_guard = state.user.lock().unwrap();
    let user_id = user_id_guard.get_id().unwrap();
    let conn = state.conn.lock().unwrap();
    let res = db::insert_vault(&conn, &user_id, &vault_name, &encrypted_pass, &vault_icon).unwrap(); // need to return vault-id here
                                                                                                     //println!("Vault creation result : {}", res);

    if res == "1" {
        let res_json = json!({
            "error":false,
            "message": "Vault Created Successfully"
        });
        return res_json;
    } else {
        let res_json = json!({
            "error":true,
            "message": "Error in creating vault"
        });
        return res_json;
    }
}

#[tauri::command]
fn edit_vault(state: tauri::State<AppState>, vault: serde_json::Value) -> serde_json::Value {
    let vault_id_recv = vault["vault_id"].as_str().unwrap().trim();
    //println!("Editing vault with id : {}", vault_id_recv);
    use serde_json::json;
    let etched_key_gaurd = state.etch_key.lock().unwrap();
    let etched_key = etched_key_gaurd.get_key().unwrap();
    //println!("etched key : {}", etched_key);
    if etched_key == "Error" {
        let res_json = json!({
            "error":true,
            "message": "Error in editing vault,please Relogin!"
        });
        return res_json;
    };

    let mut password = vault["data"].to_string();
    // let mut password_rectified = vault["data"].as_str().unwrap().trim();
    // assert_eq!(password_rectified,"");
    use rand_core::{OsRng, RngCore};
    //all hail json, empty string is in the actually {"data":"\"\""}
    if password == "\"\"" {
        //create password if it does not exist
        let mut rng = OsRng::default();
        let random_pass: String = (0..15)
            .map(|_| {
                let random_byte = rng.next_u32() as u8;
                char::from(random_byte % 94 + 33) // Generate characters from ASCII range 33 to 126
            })
            .collect();
        //println!("Generated password : {}", random_pass);
        password = random_pass;
    };
    let password = password.trim();
    let vault_name = vault["name"].as_str().unwrap().trim();
    //create a random number from 1-11
    let mut rng = OsRng::default();
    let random_num: u8 = rng.next_u32() as u8 % 11 + 1;
    let vault_icon = format!("{}", random_num);
    let encrypted_pass = crypto_process::encrypt(&password, &etched_key);
    //println!("Encrypted password : {}", encrypted_pass);
    let conn = state.conn.lock().unwrap();
    let res = db::edit_vault_by_id(
        &conn,
        vault_id_recv,
        vault_name,
        &encrypted_pass,
        &vault_icon,
    )
    .unwrap(); // need to return vault-id here
               //println!("Vault edit result : {}", res);

    if res == "1" {
        let res_json = json!({
            "error":false,
            "message": "Vault Edited Successfully"
        });
        return res_json;
    } else {
        let res_json = json!({
            "error":true,
            "message": "Error in editing vault"
        });
        return res_json;
    }
}

#[tauri::command]
fn delete_vault(state: tauri::State<AppState>, vault_id: &str) -> serde_json::Value {
    //println!("Deleting vault with id : {}", vault_id);
    let conn = state.conn.lock().unwrap();
    let res = db::delete_vault_by_id(&conn, vault_id).unwrap();
    //println!("Vault deletion result : {}", res);
    use serde_json::json;
    if res == "1" {
        let res_json = json!({
            "error":false,
            "message": "Vault Deleted Successfully"
        });
        return res_json;
    } else {
        let res_json = json!({
            "error":true,
            "message": "Error in Deleting vault"
        });
        return res_json;
    }
}

#[tauri::command]
fn get_password(state: tauri::State<AppState>, vault_id: &str) -> String {
    //println!("Getting password for vault id : {}", vault_id);
    let etched_key_gaurd = state.etch_key.lock().unwrap();
    let etched_key = etched_key_gaurd.get_key().unwrap();
    if etched_key == "Error" {
        return String::from("Error getting etched key");
    };
    let conn = state.conn.lock().unwrap();
    let res_json = db::get_vault_key_by_id(&conn, vault_id);
    //println!("res_json : {}", res_json);
    let key_json = &res_json["key"];
    //let res_json: serde_json::Value = serde_json::from_str(&res_json).unwrap();
    //let encrypted_pass = res_json["ciphertext"].to_string();
    //res json print -> res_json : "{\"ciphertext\":\"wDrx5+1SJlsc0rXLiUoo4wrZR/v1fUKJHly8XPrpd1wf\",\"nonce\":\"OZ7f4T6Qu6FD47PZ\"}"
    let password = crypto_process::decrypt(key_json, &etched_key);
    //println!("Password : {}", password);
    password
}

#[tauri::command]
fn get_all_user_vaults(state: tauri::State<AppState>) -> serde_json::Value {
    //println!("Getting all user vaults");
    let user_id_guard = state.user.lock().unwrap();
    let user_id = user_id_guard.get_id().unwrap();
    let conn = state.conn.lock().unwrap();
    let res = db::get_all_vaults_by_user_id(&conn, *user_id).unwrap(); // need to return vault-id here

    let res_json = serde_json::json!({
        "error":false,
        "message": "Vaults found",
        "vaults":res
    });
    res_json
}
#[tauri::command]
fn get_username(state: tauri::State<AppState>) -> serde_json::Value {
    //println!("Getting username");
    let user_name_guard = state.user.lock().unwrap();
    let user_name = user_name_guard.get_name().unwrap();
    let res_json = serde_json::json!({
        "error":false,
        "message": "Username found",
        "username":user_name
    });
    res_json
}

#[tauri::command]
fn logout(state: tauri::State<AppState>) -> String {
    //clear the app state
    state.etch_key.lock().unwrap().clear_key();
    state.user.lock().unwrap().clear_user();
    String::from("Logged out")
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
            get_password,
            get_all_user_vaults,
            delete_vault,
            edit_vault,
            get_username,
            logout
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    // use serde_json::Value;
    // let combined_data_string = "{\"ciphertext\":\"wDrx5+1SJlsc0rXLiUoo4wrZR/v1fUKJHly8XPrpd1wf\",\"nonce\":\"OZ7f4T6Qu6FD47PZ\"}";
    // // Parse the JSON string into a serde_json::Value object
    // let combined_data: Value = serde_json::from_str(combined_data_string).unwrap();
    // println!("combined_data: {}", combined_data);
    // // Extract nonce and ciphertext strings
    // let nonce_string = combined_data.get("nonce").and_then(Value::as_str).unwrap_or_default();
    // let ciphertext_string = combined_data.get("ciphertext").and_then(Value::as_str).unwrap_or_default();

    // println!("Nonce: {}", nonce_string);
    // println!("Ciphertext: {}", ciphertext_string);
}
