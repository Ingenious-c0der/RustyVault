pub struct User{
    id: Option<i32> , 
}


impl User{
    pub fn new() -> Self{
        Self{
            id: None,
        }
    }
    pub fn set_id(&mut self, id:i32){
        self.id = Some(id);
    }
    pub fn get_id(&self) -> Option<&i32>{
        self.id.as_ref()
    }
}