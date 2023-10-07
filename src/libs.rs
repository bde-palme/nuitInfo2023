use passwords::PasswordGenerator;
use chrono::{DateTime, Local};
use sha256::digest;
use dotenv::dotenv;
use std::env;
use mongodb::{Client, options::ClientOptions, Database};

pub async fn connect_to_db() -> Database {
    dotenv().ok();
    let db_path: String = env::var("DB_PATH").expect("Failed to load the DB_PATH env var.");
    let client_options = ClientOptions::parse(db_path).await.expect("Failed to get DB options.");

    let client: Client = Client::with_options(client_options).expect("Failed to create DB connection.");
    let db: Database = client.database("ndl2023");
    db
}

pub async fn db_name(db_handle: &Database) -> &str {
    return db_handle.name();
}


pub fn generate_password() -> String {
    let pg = PasswordGenerator {
        length: 12,
        numbers: true,
        lowercase_letters: true,
        uppercase_letters: true,
        symbols: false,
        spaces: false,
        exclude_similar_characters: false,
        strict: true,
    };

    pg.generate_one().unwrap()
}

pub fn generate_hash(password: &String) -> String {
    digest(password)
}

pub fn get_time() -> String {
    let local_time: DateTime<Local> = Local::now();

    local_time.format("%d/%m/%Y %H:%M:%S").to_string()

}