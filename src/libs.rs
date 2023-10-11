use chrono::{DateTime, Local};

use dotenv::dotenv;
use std::env;

use mongodb::{
    bson::doc, bson::to_bson, options::ClientOptions, options::UpdateOptions, Client, Collection,
    Database,
};

use crate::rocket::futures::TryStreamExt;
use passwords::PasswordGenerator;
use sha256::digest;

use crate::models::{Team, User};

use rocket::serde::json::serde_json;

pub async fn connect_to_db() -> Database {
    dotenv().ok();
    let db_username: String = env::var("MONGO_INITDB_ROOT_USERNAME")
        .expect("Failed to load the MONGO_INITDB_ROOT_USERNAME env var.");
    let db_password: String = env::var("MONGO_INITDB_ROOT_PASSWORD")
        .expect("Failed to load the MONGO_INITDB_ROOT_PASSWORD env var.");
    let db_host: String = format!("mongodb://{}:{}@127.0.0.1:27017", db_username, db_password);

    let client_options = ClientOptions::parse(db_host)
        .await
        .expect("Failed to get DB options.");

    let client: Client =
        Client::with_options(client_options).expect("Failed to create DB connection.");
    let db: Database = client.database("ndl2023");
    db
}

pub async fn add_user(db_handle: &Database, user: &User) -> Result<(), String> {
    let collection_handle: Collection<User> = db_handle.collection::<User>("User");

    match collection_handle.insert_one(user, None).await {
        Ok(_) => Ok(()),
        Err(x) => Err(x.to_string()),
    }
}

pub async fn create_team(db_handle: &Database, team: &Team) -> Result<(), String> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");

    match collection_handle.insert_one(team, None).await {
        Ok(_) => Ok(()),
        Err(x) => Err(x.to_string()),
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
        Ok(team) => team,
        Err(_) => None,
    }
}

pub async fn hash_valid(
    db_handle: &Database,
    team_name: &String,
    hash: &String,
) -> Result<bool, String> {
    let team = get_team(db_handle, team_name).await;

    match team {
        Some(x) => Ok(x.hash == generate_hash(hash)),
        None => Err("Failed to get team.".to_string()),
    }
}

pub async fn add_user_to_team(db_handle: &Database, team_name: &String, user: User) -> bool {
    let collection: Collection<Team> = db_handle.collection::<Team>("Team");

    let filter: mongodb::bson::Document = doc! {"name" : team_name};
    let update = doc! { "$push": { "members": to_bson(&user).unwrap() } };

    // Avoid to create a new team, if team don't exist
    let update_options = UpdateOptions::builder().upsert(false).build();

    let result = collection.update_one(filter, update, update_options).await;

    result.unwrap().matched_count > 0
}

pub async fn number_of_teams(db_handle: &Database) -> Result<u64, String> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");

    match collection_handle.count_documents(None, None).await {
        Ok(result) => Ok(result),
        Err(x) => Err(x.to_string()),
    }
}

pub async fn number_of_users(db_handle: &Database) -> Result<u64, String> {
    let collection_handle: Collection<User> = db_handle.collection::<User>("User");

    match collection_handle.count_documents(None, None).await {
        Ok(result) => Ok(result),
        Err(x) => Err(x.to_string()),
    }
}

pub async fn user_in_team(
    db_handle: &Database,
    team_name: &String,
    user: &User,
) -> Result<bool, String> {
    let collection_handle: Collection<Team> = db_handle.collection::<Team>("Team");
    let filter: mongodb::bson::Document = doc! {"name":team_name, "members": {"$elemMatch": {"phone":&user.phone, "email":&user.email}}};

    match collection_handle.find_one(filter, None).await {
        Ok(result) => Ok(result.is_some()),
        Err(x) => Err(x.to_string()),
    }
}
pub async fn user_exists(db_handle: &Database, user: &User) -> Result<bool, String> {
    let collection_handle: Collection<User> = db_handle.collection::<User>("User");
    let filter: mongodb::bson::Document =
        doc! {"$or": [{"phone":&user.phone}, {"email":&user.email}]};

    match collection_handle.find_one(filter, None).await {
        Ok(result) => Ok(result.is_some()),
        Err(x) => Err(x.to_string()),
    }
}

pub async fn dump_teams(db_handle: &Database) -> String {
    let collection: Collection<Team> = db_handle.collection::<Team>("Team");

    let cursor: mongodb::Cursor<Team> = collection.find(None, None).await.unwrap();
    let documents: Vec<Team> = cursor.try_collect().await.unwrap();

    // Convert Vec<Document> to JSON string
    serde_json::to_string(&documents).expect("Failed to dump the DB")
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
