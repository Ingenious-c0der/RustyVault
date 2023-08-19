extern crate dotenv; 

//file contains methods to interact with the database through ORM


pub mod models; 
use diesel::prelude::*;
use crate::schema::*; 
use dotenv::dotenv; 
use models::{NewPst, Pst,Vault,NewVault};
use std::env;
use std::error::Error;
use std::error::Error as StdError;
use uuid::Uuid;



fn generate_vault_id() -> String {
    Uuid::new_v4().to_string()
}

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok(); 
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set"); 
    SqliteConnection::establish(&database_url).unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}


pub fn insert_pst<'a>(conn: &SqliteConnection, username: &'a str, upassword: &'a str) -> String {
    
    // Check if the username already exists
    let existing_user = pst::table.filter(pst::name.eq(username)).first::<Pst>(conn).optional();
    
    if existing_user.unwrap().is_some() {
        return String::from("uexists");
    }

    let new_pst = NewPst {
        name:username,
        password:upassword
    };
    let res = diesel::insert_into(pst::table)
        .values(&new_pst)
        .execute(conn)
        .expect("Error adding new User"); 
    //might need to create struct containing bool and string value to return
    let res_json = serde_json::to_string(&res).unwrap();
    res_json
}

pub fn get_pst<'a>(conn: &SqliteConnection , username: &'a  str ) ->Result<String,Box<dyn Error>> {
    use crate::schema::pst::dsl::*;
    let res = pst.filter(name.eq(username)).load::<Pst>(conn).expect("Error loading pst");
    //handle the not matched case 
    if res.len() == 0 {
        return Err("No user found".into());
    }
    use::serde_json::json;
    let json_obj = json!({
        "id":res[0].id,
        "password":res[0].password
    });
    let res_json = serde_json::to_string(&json_obj).unwrap();
    Ok(res_json)
}


pub fn insert_vault<'a>(conn: &SqliteConnection, user_id: &'a i32, name: &'a str, key: &'a str, icon_path: &'a str) -> Result<String, Box<dyn StdError>> {
    let new_vault = NewVault {
        vault_id: &generate_vault_id(),
        user_id,
        name,
        key,
        icon_path,
    };
    let res = diesel::insert_into(vault::table)
        .values(&new_vault)
        .execute(conn)
        .expect("Error adding new Vault");
    let res_json = serde_json::to_string(&res).unwrap();
    Ok(res_json)
}

pub fn get_vault_key_by_id<'a>(conn: &SqliteConnection, vault_id_recv: &'a str) -> serde_json::Value {
    use crate::schema::vault::dsl::*;
    let res = vault
        .filter(vault_id.eq(vault_id_recv))
        .load::<Vault>(conn)
        .expect("Error loading vault");
    if res.len() == 0 {
        return serde_json::json!({
            "error":true,
            "message":"No vault found"
        });
    }
    
    let res_json = serde_json::json!({
        "error":false,
        "message":"Vault found",
        "key":res[0].key
    });
    res_json
   
}

pub fn get_all_vaults_by_user_id<'a>(conn: &SqliteConnection, query_user_id: i32) -> Result<Vec<Vault>, Box<dyn StdError>> {
    use crate::schema::vault::dsl::*;
    let vaults = vault
        .filter(user_id.eq(query_user_id))
        .load::<Vault>(conn)
        .expect("Error loading vaults");
    Ok(vaults)
}