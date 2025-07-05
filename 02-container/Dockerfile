# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the 01-code directory to the working directory
# The build context will be the root of 'my-note-app', so paths are relative to that.
COPY package*.json ./

# Install application dependencies
RUN npm install --production

# Copy the rest of the application code from 01-code to the working directory
COPY . .

# Expose the port that the application listens on
EXPOSE 3000

# Define the command to run the application when the container starts
CMD ["node", "index.js"]
