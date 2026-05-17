const express = require("express");
const router = express.Router();

router.get("/openapi.json", (req, res) => {
  res.status(200).json({
    openapi: "3.0.0",
    info: {
      title: "Notes App API",
      version: "1.0.0",
      description: "A production-ready multi-user notes backend API with JWT authentication",
    },
    servers: [
      {
        url: "https://notesapp-2lkp.onrender.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/register": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "sachin@gmail.com" },
                    password: { type: "string", example: "sachin123" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
            409: { description: "Email already exists" },
          },
        },
      },
      "/login": {
        post: {
          summary: "Login and get JWT token",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "sachin@gmail.com" },
                    password: { type: "string", example: "sachin123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login successful, returns JWT token" },
            400: { description: "Validation error" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/notes": {
        get: {
          summary: "Get all notes for authenticated user",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "List of notes" },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          summary: "Create a new note",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "content"],
                  properties: {
                    title: { type: "string", example: "My Note" },
                    content: { type: "string", example: "Note content here" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Note created successfully" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/notes/{id}": {
        get: {
          summary: "Get a note by ID",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Note found" },
            401: { description: "Unauthorized" },
            403: { description: "Access denied" },
            404: { description: "Note not found" },
          },
        },
        put: {
          summary: "Update a note",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Note updated" },
            401: { description: "Unauthorized" },
            404: { description: "Note not found" },
          },
        },
        delete: {
          summary: "Delete a note",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            204: { description: "Note deleted" },
            401: { description: "Unauthorized" },
            404: { description: "Note not found" },
          },
        },
      },
      "/notes/{id}/share": {
        post: {
          summary: "Share a note with another user",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    share_with_email: {
                      type: "string",
                      example: "friend@gmail.com",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Note shared successfully" },
            400: { description: "Already shared" },
            401: { description: "Unauthorized" },
            404: { description: "User not found" },
          },
        },
      },
      "/notes/{id}/archive": {
        patch: {
          summary: "Archive or unarchive a note",
          tags: ["Notes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Archive status toggled" },
            401: { description: "Unauthorized" },
            404: { description: "Note not found" },
          },
        },
      },
      "/about": {
        get: {
          summary: "About the API and developer",
          tags: ["General"],
          responses: {
            200: { description: "Developer and feature info" },
          },
        },
      },
    },
  });
});

module.exports = router;