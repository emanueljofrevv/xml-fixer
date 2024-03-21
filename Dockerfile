# Set the base image to the specific version of Node.js
FROM node:14.19.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the 'package.json' file and, if available, 'package-lock.json' to the current work directory
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Adjust the COPY command to reflect the src directory structure
COPY src/ ./src/

# Expose the port that the app will run on within the container
EXPOSE 3000

# Adjust the CMD to reflect the src directory structure
CMD [ "node", "src/index.js" ]
