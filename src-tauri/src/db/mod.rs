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


pub fn insert_pst<'a>(conn: &SqliteConnection, name: &'a str, password: &'a str) -> String {
    
    let new_pst = NewPst {
        name,
        password
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
    if res.len() == 0{
        return Err("No user found".into());
    }
    let res_json = serde_json::to_string(&res[0].password).unwrap();
    Ok(res_json)
}


pub fn insert_vault<'a>(conn: &SqliteConnection, user_id: &'a i32, name: &'a str, key: &'a str, icon_path: &'a str) -> Result<String, Box<dyn StdError>> {
    let new_vault = NewVault {
        user_id,
        vault_id: &generate_vault_id(),
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

pub fn get_vault<'a>(conn: &SqliteConnection, vault_name: &'a str) -> Result<String, Box<dyn StdError>> {
    use crate::schema::vault::dsl::*;
    let res = vault
        .filter(name.eq(vault_name))
        .load::<Vault>(conn)
        .expect("Error loading vault");
    if res.len() == 0 {
        return Err("No vault found".into());
    }
    let res_json = serde_json::to_string(&res[0].key).unwrap();
    Ok(res_json)
}

pub fn get_all_vaults_by_user_id<'a>(conn: &SqliteConnection, query_user_id: i32) -> Result<Vec<Vault>, Box<dyn StdError>> {
    use crate::schema::vault::dsl::*;
    let vaults = vault
        .filter(user_id.eq(query_user_id))
        .load::<Vault>(conn)
        .expect("Error loading vaults");
    Ok(vaults)
}