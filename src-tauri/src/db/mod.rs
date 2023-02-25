extern crate dotenv; 


pub mod models; 
use crate::schema::*;
use diesel::prelude::*;
use dotenv::dotenv; 
use models::{NewPst, Pst};
use std::env;



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
    let res_json = serde_json::to_string(&res).unwrap();
    res_json
}

pub fn get_pst<'a>(conn: &SqliteConnection , username: &'a  str ) -> String {
    use crate::schema::pst::dsl::*;
    let res = pst.filter(name.eq(username)).load::<Pst>(conn).expect("Error loading pst");
    let res_json = serde_json::to_string(&res).unwrap();
    res_json
}