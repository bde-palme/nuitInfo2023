use rusqlite::{Connection, OpenFlags};



pub fn create_table_team() {
    let connection = Connection::open("db.db").unwrap();
    let query = "
        CREATE TABLE IF NOT EXISTS Teams(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        hash TEXT NOT NULL
        );";

    connection.execute(query, []).unwrap();
}

pub fn create_table_user(){
    let connection = Connection::open("db.db").unwrap();

    let query = "CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY ,
        name TEXT NOT NULL,
        first_name TEXT NOT NULL,
        team_name TEXT,
        pmr BOOLEAN NOT NULL,
        course BOOLEAN NOT NULL,
        teacher TEXT,  -- A serialized JSON array, or alternatively, create a separate table for teachers.
        timestamp TEXT NOT NULL,  -- Could also use DATETIME type, if the string is formatted accordingly
        email TEXT NOT NULL,
        nickname TEXT,
        phone TEXT NOT NULL,
        study TEXT NOT NULL,
        comment TEXT NOT NULL,
        FOREIGN KEY (team_name) REFERENCES Teams(name) ON DELETE SET NULL
    );";

    connection.execute(query,[]).unwrap();


}

