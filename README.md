## Hack Ta Fac 2024

This project is the fullstack website for registering to the HackTaFac 2024 event, in Rennes, at the ISTIC school. This event is organized by the student association la Palme.

- Backend: Node.js, typescript
- Database: MongoDB
- Frontend: Svelte, typescript

Design & code realised by Valentin Regnault.

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

# Images

![image](images-readme/image.png)
![image](images-readme/image2.png)
![image](images-readme/image3.png)
![image](images-readme/image4.png)
