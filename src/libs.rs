use chrono::{DateTime, Local};
use dotenv::dotenv;
use mongodb::{
    bson::doc, bson::to_bson, options::ClientOptions, options::UpdateOptions, Client, Collection,
    Database,
};
use passwords::PasswordGenerator;
use sha256::digest;
use std::env;

use crate::models::{Team, User};

pub async fn connect_to_db() -> Database {
    dotenv().ok();
    let db_path: String = env::var("DB_PATH").expect("Failed to load the DB_PATH env var.");
    println!("{}", db_path);

    let client_options = ClientOptions::parse(db_path)
        .await
        .expect("Failed to get DB options.");

    let client: Client =
        Client::with_options(client_options).expect("Failed to create DB connection.");
    let db: Database = client.database("ndl2023");
    db
}

pub async fn add_user(db_handle: &Database, user: User) -> Result<(), &str> {
    let collection_handle: Collection<User> = db_handle.collection::<User>("User");

    match collection_handle.insert_one(&user, None).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to insert the user in the collection."),
    }
}

pub async fn create_team(db_handle: &Database, team: Team) -> Result<(), &str> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");

    match collection_handle.insert_one(&team, None).await {
        Ok(_) => Ok(()),
        Err(_) => Err("Failed to insert the user in the collection."),
    }
}

pub async fn team_exists(db_handle: &Database, team_name: &String) -> Result<bool, String> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");
    let filter: mongodb::bson::Document = doc! {"name":team_name};
    match collection_handle.find_one(filter, None).await {
        Ok(result) => Ok(result.is_some()),
        Err(x) => Err(x.to_string()),
    }
}

async fn get_team(db_handle: &Database, team_name: &String) -> Option<Team> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");
    let filter: mongodb::bson::Document = doc! {"name":team_name};

    match collection_handle.find_one(filter, None).await {
        Ok(team) => match team {
            Some(x) => Some(x),
            None => None,
        },
        Err(_) => None,
    }
}

pub async fn hash_valid(db_handle: &Database, team_name: &String, hash: &String) -> bool {
    let team: Team;

    match get_team(db_handle, team_name).await {
        Some(x) => team = x,
        None => return false,
    }

    return team.hash == hash.clone();
}

pub async fn add_user_to_team(db_handle: &Database, team_name: &String, user: User) -> bool {
    let collection: Collection<Team> = db_handle.collection::<Team>("Team");

    let filter: mongodb::bson::Document = doc! {"name" : team_name};
    let update = doc! { "$push": { "members": to_bson(&user).unwrap() } };

    // Avoid to create a new team, if team don't exist
    let update_options = UpdateOptions::builder().upsert(false).build();

    let result = collection.update_one(filter, update, update_options).await;

    if result.unwrap().matched_count > 0 {
        true
    } else {
        false
    }
}
// TODO : add_user_to_team(&Database, team_name, User) -> Result(bool, String)

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
