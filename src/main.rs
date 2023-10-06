#[macro_use]
extern crate rocket;
use chrono::{DateTime, Local};

use passwords::PasswordGenerator;

use rocket::response::status::{Accepted, Forbidden};

use sha256::digest;

pub mod sql;
pub mod models;

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

fn get_time() -> String {
    let local_time: DateTime<Local> = Local::now();

    local_time.format("%d/%m/%Y %H:%M:%S").to_string()

}

fn main(){

    let nat: models::User = models::User {
        name: String::from("CORNELOUP"),
        first_name: String::from("Nathan"),
        team_name: String::from("Palm'Breaker"),
        pmr: false, 
        course: false,
        teacher: None,
        timestamp: get_time(),
        email: String::from("nathan.corneloup@etudiants.univ-rennes1.fr"),
        nickname: Some(String::from("Nat")),
        phone: String::from("0686483057"),
        study: String::from("L2 ISTN"),
        comment: String::from("Un ami"),
};

    println!("{:?}",nat);

    sql::create_table_team();
    sql::create_table_user();
}



/* 
#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![])


}
*/

