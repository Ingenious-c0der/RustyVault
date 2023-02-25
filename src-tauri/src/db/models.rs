use crate::schema::pst; 
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


