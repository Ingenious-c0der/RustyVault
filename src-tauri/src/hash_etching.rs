use pbkdf2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, Salt},
    Pbkdf2,
};

fn pad_to_length(input: &str, target_length: usize) -> String {
    let mut padded_string = String::from(input);

    while padded_string.len() < target_length {
        padded_string.push_str(input);
    }

    padded_string[..target_length].to_string()
}

// fn generate_salt(user_id: &str, user_name: &str) -> SaltString{

//     let salt_input = format!("{}{}", user_id, user_name);
//     let salt_o_p = SaltString::from_b64(&salt_input).expect("Failed to create Salt!");
//     //TODO: Generate actual hash from salt_input
//     println!("Salt: {}", salt_o_p);
//     salt_o_p
// }

pub fn etch_pass(password: &str, salt_str: &str) -> String {
    println!("Etching Password");
    println!("Password {}", password);

    let padd_salt_str = pad_to_length(salt_str, 20);
    let salt = Salt::from_b64(&padd_salt_str).unwrap();
    // Hash password to PHC string ($pbkdf2-sha256$...)
    //can panic
    //limit number of iterations
    let password_hash = Pbkdf2
        .hash_password(password.as_bytes(), salt)
        .unwrap()
        .to_string();
    // Verify password against PHC string
    //remove later

    let parsed_hash = PasswordHash::new(&password_hash).unwrap();
    assert!(Pbkdf2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok());
    password_hash
}
