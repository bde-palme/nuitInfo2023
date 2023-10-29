# NDL2023 - API d'inscription de la Palme

This project is structured to provide a backend API using Rocket for managing teams and users within the scope of "Nuit de l'Info 2023" event registration at ISTIC. It has a MongoDB setup to handle data persistence. The project is containerized using Docker to ensure a consistent working environment.

*This is not affiliated to the official organization of la nuit de l'info.*


## Project Structure

```plaintext
.
├── LICENSE
├── README.md
├── api
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── Rocket.toml
│   ├── api_routes.md
│   ├── src
│   └── target
├── db
│   ├── data
│   ├── docker-compose.yml
│   ├── mongodb.conf
│   └── schemas
└── docker-compose.yml
```

## Getting Started

    1. Ensure you have Docker and Docker Compose installed on your machine.
    2. Clone the repository to your local machine.
    3. Navigate to the project directory.
    4. Create a .env file following next example
    5. docker-compose up --build

### .env file example
```
MONGO_INITDB_ROOT_USERNAME=SET_A_USERNAME
MONGO_INITDB_ROOT_PASSWORD=SET_A_PASSWORD
DB_PATH=mongodb://SET_A_USERNAME:SET_A_PASSWORD@localhost:27017
ADMIN_TOKEN=1234
```

## Access the API and Database

### MongoDB 
You can connect to the database using :
```
mongosh mongodb://SET_A_USERNAME:SET_A_PASSWORD@localhost:27017
```

### API
```
http://127.0.0.1:8000
```

API routes are described in the api_routes.md
