"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib = require("./lib");
var dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
var api_token = process.env.ADMIN_TOKEN;
console.log(api_token);
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
    console.log("".concat(new Date().toISOString(), " - ").concat(req.method, " ").concat(req.originalUrl, " STATUS: ").concat(res.statusCode, " - ").concat(req.ip, " - ").concat(req.get('User-Agent'), "}"));
    next();
});
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
app.get('/', function (req, res) {
    res.send('API - NDLI 2023 - La PALME');
});
app.get('/add_team.html', function (req, res) {
    res.sendFile(__dirname + '/static/add_team.html');
});
app.get('/add_user.html', function (req, res) {
    res.sendFile(__dirname + '/static/add_user.html');
});
app.get('/api/users/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_all_users()];
            case 1:
                users = _a.sent();
                res.send(users);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/teams/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, teams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_all_teams()];
            case 1:
                teams = _a.sent();
                res.send(teams);
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/teams/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamName, teamHash, teamExists, team;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                teamName = req.body.teamName;
                teamHash = req.body.teamHash;
                if (!teamName || !teamHash) {
                    res.status(400).send('Team name and hash are required');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.team_exist(teamName)];
            case 1:
                teamExists = _a.sent();
                if (teamExists) {
                    res.status(400).send('Team already exists');
                    return [2 /*return*/];
                }
                team = {
                    name: teamName,
                    hash: teamHash,
                    members: [] // Fix: Corrected property name from 'membres' to 'members'
                };
                return [4 /*yield*/, lib.add_team(team)];
            case 2:
                _a.sent();
                res.status(201).send('Team created');
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/users/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, teamName, teamPass, userExists, teamExists, isValidHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.body.course == "true") {
                    req.body.course = true;
                }
                else {
                    req.body.course = false;
                }
                if (req.body.pmr == "true") {
                    req.body.pmr = true;
                }
                else {
                    req.body.pmr = false;
                }
                user = {
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
                teamName = req.body.teamName;
                teamPass = req.body.teamPassword;
                console.log(req.body);
                // Check if all parameters are provided and are of the correct type
                if (typeof user.name !== 'string' || typeof user.first_name !== 'string' ||
                    typeof user.pmr !== 'boolean' || typeof user.course !== 'boolean' ||
                    typeof user.teacher !== 'string' ||
                    typeof user.email !== 'string' || typeof user.nickname !== 'string' ||
                    typeof user.phone !== 'string' || typeof user.study !== 'string' ||
                    typeof user.comment !== 'string' || typeof teamName !== 'string' ||
                    typeof teamPass !== 'string') {
                    res.status(400).send('Invalid parameters');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.user_exist(user.email, user.phone, user.nickname)];
            case 1:
                userExists = _a.sent();
                if (userExists) {
                    res.status(400).send('User already exists');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.team_exist(teamName)];
            case 2:
                teamExists = _a.sent();
                if (!teamExists) return [3 /*break*/, 7];
                return [4 /*yield*/, lib.compare_team_password(teamPass, teamName)];
            case 3:
                isValidHash = _a.sent();
                if (!isValidHash) return [3 /*break*/, 6];
                return [4 /*yield*/, lib.add_user(user)];
            case 4:
                _a.sent();
                return [4 /*yield*/, lib.add_user_to_team(teamName, user)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                res.status(400).send('Invalid team hash or team name');
                return [2 /*return*/];
            case 7:
                res.status(201).send('User created and added to team');
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/users/count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_number_of_users()];
            case 1:
                count = _a.sent();
                res.send({ count: count });
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/teams/count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_number_of_teams()];
            case 1:
                count = _a.sent();
                res.send({ count: count });
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/teams/:teamName/count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, teamName, teamExists, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                teamName = req.params.teamName;
                return [4 /*yield*/, lib.team_exist(teamName)];
            case 1:
                teamExists = _a.sent();
                if (!teamExists) {
                    res.status(404).send('Team not found');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_number_of_members(teamName)];
            case 2:
                count = _a.sent();
                res.send({ count: count });
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/users/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, username, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                username = req.params.username;
                return [4 /*yield*/, lib.get_user(username)];
            case 1:
                user = _a.sent();
                if (user === null) {
                    res.status(404).send('User not found');
                    return [2 /*return*/];
                }
                res.send(user);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/teams/:teamName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, teamName, team;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                teamName = req.params.teamName;
                return [4 /*yield*/, lib.get_team(teamName)];
            case 1:
                team = _a.sent();
                if (team === null) {
                    res.status(404).send('Team not found');
                    return [2 /*return*/];
                }
                res.send(team);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/users/:username/remove', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, username, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                username = req.params.username;
                return [4 /*yield*/, lib.get_user(username)];
            case 1:
                user = _a.sent();
                if (user === null) {
                    res.status(404).send('User not found');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.delete_user(username)];
            case 2:
                _a.sent();
                res.send('User removed');
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/teams/:teamName/remove', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, teamName, team;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                teamName = req.params.teamName;
                return [4 /*yield*/, lib.get_team(teamName)];
            case 1:
                team = _a.sent();
                if (team === null) {
                    res.status(404).send('Team not found');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.delete_team(teamName)];
            case 2:
                _a.sent();
                res.send('Team removed');
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/emailAlreadyUsed/:email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, isUsed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.email;
                return [4 /*yield*/, lib.isEmailUsed(email)];
            case 1:
                isUsed = _a.sent();
                res.send(isUsed);
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/submissionInformation/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, submissionInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.query.token;
                if (token !== api_token) {
                    res.status(403).send('Invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, lib.get_submission_info()];
            case 1:
                submissionInfo = _a.sent();
                res.send(submissionInfo);
                return [2 /*return*/];
        }
    });
}); });
