#[macro_use]
extern crate rocket;

use mongodb::Database;
use rocket::{
    response::status::{Accepted, Forbidden},
    State,
};

use dotenv::dotenv;
use std::env;

pub mod libs;
pub mod models;

#[get("/createTeam/<team_name>")]
async fn create_team(
    team_name: String,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    match libs::team_exists(db_handle, &team_name).await {
        Ok(true) => return Err(Forbidden(Some("Team already exists.".to_string()))),
        Ok(false) => (),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the team exists.".to_string(),
            )))
        }
    }

    let password = libs::generate_password();

    let team: models::Team = models::Team {
        name: team_name.clone(),
        hash: libs::generate_hash(&password),
        members: Vec::new(),
    };

    match libs::create_team(db_handle, &team).await {
        Ok(_) => Ok(Accepted(Some(password.to_string()))),
        Err(_) => Err(Forbidden(Some("Failed to create the team.".to_string()))),
    }
}

#[post(
    "/joinTeam/<team_name>/<password>",
    format = "application/json",
    data = "<user>"
)]
async fn join_team(
    team_name: String,
    password: String,
    user: models::User,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    match libs::team_exists(db_handle, &team_name).await {
        Ok(true) => (),
        Ok(false) => return Err(Forbidden(Some("Team does not exist.".to_string()))),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the team exists.".to_string(),
            )))
        }
    }

    // Verify the hash
    match libs::hash_valid(db_handle, &team_name, &password).await {
        Ok(true) => (),
        Ok(false) => return Err(Forbidden(Some("Wrong password.".to_string()))),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the hash is valid.".to_string(),
            )))
        }
    }

    // Check if email or phone aren't already used
    match libs::user_exists(db_handle, &user).await {
        Ok(true) => return Err(Forbidden(Some("Email or phone already used.".to_string()))),
        Ok(false) => (),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the user exists.".to_string(),
            )))
        }
    }

    match libs::add_user(db_handle, &user).await {
        Ok(_) => (),
        Err(_) => return Err(Forbidden(Some("Failed to add the user.".to_string()))),
    }

    match libs::add_user_to_team(db_handle, &team_name, user).await {
        true => Ok(Accepted(Some("User added to the team.".to_string()))),
        false => Err(Forbidden(Some(
            "Failed to add the user to the team.".to_string(),
        ))),
    }
}

#[get("/nbUsers/<token>")]
async fn nb_users(
    token: String,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    // Try to get the admin_token from env
    let admin_token =
        env::var("ADMIN_TOKEN").expect("Failed to read the ADMIN_TOKEN from the .env file");

    // Check if the token is valid
    if token != admin_token {
        Err(Forbidden(Some("Wrong token.".to_string())))
    } else {
        // Get the number of users
        let nb_users = libs::number_of_users(db_handle).await;

        // Return the number of users
        Ok(Accepted(Some(nb_users.unwrap().to_string())))
    }
}

#[get("/nbTeams/<token>")]
async fn nb_teams(
    token: String,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    // Try to get the admin_token from env
    let admin_token =
        env::var("ADMIN_TOKEN").expect("Failed to read the ADMIN_TOKEN from the .env file");

    // Check if the token is valid
    if token != admin_token {
        Err(Forbidden(Some("Wrong token.".to_string())))
    } else {
        // Get the number of users
        let nb_teams = libs::number_of_teams(db_handle).await;

        // Return the number of users
        Ok(Accepted(Some(nb_teams.unwrap().to_string())))
    }
}

#[launch]
async fn rocket() -> _ {
    // Create a globally, accessible by functions body db handle
    let db_handle: Database = libs::connect_to_db().await;

    // Load the .env file
    dotenv().expect("Failed to load .env file.");

    println!("{}", libs::dump_teams(&db_handle).await);

    rocket::build()
        .manage(db_handle)
        .mount("/", routes![create_team, join_team, nb_users, nb_teams])
}
