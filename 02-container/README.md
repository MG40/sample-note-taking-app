# Sample Note Taking App

Welcome to Sample Note Taking App! This is a simple web application built with Node.js, Express, EJS, and MongoDB that allows you to create and manage your notes. You can write plain text notes or use Markdown for formatting, and even attach images to your notes.

## Features
- **Create Notes:** Easily add new notes with a description.

- **Markdown Support:** Write notes using Markdown syntax for rich text formatting.

- **Image Uploads:** Attach images to your notes (JPEG, JPG, PNG, GIF formats supported, up to 5MB).

- **Persistent Storage:** All your notes are saved in a MongoDB database.

- **Responsive Design:** A basic, clean interface that works on various screen sizes.

## Prerequisites

Before you can run this application, you need to have the following software installed on your machine:

### 1. Docker & Docker Engine:

Docker allows you to package your application into containers, making it easy to run consistently across different environments.

How to Install: Follow the instructions on the official Docker website: https://docs.docker.com/get-docker/.


## Installation

Follow these steps to get the project set up on your local machine:

### 1. Clone or Download the Repository:**

  If you have the code in a Git repository, clone it:
  
        git clone <your-repository-url>
        cd <your-project-folder>

If you downloaded a ZIP file, extract it and navigate into the project folder.

### 2. Create Necessary Directories:
Ensure these directories exist in your project's root:

- `views`: Contains your EJS template files.

- `public/uploads`: This is where uploaded images will be stored.

You can create them manually or use these commands from your project's root:

    mkdir -p views
    mkdir -p public/uploads

### 3. Place Application Files:

- Make sure your main application file (e.g., `app.js` or `index.js`) and Dockerfile are all in the project's root directory.

- Place the `index.ejs` file inside the views directory.

## Running the Application
This method runs both your Node.js application and a MongoDB database in separate Docker containers.

### 1. Build Your Node.js Application Docker Image:
Open your terminal, navigate to your project's root directory (where your Dockerfile is), and run:

    docker build -t sample-note-app .

This command builds the Docker image for your Node.js application.

### 2. Create a Custom Docker Network:
This network allows your app container and MongoDB container to communicate with each other by name.

    docker network create my-note-app-network

### 3. Run the MongoDB Container:
Start the MongoDB database in a detached (background) container, connected to your custom network. This also sets up a persistent volume for your data.

    docker run -d \
        --name my-mongo-db \
        --network my-note-app-network \
        -p 27017:27017 \
        -v mongo_data:/data/db \
        mongo:latest

- `-d`: Runs the container in detached mode.

- `--name my-mongo-db`: Assigns a name to the MongoDB container.

- `--network my-note-app-network`: Connects it to the custom network.

- `-p 27017:27017`: Maps MongoDB's internal port to your host's port (optional, for direct access).

- `-v mongo_data:/data/db`: Persists MongoDB data to a Docker volume.

- `mongo:latest`: The official MongoDB Docker image.

### 4. Run Your Node.js Application Container:
Start your web application in a detached container, connected to the same network, and configured to connect to the MongoDB container by its name.

    docker run -d \
        --name my-note-app-container \
        --network my-note-app-network \
        -p 3000:3000 \
        -e MONGO_URL="mongodb://my-mongo-db:27017/dev" \
        sample-note-app

- `-d`: Runs the container in detached mode.

- `--name my-note-app-container`: Assigns a name to your app container.

- `--network my-note-app-network`: Connects it to the custom network.

- `-p 3000:3000`: Maps your app's internal port to your host's port 3000.

- `-e MONGO_URL="mongodb://my-mongo-db:27017/dev"`: Sets the MongoDB connection string, using the MongoDB container's name as the hostname.

- `sample-note-app`: The Docker image you built for your application.

### 5. Verify Containers are Running and Check App Logs:

- To see if both containers are running:

        docker ps

- To check your app's logs for successful startup and MongoDB connection:

        docker logs my-note-app-container -f

Look for "MongoDB initialised" and "App listening on http://localhost:3000". Press Ctrl+C to exit the log stream.

### 6. Access the Application:
Open your web browser and navigate to:

    http://localhost:3000

## Usage
- ### Adding a Note:

- Type your note's description into the large text area.

- You can use Markdown syntax (e.g., **bold**, *italic*, # Heading, [link](url)) for formatting.

- To attach an image, click "Choose File" and select an image from your computer.

- Click the "Save Note" button.

- ### Viewing Notes:

- Your notes will appear below the form, with the most recent ones at the top.

- Markdown will be rendered as HTML, and attached images will be displayed.

## Stopping and Cleaning Up (When You're Done)
When you're finished using the application, it's good practice to stop and remove the containers and the network to free up resources.

### 1.Stop the containers:

    docker stop my-note-app-container my-mongo-db

### 2. Remove the containers:

    docker rm my-note-app-container my-mongo-db

### 3. Remove the custom network:

    docker network rm my-note-app-network

### 4. Remove the MongoDB data volume (WARNING: This deletes all your notes!):

    docker volume rm mongo_data

## Configuration (Optional)
You can configure the application using environment variables when running the docker run command:

- PORT: The port on which the Express server will listen (default: 3000).

    - Example: -p 8080:3000 and then access http://localhost:8080

- MONGO_URL: The connection string for your MongoDB database (default: `mongodb://my-mongo-db:27017/dev`).

Enjoy using your Sample Note Taking App!