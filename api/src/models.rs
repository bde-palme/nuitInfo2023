use rocket::data::{FromData, Outcome};
use rocket::serde::json::Json;
use rocket::Data;
use serde::{Deserialize, Serialize};


use rocket::fairing::{Fairing, Info, Kind};
use rocket::{Request, Response};
use rocket::http::{Header, Status};
use rocket::response::Responder;

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

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "POST, GET, PATCH, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}

pub struct PreflightResponse(Status);

impl PreflightResponse {
    pub fn new(status: Status) -> Self {
        PreflightResponse(status)
    }
}

impl<'r> Responder<'r, 'r> for PreflightResponse {
    fn respond_to(self, _: &Request) -> rocket::response::Result<'r> {
        Ok(rocket::response::Response::build()
            // .sized_body(0, ByteUnit::default())
            .header(Header::new("Access-Control-Allow-Origin", "*"))
            .header(Header::new(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE",
            ))
            .header(Header::new(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization",
            ))
            .status(self.0)
            .finalize())
    }
}