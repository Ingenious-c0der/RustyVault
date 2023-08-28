use crate::schema::pst;
use crate::schema::vault;
use serde::{Deserialize, Serialize};

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Pst {
    pub id: i32,
    pub name: String,
    pub password: String,
}

#[derive(Insertable, Serialize, Clone, Debug)]
#[table_name = "pst"]
pub struct NewPst<'a> {
    pub name: &'a str,
    pub password: &'a str,
}

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Vault {
    pub vault_id: String,
    pub user_id: i32,
    pub name: String,
    pub key: String,
    pub icon_path: String,
}

#[derive(Insertable, Serialize, Clone, Debug)]
#[table_name = "vault"]
pub struct NewVault<'a> {
    pub vault_id: &'a str,
    pub user_id: &'a i32,
    pub name: &'a str,
    pub key: &'a str,
    pub icon_path: &'a str,
}
