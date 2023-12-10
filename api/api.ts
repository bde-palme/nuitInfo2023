import * as lib from './lib';
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const api_token = process.env.ADMIN_TOKEN;
console.log(api_token);

const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
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
    const user: lib.User = {
      name: req.body.name,
      first_name: req.body.first_name,
      pmr: req.body.pmr,
      course: req.body.course,
      teacher: req.body.teacher,
      timestamp: req.body.timestamp,
      email: req.body.email,
      nickname: req.body.nickname,
      phone: req.body.phone,
      study: req.body.study,
      comment: req.body.comment
    };
  
    const teamName = req.body.team_name;
    const teamHash = req.body.team_hash;
  
    // Check if all parameters are provided and are of the correct type
    if (typeof user.name !== 'string' || typeof user.first_name !== 'string' || 
        typeof user.pmr !== 'boolean' || typeof user.course !== 'boolean' || 
        !Array.isArray(user.teacher) || typeof user.timestamp !== 'string' || 
        typeof user.email !== 'string' || typeof user.nickname !== 'string' || 
        typeof user.phone !== 'string' || typeof user.study !== 'string' || 
        typeof user.comment !== 'string' || typeof teamName !== 'string' || 
        typeof teamHash !== 'string') {
      res.status(400).send('Invalid parameters');
      return;
    }
  
    const userExists = await lib.user_exist(user.email, user.phone, user.nickname);
    if (userExists) {
      res.status(400).send('User already exists');
      return;
    }
  
    await lib.add_user(user);
  
    const teamExists = await lib.team_exist(teamName);
    if (teamExists) {
      const isValidHash = await lib.compare_team_hash(teamName, teamHash);
      if (isValidHash) {
        await lib.add_user_to_team(teamName, user);
      } else {
        res.status(400).send('Invalid team hash');
        return;
      }
    }
  
    res.status(201).send('User created and added to team');
  });
