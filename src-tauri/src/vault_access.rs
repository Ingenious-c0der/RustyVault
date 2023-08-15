use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString,Salt
    },
    Argon2,
}; 
fn pad_to_length(input: &str, target_length: usize) -> String {
    let mut padded_string = String::from(input);
    
    while padded_string.len() < target_length {
        padded_string.push_str(input);
    }
    
    padded_string[..target_length].to_string()
}
pub fn generate_hash(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), salt.as_ref())
        .unwrap()
        .to_string();
    //TODO :Remove verifier from here.
    let parsed_hash = PasswordHash::new(&hash).unwrap() ;
    assert!(Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok());
    println!("Generated Hash: {}", hash); 
    hash
}

pub fn verify_hash(hash: &str, password: &str) -> bool {

    let hash = &hash[1..hash.len() - 1];
    let this_hash = PasswordHash::new(hash).unwrap();
    Argon2::default().verify_password(password.as_bytes(), &this_hash).is_ok()
}


pub fn generate_etch(password: &str, salt_str: &str) -> String {
    let padd_salt_str = pad_to_length(salt_str, 20);
    println!("Salt custom: {}", padd_salt_str);
    let salt = Salt::new(&padd_salt_str).unwrap();
    
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), salt.as_ref())
        .unwrap()
        .to_string();
    // TODO: Remove verifier from here.
    let parsed_hash = PasswordHash::new(&hash).unwrap();
    assert!(Argon2::default().verify_password(password.as_bytes(), &parsed_hash).is_ok());
    println!("Generated Hash: {}", hash);
    hash
}