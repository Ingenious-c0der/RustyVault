use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString,Salt
    },
    Argon2,
}; 
use sha2::{Digest, Sha256};



fn generate_sha256_hash(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input);
    let result = hasher.finalize();
    let hash_hex = format!("{:x}", result);
    hash_hex
}
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
    let hashed_padd_salt_str = generate_sha256_hash(&padd_salt_str);
    println!("Salt custom: {}", hashed_padd_salt_str);
    let salt = Salt::new(&hashed_padd_salt_str).unwrap();
    
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


//same as generate_etch but uses output_key_material as reccomended by Argon2 writers
pub fn generate_etch_key_mat(password: &str, salt_str: &str) -> String {
    let padd_salt_str = pad_to_length(salt_str, 20);
    let hashed_padd_salt_str = generate_sha256_hash(&padd_salt_str);
    println!("Salt custom: {}", hashed_padd_salt_str);
    let salt = Salt::new(&hashed_padd_salt_str).unwrap();
    let argon2 = Argon2::default();
    let mut output_key_material = [0u8; 32]; // Can be any desired size
    argon2
        .hash_password_into(password.as_bytes(), salt.as_bytes(),output_key_material.as_mut_slice()).unwrap();
    //convert to string 
    let hash_string = base64::encode(output_key_material);
    println!("Generated Hash: {}", hash_string);
    hash_string
}

//TODO: Check which one is more secure 
// R2EZXhDPQsIWYr/+2/M9iPK+68pbeGrJd5GRTOhKY8k= (mat_key)
// versus 
// $argon2id$v=19$m=4096,t=3,p=1$b82267ec5494790dfc9078b8e5500a3af8a36e29e526d2d3630db82f9a2769a3$nLzgdcyhfr7nRgKldCmdt3THcO6hFTQf5UcN+6oPcNQ (pure_password_hash)