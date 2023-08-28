table! {
    pst (id) {
        id -> Integer,
        name -> Text,
        password -> Text,
    }
}
table! {
    vault(user_id)
    {
        vault_id -> Text,
        user_id -> Integer,
        name -> Text,
        key -> Text,
        icon_path -> Text,
    }
}
