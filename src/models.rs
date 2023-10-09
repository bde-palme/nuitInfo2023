use rocket::data::{FromData, Outcome};
use rocket::serde::json::Json;
use rocket::Data;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub name: String,
    pub first_name: String,
    pub pmr: bool, // This field might need more context to translate accurately.
    pub course: bool,
    pub teacher: Option<Vec<String>>,
    pub timestamp: String,
    pub email: String,
    pub nickname: Option<String>,
    pub phone: String,
    pub study: String,
    pub comment: String,
}

#[rocket::async_trait]
impl<'r> FromData<'r> for User {
    type Error = rocket::serde::json::Error<'r>;

    async fn from_data(
        req: &'r rocket::Request<'_>,
        data: Data<'r>,
    ) -> rocket::data::Outcome<'r, Self> {
        let outcome = Json::<User>::from_data(req, data).await;
        match outcome {
            Outcome::Success(json) => Outcome::Success(json.into_inner()),
            Outcome::Failure((status, _)) => Outcome::Failure((
                status,
                rocket::serde::json::Error::Io(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "Deserialization error",
                )),
            )),
            Outcome::Forward(f) => Outcome::Forward(f),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Team {
    pub name: String,
    pub hash: String,
    pub members: Vec<User>,
}
