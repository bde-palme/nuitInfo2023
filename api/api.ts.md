## API Routes

### 1. Root
**Route**: `/`
**Method**: GET
**Requirements**: None
**Response**: Returns 'API - NDLI 2023 - La PALME'

### 2. Add Team Page
**Route**: `/add_team.html`
**Method**: GET
**Requirements**: None
**Response**: Returns the 'add_team.html' page

### 3. Add User Page
**Route**: `/add_user.html`
**Method**: GET
**Requirements**: None
**Response**: Returns the 'add_user.html' page

### 4. Get All Users
**Route**: `/api/users/`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns all users

### 5. Get All Teams
**Route**: `/api/teams/`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns all teams

### 6. Create Team
**Route**: `/api/teams/create`
**Method**: POST
**Parameters**:
- `teamName`: The name of the team
- `teamHash`: The hash of the team
**Requirements**: None
**Response**: Returns 'Team created' if successful, 'Team already exists' if the team already exists, or 'Team name and hash are required' if the team name or hash is not provided.

### 7. Create User
**Route**: `/api/users/create`
**Method**: POST
**Parameters**:
- `name`: The name of the user
- `first_name`: The first name of the user
- `pmr`: The PMR status of the user
- `course`: The course status of the user
- `teacher`: The teacher of the user
- `email`: The email of the user
- `nickname`: The nickname of the user
- `phone`: The phone number of the user
- `study`: The study of the user
- `comment`: The comment of the user
- `teamName`: The name of the team
- `teamPassword`: The password of the team
**Requirements**: None
**Response**: Returns 'User created and added to team' if successful, 'User already exists' if the user already exists, or 'Invalid team hash or team name' if the team password is incorrect.

### 8. Get User Count
**Route**: `/api/users/count`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the number of users

### 9. Get Team Count
**Route**: `/api/teams/count`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the number of teams

### 10. Get Team Member Count
**Route**: `/api/teams/:teamName/count`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the number of members in the specified team

### 11. Get User by Username
**Route**: `/api/users/:username`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the user with the specified username

### 12. Get Team by Name
**Route**: `/api/teams/:teamName`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the team with the specified name

### 13. Remove User
**Route**: `/api/users/:username/remove`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns 'User removed' if successful

### 14. Remove Team
**Route**: `/api/teams/:teamName/remove`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns 'Team removed' if successful

### 15. Check if Email is Used
**Route**: `/api/emailAlreadyUsed/:email`
**Method**: GET
**Requirements**: None
**Response**: Returns true if the email is already used, false otherwise.

### 16. Get Submission Information
**Route**: `/api/submissionInformation/`
**Method**: GET
**Requirements**: Valid admin token
**Response**: Returns the max number of participants per team, the max number of participants to the event, and the current number of participants.
