const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createNote , getAllNotes, getNoteById, updateNote, deleteNote, shareNote, toggleArchiveNote} = require("../controllers/noteController");

const router = express.Router();

// Create note
router.post("/notes", authMiddleware, createNote);

// Get all notes
router.get("/notes", authMiddleware, getAllNotes);

// Get note by ID
router.get("/notes/:id", authMiddleware, getNoteById);

// update note by id
router.put("/notes/:id", authMiddleware, updateNote);

// delete note by id
router.delete("/notes/:id", authMiddleware, deleteNote);

// Share a note with another user
router.post("/notes/:id/share", authMiddleware, shareNote);

// Toggle archive status of a note
router.patch("/notes/:id/archive", authMiddleware, toggleArchiveNote);

module.exports = router;