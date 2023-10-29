# Team Management API

This API is built using Rocket and provides functionality for managing teams and users. Below are the routes available in this API along with the expected input and output for each route.

## Routes

### Create Team

- **Method**: GET
- **Path**: `/createTeam/<team_name>`
- **Description**: Creates a new team with the specified name.
- **Parameters**:
    - `team_name` (in URL): The name of the team to be created.
- **Responses**:
    - `Accepted (200)`: If the team is successfully created, it returns the generated password.
    - `Forbidden (403)`: If a team with the given name already exists, or if there's a failure in checking the team existence or creating the team.

### Join Team

- **Method**: POST
- **Path**: `/joinTeam/<team_name>/<password>`
- **Description**: Allows a user to join an existing team.
- **Parameters**:
    - `team_name` and `password` (in URL): The name of the team to join and the password.
    - `user` (in body): The user data in JSON format.
- **Example Input**:
    ```json
    {
        "name": "Doe",
        "first_name": "John",
        "pmr": false,
        "course": true,
        "teacher": ["Teacher1", "Teacher2"],
        "timestamp": "2023-10-29T12:34:56Z",
        "email": "john.doe@example.com",
        "nickname": "johnd",
        "phone": "123-456-7890",
        "study": "Computer Science",
        "comment": "Excited to join the team!"
    }
    ```
- **Responses**:
    - `Accepted (200)`: If the user is successfully added to the team.
    - `Forbidden (403)`: If the team doesn't exist, password is wrong, user data is already used, or there's a failure in any of the database operations.

### Get Number of Users

- **Method**: GET
- **Path**: `/nbUsers/<token>`
- **Description**: Retrieves the total number of users in the system.
- **Parameters**:
    - `token` (in URL): An admin token.
- **Responses**:
    - `Accepted (200)`: Returns the number of users if the token is valid.
    - `Forbidden (403)`: If the token is invalid.

### Get Number of Teams

- **Method**: GET
- **Path**: `/nbTeams/<token>`
- **Description**: Retrieves the total number of teams in the system.
- **Parameters**:
    - `token` (in URL): An admin token.
- **Responses**:
    - `Accepted (200)`: Returns the number of teams if the token is valid.
    - `Forbidden (403)`: If the token is invalid.

