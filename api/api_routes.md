
## `route.md`

### 1. Index

**Route**: `/`  
**Method**: GET  
**Description**: Default endpoint for the API.  
**Response**: "API NDL2023"  

---

### 2. Create Team

**Route**: `/createTeam/<team_name>`  
**Method**: GET  
**Parameters**:   
- `team_name`: The name of the team you want to create.  
**Requirements**: None.  
**Response**: Either a success message with the generated password or an error message.  

---

### 3. Join Team

**Route**: `/joinTeam/<team_name>/<password>`  
**Method**: POST  
**Parameters**:   
- `team_name`: The name of the team you want to join.  
- `password`: The password for the team.  
**Body (JSON)**:  

```json
{
    "name": "String",
    "first_name": "String",
    "pmr": "bool",
    "course": "bool",
    "teacher": ["String", ...],
    "timestamp": "String",
    "email": "String",
    "nickname": "String (Optional)",
    "phone": "String",
    "study": "String",
    "comment": "String"
}
```

**Requirements**: Content-Type header must be set to `application/json`.  
**Response**: Either a success message or an error message.  

---



---

### 9. Join Solo

**Route**: `/joinSolo`  
**Method**: POST  
**Body (JSON)**:  

```json
{
    "name": "String",
    "first_name": "String",
    "pmr": "bool",
    "course": "bool",
    "teacher": ["String", ...],
    "timestamp": "String",
    "email": "String",
    "nickname": "String (Optional)",
    "phone": "String",
    "study": "String",
    "comment": "String"
}
```

**Requirements**: Content-Type header must be set to `application/json`.  
**Response**: Either a success message or an error message.
### 6. Number of Users

**Route**: `/nbUsers/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns the number of users or an error message.  

---

### 6. Number of Teams

**Route**: `/nbTeams/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns the number of teams or an error message.  

---

### 8. Dump Teams

**Route**: `/dumpTeams/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns a dump of all teams or an error message.  

---

### 8. Dump Team

**Route**: `/dumpTeam/<teamname>/<token>`  
**Method**: GET  
**Parameters**:   
- `teamname`: The name of the team you want to retrieve.  
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns a dump of the specified team or an error message.  

---

### 9. CORS Preflight Handler

**Route**: `/<_path..>`  
**Method**: OPTIONS  
**Description**: Handles preflight CORS requests.  
**Response**: Customized CORS headers.  
