const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb'); // Destructure MongoClient for clarity
const multer = require('multer');
const { marked } = require('marked'); // Destructure marked for clarity

const app = express();
const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/dev';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, cb) => {
    // 'public/uploads/' is where the files will be stored relative to the app's root
    cb(null, path.join(__dirname, 'public/uploads/'));
  },
  // Define how the filename will be generated
  filename: (req, file, cb) => {
    // Create a unique filename using the fieldname, current timestamp, and original file extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer with the storage configuration and file limits/filters
const upload = multer({
  storage: storage,
  // Set a file size limit (e.g., 5MB) to prevent large uploads
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  // Filter files to only allow specific image types
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed image file types
    const mimetype = filetypes.test(file.mimetype); // Check MIME type
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension

    if (mimetype && extname) {
      // If both MIME type and extension are valid, accept the file
      return cb(null, true);
    }
    // Otherwise, reject the file with an error message
    cb(new Error("Error: File upload only supports images (jpeg, jpg, png, gif)"));
  }
});

// Variable to hold the MongoDB client instance
let client;
// Function to initialize MongoDB connection with retry logic
async function initMongo() {
  console.log('Initialising MongoDB...');
  let success = false;
  // Loop until a successful connection is established
  while (!success) {
    try {
      // Attempt to connect to MongoDB
      client = await MongoClient.connect(mongoURL, {
        useNewUrlParser: true, // Use the new URL parser
        useUnifiedTopology: true, // Use the new server discovery and monitoring engine
      });
      success = true; // Set success to true if connection is successful
      console.log('MongoDB initialised');
      // Return the 'notes' collection from the connected database
      return client.db(client.s.options.dbName).collection('notes');
    } catch (error) {
      // Log error and retry after a delay if connection fails
      console.log('Error connecting to MongoDB, retrying in 1 second:', error.message);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Main function to start the application
async function start() {
  // Initialize MongoDB and get the 'notes' collection
  const db = await initMongo();

  // Set EJS as the view engine
  app.set('view engine', 'ejs');
  // Specify the directory where EJS templates are located
  app.set('views', path.join(__dirname, 'views'));
  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')));
  // Enable parsing of URL-encoded data (for form submissions)
  app.use(express.urlencoded({ extended: true }));

  // Route for the home page
  app.get('/', async (req, res) => {
    try {
      // Retrieve notes and render the index page
      res.render('index', { notes: await retrieveNotes(db), errorMessage: null });
    } catch (error) {
      console.error('Error fetching notes for home page:', error);
      res.status(500).send('Error loading notes. Please try again later.');
    }
  });

  // Route to handle note submission and image uploads
  app.post(
    '/note',
    upload.single('image'), // Use the configured multer instance to handle 'image' file upload
    async (req, res) => {
      let description = req.body.description || ''; // Get description from form, default to empty string

      // Check if a file was uploaded and append its markdown link to the description
      if (req.file) {
        const link = `/uploads/${encodeURIComponent(req.file.filename)}`;
        description += `\n![](${link})`; // Append image markdown to the description
      }

      // Basic validation: ensure there's content to save
      if (!description.trim()) {
        console.log('Attempted to save empty note.');
        // If no description or image, redirect back without saving
        return res.redirect('/');
      }

      try {
        // Save the note (description with or without image markdown) to the database
        await saveNote(db, { description: description });
        // Redirect to the home page to display the updated list of notes (Post/Redirect/Get pattern)
        res.redirect('/');
      } catch (error) {
        console.error('Error saving note or uploading file:', error);
        // If an error occurs during save, render the index page with an error message
        res.status(500).render('index', {
          notes: await retrieveNotes(db), // Still try to show existing notes
          errorMessage: 'Failed to save note. Please try again.'
        });
      }
    },
  );

  // Start the Express server
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

// Function to save a new note to the database
async function saveNote(db, note) {
  // Insert the note document into the 'notes' collection
  await db.insertOne(note);
}

// Function to retrieve notes from the database
async function retrieveNotes(db) {
  // Find all notes, sort them by _id in descending order (latest first), and convert to an array
  const notes = await db.find().sort({ _id: -1 }).toArray();
  // Map over the notes to apply Markdown conversion to their descriptions
  return notes.map(it => ({ ...it, description: marked(it.description) }));
}

// Call the start function to initialize and run the application
start();
