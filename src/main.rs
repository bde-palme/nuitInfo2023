#[macro_use]
extern crate rocket;
use passwords::PasswordGenerator;

use rocket::response::status::{Accepted, Forbidden};

use sha256::digest;

struct User {
    nom: String,
    prenom: String,
    pmr: bool,
    cours: bool,
    prof: Option<Vec<String>>,
    horodateur: String,
    mail: String,
    pseudo: Option<String>,
    telephone: String,
    etude: String,
    comment: String,
}

fn generate_password() -> String {
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

fn generate_hash(password: &String) -> String {
    digest(password)
}

fn team_exist(name: String) -> bool {
    // TODO finalize team_exist 
    true
}

fn hash_match(hash: String, team_name: String) -> bool {
    // TODO finalize hash_match
    true
}

#[get("/createTeam/<name>")]
fn create_team(name: &str) -> Result<Accepted<String>, Forbidden<String>> {

    // Check if team name already exist
    if name == String::from("Palm'Breaker"){
        // TODO : Vérifier si la team existe dans la BDD
        return Err(Forbidden(Some(format!("L'équipe {} éxiste déjà.", name))))
    }
    // Generate a password
    let password: String = generate_password();

    // Generate hash of the password
    let hash: String = generate_hash(&password);


    // TODO : Add teams in the database
    

    Ok(Accepted(Some(password)))
}

#[post("/verify/<name>", data="<password>")]
fn verify(name: &str, password: &str) -> Result<Accepted<()>, Forbidden<()>> {

    // TODO : Vérifier que le nom de la team est correcte

    // TODO : Vérifier que le hash du mdp correspond au hash de l'equipe
    let hash: String = generate_hash(&password.to_string());

    if(true){
        Ok(Accepted::<()>(None))
    }
    else {
        Err(Forbidden::<()>(None))
    }
}





#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![create_team,verify])
}


