-- Your SQL goes here

CREATE TABLE vault (
    vault_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL,
    icon_path TEXT NOT NULL,
    PRIMARY KEY (vault_id),
    FOREIGN KEY (user_id) REFERENCES pst (id)
);