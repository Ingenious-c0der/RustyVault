pub struct EtchedKey {
    key: Option<String>,
}

impl EtchedKey {
    pub fn new() -> Self {
        Self { key: None }
    }
    pub fn set_key(&mut self, key: String) {
        self.key = Some(key);
    }
    pub fn get_key(&self) -> Option<&str> {
        self.key.as_deref()
    }
}
