import * as lib from './lib';
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const api_token = process.env.ADMIN_TOKEN;
console.log(api_token);

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} STATUS: ${res.statusCode} - ${req.ip} - ${req.get('User-Agent')}}`);
  next();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  });

app.get('/', (req, res) => {
    res.send('API - NDLI 2023 - La PALME');
});

app.get('/add_team.html', (req, res) => {
    res.sendFile(__dirname + '/static/add_team.html');
});

app.get('/add_user.html', (req, res) => {
    res.sendFile(__dirname + '/static/add_user.html');
});



app.get('/api/users/', async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const users = await lib.get_all_users();
    res.send(users);
  });

  app.get('/api/teams/', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const teams = await lib.get_all_teams();
    res.send(teams);
  });

  app.post('/api/teams/create', async (req, res) => {
    const teamName = req.body.teamName;
    const teamHash = req.body.teamHash;
  
    if (!teamName || !teamHash) {
      res.status(400).send('Team name and hash are required');
      return;
    }
  
    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
        res.status(400).send('Team already exists');
        return;
    }

    const team = {
        name: teamName,
        hash: teamHash,
        members: [] // Fix: Corrected property name from 'membres' to 'members'
    };

    await lib.add_team(team);
    res.status(201).send('Team created');
  });
 
  app.post('/api/users/create', async (req, res) => {

    if(req.body.course == "true"){
      req.body.course = true;
    }
    else{
      req.body.course = false;
    }

    if(req.body.pmr == "true"){
      req.body.pmr = true;
    }
    else{
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
      nickname: req.body.nickname,
      phone: req.body.phone,
      study: req.body.study,
      comment: req.body.comment
    };
  
    const teamName = req.body.teamName;
    const teamPass = req.body.teamPassword;
    console.log(req.body)
  
    // Check if all parameters are provided and are of the correct type
    if (typeof user.name !== 'string' || typeof user.first_name !== 'string' || 
        typeof user.pmr !== 'boolean' || typeof user.course !== 'boolean' || 
        typeof user.teacher !== 'string' ||  
        typeof user.email !== 'string' || typeof user.nickname !== 'string' || 
        typeof user.phone !== 'string' || typeof user.study !== 'string' || 
        typeof user.comment !== 'string' || typeof teamName !== 'string' || 
        typeof teamPass !== 'string') {

      res.status(400).send('Invalid parameters');
      return;
    }
  
    const userExists = await lib.user_exist(user.email, user.phone, user.nickname);
    if (userExists) {
      res.status(400).send('User already exists');
      return;
    }
  
    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
      const isValidHash = await lib.compare_team_password(teamPass,teamName);
      if (isValidHash) {
        await lib.add_user(user);
        await lib.add_user_to_team(teamName, user);
      } else {
        res.status(400).send('Invalid team hash or team name');
        return;
      }
    }

  
    res.status(201).send('User created and added to team');
  });

  app.get('/api/users/count', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const count = await lib.get_number_of_users();
    res.send({ count });
  });

  app.get('/api/teams/count', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const count = await lib.get_number_of_teams();
    res.send({ count });
  });

  app.get('/api/teams/:teamName/count', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const teamName = req.params.teamName;
    // Check if team exists
    const teamExists = await lib.team_exist(teamName);
    if (!teamExists) {
      res.status(404).send('Team not found');
      return;
    }

    const count = await lib.get_number_of_members(teamName);
    res.send({ count });
  });

  app.get('/api/users/:username', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }

  
    const username = req.params.username;
    const user = await lib.get_user(username);
  
    if (user === null) {
      res.status(404).send('User not found');
      return;
    }
  
    res.send(user);
  });

  app.get('/api/teams/:teamName', async (req, res) => {
    const token = req.query.token;
  
    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }
  
    const teamName = req.params.teamName;
    const team = await lib.get_team(teamName);
  
    if (team === null) {
      res.status(404).send('Team not found');
      return;
    }
  
    res.send(team);
  });

  app.get('/api/users/:username/remove', async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }

    const username = req.params.username;
    const user = await lib.get_user(username);

    if (user === null) {
      res.status(404).send('User not found');
      return;
    }

    await lib.delete_user(username);
    res.send('User removed');
  });

  app.get('/api/teams/:teamName/remove', async (req, res) => {
    const token = req.query.token;

    if (token !== api_token) {
      res.status(403).send('Invalid token');
      return;
    }

    const teamName = req.params.teamName;
    const team = await lib.get_team(teamName);

    if (team === null) {
      res.status(404).send('Team not found');
      return;
    }

    await lib.delete_team(teamName);
    res.send('Team removed');
  });

