
## `route.md`

### 1. Index

**Route**: `/`  
**Method**: GET  
**Description**: Default endpoint for the API.  
**Response**: "API NDL2023"  



### 2. Create Team

**Route**: `/createTeam/<team_name>`  
**Method**: GET  
**Parameters**:   
- `team_name`: The name of the team you want to create.  
**Requirements**: None.  
**Response**: Either a success message with the generated password or an error message.  



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

**Requirements**: Content-Type header must be set to `application/json`. The request will be refused if the total number of submissions exceeds the maximum number of participants to the event, or if the number of submissions for the team exceeds the maximum number of participants per team.
**Response**: Either a success message or an error message.




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

**Requirements**: Content-Type header must be set to `application/json`. The request will be refused if the total number of submissions exceeds the maximum number of participants to the event.  
**Response**: Either a success message or an error message.


### 6. Number of Users

**Route**: `/nbUsers/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns the number of users or an error message.  


### 6. Number of Teams

**Route**: `/nbTeams/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns the number of teams or an error message.  

### 6. Submission information

**Route**: `/submissionInformation/`  
**Method**: GET  
**Requirements**: Valid admin token.  
**Response**: Returns the max number of participants per team, the max number of participants to the event, and the current number of participants.

### 7. Email already used
**Route**: `/emailAlreadyUsed/<email>`
**Method**: GET
**Parameters**:
- `email`: The email you want to check
**Requirements**: None
**Response**: Returns true if the email is already used, false otherwise

### 8. Dump Teams

**Route**: `/dumpTeams/<token>`  
**Method**: GET  
**Parameters**:   
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns a dump of all teams or an error message.  



### 9. Dump Team

**Route**: `/dumpTeam/<teamname>/<token>`  
**Method**: GET  
**Parameters**:   
- `teamname`: The name of the team you want to retrieve.  
- `token`: An administrative token for verification.  
**Requirements**: Valid admin token.  
**Response**: Returns a dump of the specified team or an error message.  

### 10. Remove Team
**Route**: `/removeTeam/<teamname>/<token>`
**Method**: GET
**Parameters**:
- `teamname`: The name of the team you want to remove
- `token`: An administrative token for verification
**Requirements**: Valid admin token
**Response**: Returns a success message or an error message

### 11. Remove User
**Route**: `/removeUser/<teamname>/<email>/<token>`
**Method**: GET
**Parameters**:
- `teamname`: The name of the team you want to remove the user from
- `email`: The email of the user you want to remove
- `token`: An administrative token for verification
**Requirements**: Valid admin token
**Response**: Returns a success message or an error message

### 12. Add User to Team
**Route**: `/addUserToTeam/<teamname>/<email>/<token>`
**Method**: GET
**Parameters**:
- `teamname`: The name of the team you want to add the user to
- `email`: The email of the user you want to add
- `token`: An administrative token for verification
**Requirements**: Valid admin token
**Response**: Returns a success message or an error message

### 9. CORS Preflight Handler

**Route**: `/<_path..>`  
**Method**: OPTIONS  
**Description**: Handles preflight CORS requests.  
**Response**: Customized CORS headers.  
