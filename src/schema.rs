// @generated automatically by Diesel CLI.

diesel::table! {
    pst (id) {
        id -> Integer,
        name -> Text,
        password -> Text,
    }
}

diesel::table! {
    vault (vault_id) {
        vault_id -> Text,
        user_id -> Integer,
        name -> Text,
        key -> Text,
        icon_path -> Text,
    }
}

diesel::joinable!(vault -> pst (user_id));

diesel::allow_tables_to_appear_in_same_query!(pst, vault,);
