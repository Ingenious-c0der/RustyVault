use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString,
    },
    Argon2,
}; 

pub fn generate_hash(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), salt.as_ref())
        .unwrap()
        .to_string();
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