use pbkdf2::{
    password_hash::{ PasswordHash, PasswordHasher, PasswordVerifier,SaltString},
    Pbkdf2,
};

fn generate_salt(user_id: &str, user_name: &str) -> SaltString{

    let salt_input = format!("{}{}", user_id, user_name);
    SaltString::from_b64(&salt_input).expect("Failed to create Salt!")
}


pub fn etch_pass(user_id:&str,user_name:&str,password: &str) -> String{
    let salt = generate_salt(user_id, user_name); 
 
    // Hash password to PHC string ($pbkdf2-sha256$...)
    //can panic 
    let password_hash = Pbkdf2.hash_password(password.as_bytes(), &salt).unwrap().to_string(); 

    // Verify password against PHC string
    let parsed_hash = PasswordHash::new(&password_hash).unwrap();
    assert!(Pbkdf2.verify_password(password.as_bytes(), &parsed_hash).is_ok());
    password_hash
}
