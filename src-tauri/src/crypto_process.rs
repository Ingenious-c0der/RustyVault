use aes_gcm::aead::{Aead, AeadCore, OsRng};
use aes_gcm::{Aes256Gcm, KeyInit};

fn truncate_key(key: &[u8]) -> [u8; 32] {
    // Hash the key using SHA-256
    //use sha2::{Digest, Sha256};
    //TODO: solve the new() fn clash
    // let mut hasher = sha2::Sha256::new();
    // hasher.update(key);
    // let hash_result = hasher.finalize();

    // Truncate the hash to 32 bytes
    let mut truncated_key = [0u8; 32];
    truncated_key.copy_from_slice(&key[..32]);

    truncated_key
}

pub fn encrypt(data: &str, etched_key: &str) -> String {
    let etched_key_bytes = etched_key.as_bytes();
    let etched_key_bytes = truncate_key(etched_key_bytes);
    if etched_key_bytes.len() != 32 {
        return Err("Invalid key length").unwrap();
    };
    use aes_gcm::aead::generic_array::GenericArray;

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
    > = Aes256Gcm::new(GenericArray::from_slice(&etched_key_bytes));
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
    use base64::encode;
    let nonce_string = encode(nonce.as_slice());
    let ciphertext_string = encode(ciphertext.as_slice());
    use serde_json::json;
    let combined_data = json!({
        "nonce": nonce_string,
        "ciphertext": ciphertext_string,
    });
    let combined_data_string = serde_json::to_string(&combined_data).unwrap();
    combined_data_string
}

pub fn decrypt(combined_data_json: &serde_json::Value, etched_key: &str) -> String {
    let etched_key_bytes = etched_key.as_bytes();
    let etched_key_bytes = truncate_key(etched_key_bytes);
    if etched_key_bytes.len() != 32 {
        return Err("Invalid key length").unwrap();
    };
    use aes_gcm::aead::generic_array::GenericArray;
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
    > = Aes256Gcm::new(GenericArray::from_slice(&etched_key_bytes));

    // Deserialize combined data from JSON
    //hate that I have to do these modifications,assert eq ftw
    let mut combined_data_string = combined_data_json.to_string();
    combined_data_string = combined_data_string.replace("\\", "");
    combined_data_string = combined_data_string.replace("\"{", "{");
    combined_data_string = combined_data_string.replace("}\"", "}");
    // println!("combined_data_string_req: {}", combined_data_string_req);
    // assert_eq!(combined_data_string.len(), combined_data_string_req.len());
    // assert_eq!(combined_data_string, combined_data_string_req);
    let combined_data: serde_json::Value = serde_json::from_str(&combined_data_string).unwrap();
    let nonce: Vec<u8> = base64::decode(combined_data["nonce"].as_str().unwrap()).unwrap();
    let ciphertext: Vec<u8> =
        base64::decode(combined_data["ciphertext"].as_str().unwrap()).unwrap();
    // Decrypt ciphertext using nonce
    let act_nonce = aes_gcm::Nonce::from_slice(&nonce);
    let decrypted_data = cipher.decrypt(act_nonce, ciphertext.as_ref()).unwrap();
    // Convert decrypted data to string
    let mut decrypted_data_string = String::from_utf8(decrypted_data).unwrap();
    decrypted_data_string = decrypted_data_string.replace("\"", "");
    //println!("decrypted_data_string: {}", decrypted_data_string);
    // assert_eq!(decrypted_data_string, "testpassword123");
    decrypted_data_string
}
