# Use the latest node image as the base image
FROM node:14.19.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the frontend code into the container
COPY . .

# Install the HTTP server globally
RUN npm install -g http-server

# Build the frontend if needed (you can skip this if your frontend is static)
# RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Start the HTTP server to serve the static files
CMD [ "http-server", "-p", "8080" ]