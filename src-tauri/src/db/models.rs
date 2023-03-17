use crate::schema::pst; 
use crate::schema::key_table;
use serde:: {Deserialize, Serialize};

#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct Pst {
    pub id: i32,
    pub name: String,
    pub password: String,
}

#[derive(Insertable, Serialize, Clone, Debug)]
#[table_name = "pst"]
pub struct NewPst<'a>{
    pub name: &'a str,
    pub password: &'a str,
}



#[derive(Queryable, Serialize, Deserialize, Debug)]
pub struct KeyTable{
    pub id: i32,
    pub name: String,
    pub key: String,
    pub user_id: i32,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[table_name = "key_table"]
pub struct NewKeyTable<'a>{
    pub name: &'a str,
    pub key: &'a str,
    pub user_id: i32,
}


