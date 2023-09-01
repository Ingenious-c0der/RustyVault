pub struct User {
    id: Option<i32>,
    name: Option<String>,
}

impl User {
    pub fn new() -> Self {
        Self {
            id: None,
            name: None,
        }
    }
    pub fn set_id(&mut self, id: i32) {
        self.id = Some(id);
    }
    pub fn get_id(&self) -> Option<&i32> {
        self.id.as_ref()
    }
    pub fn set_name(&mut self, name: String) {
        self.name = Some(name);
    }
    pub fn get_name(&self) -> Option<&str> {
        self.name.as_deref()
    }
    pub fn clear_user(&mut self) {
        self.name = None;
        self.id = None;
    }
}
