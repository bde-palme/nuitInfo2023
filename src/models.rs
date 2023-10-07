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

#[derive(Debug, Serialize, Deserialize)]
pub struct Team {
    pub name: String,
    pub hash: String,
    pub members: Vec<User>,
}
