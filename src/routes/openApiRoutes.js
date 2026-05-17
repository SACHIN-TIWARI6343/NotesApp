const express = require("express");
const router = express.Router();

router.get("/openapi.json", (req, res) => {
  res.status(200).json({
    openapi: "3.0.0",
    info: {
      title: "Notes App API",
      version: "1.0.0",
      description: "Multi-user notes backend API",
    },
    paths: {
      "/register": {
        post: {
          summary: "Register a new user",
        },
      },
      "/login": {
        post: {
          summary: "Authenticate a user",
        },
      },
      "/notes": {
        get: {
          summary: "Get all notes",
        },
        post: {
          summary: "Create a new note",
        },
      },
      "/notes/{id}": {
        get: {
          summary: "Get a note by ID",
        },
        put: {
          summary: "Update a note",
        },
        delete: {
          summary: "Delete a note",
        },
      },
      "/notes/{id}/share": {
        post: {
          summary: "Share a note with another user",
        },
      },
      "/notes/{id}/archive": {
        patch: {
          summary: "Archive or unarchive a note",
        },
      },
      "/about": {
        get: {
          summary: "About the developer and custom feature",
        },
      },
      "/openapi.json": {
        get: {
          summary: "OpenAPI specification",
        },
      },
    },
  });
});

module.exports = router;