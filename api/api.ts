import * as lib from "./lib";

require("dotenv").config();
const api_token = process.env.ADMIN_TOKEN;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const https = require("https");
import * as fs from "fs";

const app = express();
const port = 80;

lib.team_exist("solo").then((teamExists) => {
    if (!teamExists) {
        lib.add_team({
            name: "solo",
            hash: "",
            members: [],
        });
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (!process.env.NODE_ENV || process.env.NODE_ENV == "dev") app.use(cors());

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.originalUrl
        } STATUS: ${res.statusCode} - ${req.ip} - ${req.get("User-Agent")}}`
    );
    next();
});



try {
    const privkey = fs.readFileSync("./certs/privkey.pem");
    const ca = fs.readFileSync("./certs/fullchain.pem");

    const credentials = {
        key: privkey,
        cert: ca,
    };

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(80, () => {
        console.log("HTTP Server running on port 80");
    });
}
catch {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}


// httpsServer.listen(443, () => {
//     console.log("HTTPS Server running on port 443");
// });

app.use(express.static("../front/build", { extensions: ["html"] }));

app.get("/api/users/", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const users = await lib.get_all_users();
    res.send(users);
});

app.get("/api/users/:email/remove/", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const email = req.params.email;
    const user = await lib.get_user(email);

    if (user === null) {
        res.status(404).send("Team not found");
        return;
    }

    let success = await lib.delete_user(email);
    res.send(success ? "Team removed" : "Une erreur s'est produite");
});

app.get("/api/teams", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const teams = await lib.get_all_teams();
    res.send(teams);
});

app.post("/api/teams/create", async (req, res) => {
    const teamName = req.body.teamName;
    const teamHash = req.body.teamHash;

    if (!teamName || !teamHash) {
        res.status(400).send("Team name and hash are required");
        return;
    }

    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
        res.status(400).send("Team already exists");
        return;
    }

    const team = {
        name: teamName,
        hash: teamHash,
        members: [], // Fix: Corrected property name from 'membres' to 'members'
    };

    await lib.add_team(team);
    res.status(201).send("Team created");
});

app.post("/api/users/create", async (req, res) => {
    if (req.body.course == "true") {
        req.body.course = true;
    } else {
        req.body.course = false;
    }

    if (req.body.pmr == "true") {
        req.body.pmr = true;
    } else {
        req.body.pmr = false;
    }

    const user: lib.User = {
        name: req.body.name,
        first_name: req.body.first_name,
        pmr: req.body.pmr,
        course: req.body.course,
        teacher: req.body.teacher,
        timestamp: new Date().toISOString(), // Fix: Convert the timestamp to a string using toISOString()
        email: req.body.email,
        genre: req.body.genre,
        nickname: req.body.nickname,
        phone: req.body.phone,
        study: req.body.study,
        comment: req.body.comment,
    };

    const teamName = req.body.teamName;
    const teamPass = req.body.teamPassword;
    console.log(req.body);

    // Check if all parameters are provided and are of the correct type
    if (
        typeof user.name !== "string" ||
        typeof user.first_name !== "string" ||
        typeof user.pmr !== "boolean" ||
        typeof user.course !== "boolean" ||
        typeof user.teacher !== "string" ||
        typeof user.email !== "string" ||
        typeof user.nickname !== "string" ||
        typeof user.phone !== "string" ||
        typeof user.study !== "string" ||
        typeof user.comment !== "string" ||
        (typeof user.genre !== "string" &&
            user.genre != "homme" &&
            user.genre != "femme" &&
            user.genre != "autre") ||
        typeof teamName !== "string" ||
        typeof teamPass !== "string"
    ) {
        res.status(400).send("Invalid parameters");
        return;
    }

    const userExists = await lib.user_exist(user.email, user.phone);
    if (userExists) {
        res.status(400).send("User already exists");
        return;
    }

    if (
        (await lib.get_number_of_users()) >=
        parseInt(process.env.MAX_PARTICIPANTS!)
    ) {
        res.status(400).send(
            "Nombre maximum de participants et participantes atteint"
        );
        return;
    }

    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
        const isValidHash = await lib.compare_team_password(teamPass, teamName);
        if (isValidHash) {
            await lib.add_user(user);
            await lib.add_user_to_team(teamName, user);
        } else {
            res.status(400).send("Invalid team hash or team name");
            return;
        }
    }

    res.status(201).send("User created and added to team");
});

app.post("/api/users/create-admin", async (req, res) => {
    if (req.body.course == "true") {
        req.body.course = true;
    } else {
        req.body.course = false;
    }

    if (req.body.pmr == "true") {
        req.body.pmr = true;
    } else {
        req.body.pmr = false;
    }

    const user: lib.User = {
        name: req.body.name,
        first_name: req.body.first_name,
        pmr: req.body.pmr,
        course: req.body.course,
        teacher: req.body.teacher,
        timestamp: new Date().toISOString(), // Fix: Convert the timestamp to a string using toISOString()
        email: req.body.email,
        genre: req.body.genre,
        nickname: req.body.nickname,
        phone: req.body.phone,
        study: req.body.study,
        comment: req.body.comment,
    };

    const teamName = req.body.teamName;

    // Check if all parameters are provided and are of the correct type
    if (
        typeof user.name !== "string" ||
        typeof user.first_name !== "string" ||
        typeof user.pmr !== "boolean" ||
        typeof user.course !== "boolean" ||
        typeof user.teacher !== "string" ||
        typeof user.email !== "string" ||
        typeof user.nickname !== "string" ||
        typeof user.phone !== "string" ||
        typeof user.study !== "string" ||
        typeof user.comment !== "string" ||
        (typeof user.genre !== "string" &&
            user.genre != "homme" &&
            user.genre != "femme" &&
            user.genre != "autre") ||
        typeof teamName !== "string" ||
        typeof req.body.token !== "string"
    ) {
        res.status(400).send("Invalid parameters");
        return;
    }

    const userExists = await lib.user_exist(user.email, user.phone);
    if (userExists) {
        res.status(400).send("User already exists");
        return;
    }

    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
        const isValidHash = req.body.token === api_token;
        if (isValidHash) {
            await lib.add_user(user);
            await lib.add_user_to_team(teamName, user);
        } else {
            res.status(400).send("Invalid team hash or team name");
            return;
        }
    }

    res.status(201).send("User created and added to team");
});

app.get("/api/users/count", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const count = await lib.get_number_of_users();
    res.send({ count });
});

app.get("/api/teams/count", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const count = await lib.get_number_of_teams();
    res.send({ count });
});

app.get("/api/teams/:teamName/count", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const teamName = req.params.teamName;
    // Check if team exists
    const teamExists = await lib.team_exist(teamName);
    if (!teamExists) {
        res.status(404).send("Team not found");
        return;
    }

    const count = await lib.get_number_of_members(teamName);
    res.send({ count });
});

app.get("/api/teams/:teamName/remove", async (req, res) => {
    console.log("Requete de suppression d'équipe");
    const token = req.query.token;

    if (token !== api_token) {
        console.log("Mauvais token d'api");
        res.status(403).send("Invalid token");
        return;
    }

    const teamName = req.params.teamName;
    const team = await lib.get_team(teamName);

    if (team === null) {
        res.status(404).send("Team not found");
        return;
    }

    let result = await lib.delete_team(teamName);
    res.status(result ? 200 : 403);
    res.send(result ? "Team removed" : "Une erreur s'est produite");
});

app.get("/api/users/:username", async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
        res.status(403).send("Invalid token");
        return;
    }

    const username = req.params.username;
    const user = await lib.get_user(username);

    if (user === null) {
        res.status(404).send("User not found");
        return;
    }

    res.send(user);
});

app.get("/api/teams/:teamName/:teamPassword", async (req, res) => {
    if (
        typeof req.params.teamName !== "string" ||
        typeof req.params.teamPassword !== "string"
    ) {
        res.status(400).send("Invalid parameters");
        return;
    }

    const teamName = req.params.teamName;
    const teamPass = req.params.teamPassword;

    if (teamName === "solo") {
        res.status(403).send(
            "Tu ne peux pas voir les informations de l'équipe solo, petit malin ! Je te ferais remarqué que tu c'est très facile de nous embêter, il n'y a pas de vérification d'email ! Alors, stp, passe ton chemin et laisse nous tranquille !"
        );
        return;
    }

    if (!lib.compare_team_password(teamPass, teamName)) {
        res.status(400).send("Invalid team hash or team name");
        return;
    }

    const team = await lib.get_team(teamName);

    if (team === null) {
        res.status(404).send("Team not found");
        return;
    }

    let teamParsed: lib.Team = JSON.parse(team);

    let result = {
        name: teamParsed.name,
        members: teamParsed.members,
    };

    res.send(result);
});

app.delete(
    "/api/teams/:teamName/:teamPassword/remove/:email",
    async (req, res) => {
        if (
            typeof req.params.teamName !== "string" ||
            typeof req.params.teamPassword !== "string" ||
            typeof req.params.email !== "string"
        ) {
            res.status(400).send("Invalid parameters");
            return;
        }

        const teamName = req.params.teamName;
        const teamPass = req.params.teamPassword;
        const email = req.params.email;

        if (teamName === "solo") {
            res.status(403).send(
                "hep hep hep, bien tenté mais tu ne peux pas supprimer un membre de l'équipe solo ! Tu es un petit malin, mais je te ferais remarqué que si tu veux nous embêter, il n'y a pas de vérification d'email ! C'est très facile de mettre le bazar, et juste relou pour nous, alors, stp, passe ton chemin et laisse nous tranquille !"
            );
            return;
        }

        if (!lib.compare_team_password(teamPass, teamName)) {
            res.status(400).send("Invalid team hash or team name");
            return;
        }

        const user = await lib.get_user(email);

        if (user === null) {
            res.status(404).send("User not found");
            return;
        }

        let success = await lib.delete_user(email);
        res.status(success ? 200 : 400).send(
            success ? "User removed" : "Error"
        );
    }
);

app.get("/api/emailAlreadyUsed/:email", async (req, res) => {
    const email = req.params.email;
    const isUsed = await lib.isEmailUsed(email);
    res.send(isUsed);
});
app.get("/api/submissionInformation/", async (req, res) => {
    const submissionInfo = await lib.get_submission_info();
    res.send(submissionInfo);
});
app.post("/api/signin", async (req, res) => {
    if (
        typeof req.body.teamName !== "string" ||
        typeof req.body.password !== "string"
    ) {
        res.status(403).send(
            "Une requête sans mot de passe ou nom d'équipe ?! Qu'es-tu en train de faire petit malin ?"
        );
        return;
    }

    const teamName: string = req.body.teamName;
    const teamPass: string = req.body.password;

    if (teamName === "solo") {
        res.status(403).send(
            "hep hep hep, bien tenté mais tu ne peux pas te connecter à l'équipe solo ! Tu es un petit malin, mais je te surveille..."
        );
        return;
    }

    const isValidHash = await lib.compare_team_password(teamPass, teamName);
    if (isValidHash) {
        res.send("Tu es bien connecté !");
    } else {
        let teamExists = await lib.team_exist(teamName);
        res.status(400).send(
            teamExists ? "Mauvais mot de passe" : "Équipe inexistante"
        );
    }
});
