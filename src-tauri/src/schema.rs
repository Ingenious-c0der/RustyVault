table! {
    pst (id) {
        id -> Integer,
        name -> Text,
        password -> Text,
    }
}
table! {
    key_table(id)
    {
        id -> Integer,
        name -> Text,
        key -> Text,
        user_id -> Integer,
    }
}