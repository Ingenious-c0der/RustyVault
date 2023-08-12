use aes_gcm::aead::{Aead, AeadCore, OsRng};
use aes_gcm::{Aes256Gcm, KeyInit};

pub fn encrypt(data: &str, etched_key: &str) -> String {
    let etched_key_bytes = etched_key.as_bytes();
    if etched_key_bytes.len() != 32 {
        return Err("Invalid key length").unwrap();
    }

    let cipher: aes_gcm::AesGcm<
        aes_gcm::aes::Aes256,
        aes_gcm::aes::cipher::typenum::UInt<
            aes_gcm::aes::cipher::typenum::UInt<
                aes_gcm::aes::cipher::typenum::UInt<
                    aes_gcm::aes::cipher::typenum::UInt<
                        aes_gcm::aes::cipher::typenum::UTerm,
                        aes_gcm::aead::consts::B1,
                    >,
                    aes_gcm::aead::consts::B1,
                >,
                aes_gcm::aead::consts::B0,
            >,
            aes_gcm::aead::consts::B0,
        >,
    > = Aes256Gcm::new(etched_key_bytes.into());
    let nonce: aes_gcm::aead::generic_array::GenericArray<
        u8,
        aes_gcm::aes::cipher::typenum::UInt<
            aes_gcm::aes::cipher::typenum::UInt<
                aes_gcm::aes::cipher::typenum::UInt<
                    aes_gcm::aes::cipher::typenum::UInt<
                        aes_gcm::aes::cipher::typenum::UTerm,
                        aes_gcm::aead::consts::B1,
                    >,
                    aes_gcm::aead::consts::B1,
                >,
                aes_gcm::aead::consts::B0,
            >,
            aes_gcm::aead::consts::B0,
        >,
    > = Aes256Gcm::generate_nonce(&mut OsRng);
    let ciphertext: Vec<u8> = cipher.encrypt(&nonce, data.as_bytes()).unwrap();
    let plaintext: Vec<u8> = cipher.decrypt(&nonce, ciphertext.as_ref()).unwrap();
    let plaintext_string = String::from_utf8(plaintext).unwrap();

    assert_eq!(plaintext_string, data);
    println!("plaintext: {}", plaintext_string);
    use base64::encode;
    let nonce_string = encode(nonce.as_slice());
    let ciphertext_string = encode(ciphertext.as_slice());
    use serde_json::json;
    let combined_data = json!({
        "nonce": base64::encode(&nonce),
        "ciphertext": base64::encode(&ciphertext),
    });
    let combined_data_string = serde_json::to_string(&combined_data).unwrap();
    combined_data_string
    //add nonce to ciphertext
    // let mut nonce_and_ciphertext = nonce.to_vec();
    // nonce_and_ciphertext.extend_from_slice(&ciphertext);
    // let nonce_and_ciphertext_string = String::from_utf8(nonce_and_ciphertext).unwrap();
    // nonce_and_ciphertext_string
}

pub fn decrypt(combined_data_string: &str, etched_key: &str) -> String {
    let etched_key_bytes: &[u8] = etched_key.as_bytes();
    let cipher: aes_gcm::AesGcm<aes_gcm::aes::Aes256, aes_gcm::aes::cipher::typenum::UInt<aes_gcm::aes::cipher::typenum::UInt<aes_gcm::aes::cipher::typenum::UInt<aes_gcm::aes::cipher::typenum::UInt<aes_gcm::aes::cipher::typenum::UTerm, aes_gcm::aead::consts::B1>, aes_gcm::aead::consts::B1>, aes_gcm::aead::consts::B0>, aes_gcm::aead::consts::B0>> = Aes256Gcm::new(etched_key_bytes.into());

    // Deserialize combined data from JSON
    let combined_data: serde_json::Value = serde_json::from_str(combined_data_string).unwrap();
    
    let nonce: Vec<u8> = base64::decode(&combined_data["nonce"].as_str().unwrap()).unwrap();
    let ciphertext: Vec<u8> = base64::decode(&combined_data["ciphertext"].as_str().unwrap()).unwrap();

    // Decrypt ciphertext using nonce
    let act_nonce = aes_gcm::Nonce::from_slice(&nonce);
    let decrypted_data =
        cipher.decrypt(act_nonce, ciphertext.as_ref()).unwrap();

    // Convert decrypted data to string
    let decrypted_data_string = String::from_utf8(decrypted_data).unwrap();
    decrypted_data_string
}
