#[macro_use]
extern crate rocket;

use models::{CORS, PreflightResponse};
use mongodb::Database;
use rocket::{
    response::status::{Accepted, Forbidden},
    State,
};


use rocket::http::Status;

use std::{env, path::PathBuf};

pub mod libs;
pub mod models;

#[get("/")]
async fn index() -> &'static str {
    "API NDL2023"
}

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
// You must enforce the Content-Type header to be application/json in the request.
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

#[post(
    "/joinSolo",
    format = "application/json",
    data = "<user>"
)]
// You must enforce the Content-Type header to be application/json in the request.
async fn join_solo(
    user: models::User,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    let team_name = "solo".to_string();

    match libs::team_exists(db_handle, &team_name).await {
        Ok(true) => (),
        Ok(false) => {
            create_team(team_name.clone(), db_handle).await.unwrap();
            ()
        },
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the team exists.".to_string(),
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
        true => Ok(Accepted(Some("User added to the solo team.".to_string()))),
        false => Err(Forbidden(Some(
            "Failed to add the user to the solo team.".to_string(),
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

#[get("/dumpTeams/<token>")]
async fn dump_teams(
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
        let teams = libs::dump_teams(db_handle).await;

        Ok(Accepted(Some(teams)))
    }
}

#[get("/dumpTeam/<team_name>/<password>")]
async fn dump_team(
    team_name: String,
    password: String,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    // Try to get the admin_token from env
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


    let team: String = libs::dump_team(db_handle, &team_name).await;

    Ok(Accepted(Some(team)))
    

    


}

#[post("/removeUser/<team_name>/<password>",data = "<email>")]
async fn remove_user(email: String, team_name: String, password: String, db_handle: &State<Database>) -> Result<Accepted<String>, Forbidden<String>>{

    // Check if team exist
    match libs::team_exists(db_handle, &team_name).await {
        Ok(true) => (),
        Ok(false) => return Err(Forbidden(Some("Team does not exist.".to_string()))),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the team exists.".to_string(),
            )))
        }
    }

    // Check if password_hash match team_password_hash
    match libs::hash_valid(db_handle, &team_name, &password).await {
        Ok(true) => (),
        Ok(false) => return Err(Forbidden(Some("Wrong password.".to_string()))),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the hash is valid.".to_string(),
            )))
        }
    }

    // Check if user exist
    match libs::user_exists_by_email(db_handle, &email).await {
        true => (),
        false => return Err(Forbidden(Some("User does not exist.".to_string()))),

    }

    // Remove user from team
    match libs::remove_user_from_team(db_handle, &team_name, &email).await {
        true => (),
        false => return Err(Forbidden(Some("Failed to remove the user from the team.".to_string()))),

        }
    
    // Remove user from users

    match libs::remove_user(db_handle, &email).await {
        Ok(_) => (),
        Err(_) => return Err(Forbidden(Some("Failed to remove the user.".to_string()))),

        }

    Ok(Accepted(Some("User removed.".to_string())))

    }





#[get("/resetPassword/<team_name>/<token>")]
async fn reset_password(
    team_name: String,
    token: String,
    db_handle: &State<Database>,
) -> Result<Accepted<String>, Forbidden<String>> {
    // Try to get the admin_token from env
    let admin_token =
        env::var("ADMIN_TOKEN").expect("Failed to read the ADMIN_TOKEN from the .env file");

    // Check if team exist
    match libs::team_exists(db_handle, &team_name).await {
        Ok(true) => (),
        Ok(false) => return Err(Forbidden(Some("Team does not exist.".to_string()))),
        Err(_) => {
            return Err(Forbidden(Some(
                "Failed to check if the team exists.".to_string(),
            )))
        }
    }


    // Check if the token is valid
    if token != admin_token {
        Err(Forbidden(Some("Wrong token.".to_string())))
    } else {

        let password = libs::generate_password();
        let hash_password = libs::generate_hash(&password);

        // Modify the password
        match libs::modify_password(db_handle, &team_name, &hash_password).await {
            Ok(_) =>         Ok(Accepted(Some(password)))            ,
            Err(_) => return Err(Forbidden(Some("Failed to modify the password.".to_string()))),

        }



    }
}


#[options("/<_path..>")]
fn preflight_handler(_path: PathBuf) -> PreflightResponse {
    // Customize the CORS headers as needed
    let response = PreflightResponse::new(Status::Ok);
    response
}

#[launch]
async fn rocket() -> _ {
    // Create a globally, accessible by functions body db handle
    let db_handle: Database = libs::connect_to_db().await;

    rocket::build().attach(CORS).manage(db_handle).mount(
        "/",
        routes![
            create_team,
            join_team,
            nb_users,
            nb_teams,
            index,
            preflight_handler,
            dump_teams,
            dump_team,
            join_solo,
            reset_password,
            remove_user
        ],
    )
}
