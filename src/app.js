const express = require('express'); // Import the Express framework
const cors = require('cors'); // Import the CORS middleware
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const noteRoutes = require('./routes/noteRoutes'); // Import note routes
const openApiRoutes = require("./routes/openApiRoutes");

const authMiddleware = require("./middleware/authMiddleware"); // Import authentication middleware


const app = express(); // Create an instance of the Express application

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use(authRoutes); // Use the authentication routes
app.use(noteRoutes); // Use the note routes
app.use(openApiRoutes); // Use the OpenAPI routes


// About Endpoint
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Sachin Tiwari",
    email: "tiwarisachin6343@gmail.com",
    "my features": {
      "Archive Notes":
        "Allows users to archive and unarchive notes without deleting them. I chose this feature because it is commonly used in note-taking applications like Google Keep and helps users hide notes while preserving data.",
    },
  });
});

// Protected test route
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});


module.exports = app; // Export the app for use in other files (e.g., server.js)