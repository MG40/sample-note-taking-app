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

1. ### Node.js and npm (Node Package Manager):

    Node.js is a JavaScript runtime, and npm is its package manager.

    **How to Install:** Download the recommended version from the official Node.js website: https://nodejs.org/. npm is included with Node.js.

    **Verify Installation:** Open your terminal or command prompt and run:

        node -v
        npm -v

    You should see version numbers for both.

2. ### MongoDB:

    - This application uses MongoDB as its database.

    - How to Install:

        - Local Installation (Recommended for development): Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community. Follow the installation instructions for your operating system.

        - MongoDB Atlas (Cloud Database): Alternatively, for a cloud-based solution, you can sign up for a free tier on MongoDB Atlas: https://www.mongodb.com/cloud/atlas. If you use Atlas, you'll get a connection string (URI) that you'll use for `MONGO_URL`.

    - Start MongoDB: After installation, ensure your MongoDB server is running. The command varies by OS, but it's often `mongod` or `sudo systemctl start mongod` on Linux.

## Installation
Follow these steps to get the project set up on your local machine:

**1. Clone or Download the Repository:**

  If you have the code in a Git repository, clone it:
  
        git clone <your-repository-url>
        cd <your-project-folder>

If you downloaded a ZIP file, extract it and navigate into the project folder.

**2. Install Node.js Dependencies:**

Open your terminal or command prompt, navigate to the root directory of your project (where package.json and app.js are located), and run:

`npm install`

This command will install all the necessary packages (Express, MongoDB driver, Multer, Marked, EJS) listed in `package.json`.

**3.Create Necessary Directories:**
Ensure these directories exist:

- `views`: Contains your EJS template files.

- `public/uploads`: This is where uploaded images will be stored.

If not created, you can create them manually or use these commands from your project's root:

    mkdir -p views
    mkdir -p public/uploads

**4. Place Application Files:**

- Make sure your main application file (e.g., index.js`) is in the project's root directory.

- Place the `index.ejs` file inside the `views` directory.

## Running the Application
1. Start your MongoDB server. (If it's not already running).

2. Run the Node.js application:

From your project's root directory in the terminal, execute:

    node index.js

You should see output similar to this:

    Initialising MongoDB...
    MongoDB initialised
    App listening on http://localhost:3000

3. Access the Application:

Open your web browser and navigate to:

    http://localhost:3000

## Usage
**- Adding a Note:**

- Type your note's description into the large text area.

- You can use Markdown syntax (e.g., **bold**, *italic*, # Heading, [link](url)) for formatting.

- To attach an image, click "Choose File" and select an image from your computer.

- Click the "Save Note" button.

**- Viewing Notes:**

- Your notes will appear below the form, with the most recent ones at the top.

- Markdown will be rendered as HTML, and attached images will be displayed.

### Configuration (Optional)
You can configure the application using environment variables:

- `PORT`: The port on which the Express server will listen (default: 3000).

    - Example: `PORT=8080 node index.js`

- `MONGO_URL`: The connection string for your MongoDB database (default: `mongodb://127.0.0.1:27017/dev`).

    - Example (for MongoDB Atlas): `MONGO_URL="mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority" node app.js`

Enjoy using your Sample Note Taking App!
