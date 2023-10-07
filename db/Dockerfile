# Use the official MongoDB image as the base image
FROM mongo:latest

# Copy the MongoDB configuration file into the Docker image
COPY mongodb.conf /etc/mongodb.conf

# Set the MongoDB username and password using environment variables
ENV MONGO_INITDB_ROOT_USERNAME=SET_A_USERNAME
ENV MONGO_INITDB_ROOT_PASSWORD=SET_A_PASSWORD

# Expose the MongoDB port
EXPOSE 27017

# Command to run MongoDB with the specified configuration file
CMD ["mongod", "--config", "/etc/mongodb.conf"]

