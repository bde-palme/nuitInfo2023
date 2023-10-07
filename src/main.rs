#[macro_use]
extern crate rocket;


use rocket::response::status::{Accepted, Forbidden};


pub mod models;
pub mod libs;


#[tokio::main]
async fn main(){

    let nat: models::User = models::User {
        name: String::from("CORNELOUP"),
        first_name: String::from("Nathan"),
        pmr: false, 
        course: false,
        teacher: None,
        timestamp: libs::get_time(),
        email: String::from("nathan.corneloup@etudiants.univ-rennes1.fr"),
        nickname: Some(String::from("Nat")),
        phone: String::from("0686483057"),
        study: String::from("L2 ISTN"),
        comment: String::from("Un ami"),
};

    println!("{:?}",nat);
    let db = libs::connect_to_db().await;
    println!("Database name: {}",libs::db_name(&db).await);
}



/* 
#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![])


}
*/

