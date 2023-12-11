import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
const sha256 = require('sha256');


/* DB Schemas 

{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "hash": { "type": "string" },
        "membres": {
            "type": "array",
            "items": { "type": "string" }
        }
    },
    "required": [
        "name",
        "hash",
        "membres"
    ]
}


{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "first_name": { "type": "string" },
        "pmr": { "type": "boolean" },
        "course": { "type": "boolean" },
        "teacher": {
            "type": "array",
            "items": { "type": "string" }
        },
        "timestamp": { "type": "string", "format": "date-time" },
        "email": { "type": "string", "format": "email" },
        "nickname": { "type": "string" },
        "phone": { "type": "string" },
        "study": { "type": "string" },
        "comment": { "type": "string" }
    },
    "required": [
        "name",
        "first_name",
        "pmr",
        "course",
        "timestamp",
        "email",
        "phone",
        "study",
        "comment"
    ]
}
*/

// definite structures

export interface Team {
    name: string;
    hash: string;
    members: string[];
}

export interface User {
    name: string;
    first_name: string;
    pmr: boolean;
    course: boolean;
    teacher: string;
    timestamp: string;
    email: string;
    nickname: string;
    phone: string;
    study: string;
    comment: string;
}


// Read a .env file
dotenv.config({ path: "../.env" });
const db_user = process.env.MONGO_INITDB_ROOT_USERNAME;
const db_password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const db_uri = "mongodb://" + db_user + ":" + db_password + "@localhost:27017";

// Create a database client

const client = new MongoClient(db_uri);

// Connect to the database
client.connect();

// Get the database instance
const db = client.db("palmhackathon2024");


export async function get_number_of_users(): Promise<number> {
    const collection = db.collection("User");
    const count = await collection.countDocuments();
    return count;
}

export async function get_number_of_teams(): Promise<number> {
    const collection = db.collection("Team");
    const count = await collection.countDocuments();
    return count;
}

export async function get_number_of_members(teamName: string): Promise<number> {
    const collection = db.collection("Team");
    const team = await collection.findOne({ name: teamName });

    if (team === null) {
        return 0;
    }

    return team.members.length;
}

export async function compare_team_password(password: string, teamName: string): Promise<boolean> {
    const collection = db.collection("Team");
    const team = await collection.findOne({ name: teamName });

    if (team === null) {
        return false;
    }

    return team.hash === sha256(password);
}


// create get_user(username: String) -> User
export async function get_user(username: string): Promise<string | null> {
    const collection = db.collection("User");
    const user = await collection.findOne({ nickname: username });

    if (user == null) {
        return null;
    }
    else {
        return JSON.stringify(user, null, 2);
    }
}

export async function get_team(teamName: string): Promise<string | null> {
    const collection = db.collection("Team");
    const team = await collection.findOne({ name: teamName });

    if (team == null) {
        return null;
    }
    else {
        return JSON.stringify(team, null, 2);
    }
}

export async function remove_from_team(nickname: string, teamName: string): Promise<boolean> {
    const collection = db.collection("Team");
    const result = await collection.updateOne(
      { name: teamName },
      { $pull: { members: { nickname: nickname } } }
    );
    return result.modifiedCount > 0;
  }

export async function delete_user(username: string): Promise<boolean> {
    const collection = db.collection("User");
    const result = await collection.deleteOne({ nickname: username });
    
    if (result.deletedCount > 0) {
        console.log("User deleted: " + username);
        return true;
    }
    else {
        console.log("Failed to delete user: : " + username);
        return false;
  }
}
  
  export async function delete_team(teamName: string): Promise<boolean> {
    const collection = db.collection("Team");
    const result = await collection.deleteOne({ name: teamName });
    if(result.deletedCount > 0){
      console.log("Team deleted: " + teamName);
      return true;
    }
    else{
      console.log("Failed to delete team: " + teamName);
      return false;
    }
  }

export async function get_all_users(): Promise<string> {
    const collection = db.collection("User");
    const users = await collection.find().toArray();

    return JSON.stringify(users, null, 2);
}

export async function get_all_teams(): Promise<string> {
    const collection = db.collection("Team");

    const teams = await collection.find().toArray();

    return JSON.stringify(teams, null, 2);
}

// create create_user(user: User) -> void

export async function add_user(user: User): Promise<boolean> {
    try {
        const collection = db.collection("User");
        await collection.insertOne(user);
        console.log('User created:', JSON.stringify(user, null, 2));
        return true;
    } catch (error) {
        console.error('Error creating user:', error);
        return false;
    }
}


export async function add_team(team: Team): Promise<boolean> {
    try {
        team.hash = sha256(team.hash);
        const collection = db.collection("Team");
        await collection.insertOne(team);
        console.log('Team created:', JSON.stringify(team, null, 2));
        return true;
    } catch (error) {
        console.error('Error creating team:', error);
        return false;
    }
}

export async function add_user_to_team(teamName: string, user: User): Promise<boolean> {
    const collection = db.collection("Team");

    const filter = { name: teamName };
    const update = { $push: { members: user } };

    // Avoid to create a new team, if team don't exist
    const updateOptions = { upsert: false };

    const result = await collection.updateOne(filter, update, updateOptions);

    if(result.modifiedCount > 0){
      console.log(JSON.stringify(user, null, 2) + " added to team: " + teamName);
      return true;
    }
    else{
      console.log("Failed to add " + JSON.stringify(user, null, 2) + " to team: " + teamName);
      return false;
    }
}

export async function team_exist(teamName: string): Promise<boolean> {
    const collection = db.collection("Team");

    const team = await collection.findOne({ name: teamName });

    return team !== null;
}

export async function user_exist(email: string, phone: string, nickname: string): Promise<boolean> {
    const collection = db.collection("User");

    const user = await collection.findOne({
        $or: [
            { email: email },
            { phone: phone },
            { nickname: nickname }
        ]
    });

    return user !== null;
}

