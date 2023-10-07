
#[derive(Debug)]
pub struct User {
    pub name: String,
    pub first_name: String,
    pub pmr: bool,  // This field might need more context to translate accurately.
    pub course: bool,
    pub teacher: Option<Vec<String>>,
    pub timestamp: String,
    pub email: String,
    pub nickname: Option<String>,
    pub phone: String,
    pub study: String,
    pub comment: String,
}


pub struct Team {
    pub name: String,
    pub hash: String,
    pub membres: Vec<String>
}