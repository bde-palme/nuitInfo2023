# nuitInfo2023
site de la nuit de l'info pour les inscriptions au site de l'istic 

# .env

A .env file need to be created in the main directory with the following values

MONGO_INITDB_ROOT_USERNAME=SET_A_USERNAME
MONGO_INITDB_ROOT_PASSWORD=SET_A_PASSWORD
DB_PATH=mongodb://SET_A_USERNAME:SET_A_PASSWORD@localhost:27017
ADMIN_TOKEN=1234

Theses environment variable will be used to create the MongoDB database and for the API to connect to this db.
( Change thoses values )