const Note = require("../models/Note");
const User = require("../models/User");
const mongoose = require("mongoose");


const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Create note
    const note = await Note.create({
      title,
      content,
      owner: req.user._id, // this is the important line where we associate the note with the authenticated user
    });

    // Return response
    return res.status(201).json({
      id: note._id,
      title: note.title,
      content: note.content,
      created_at: note.created_at,
      updated_at: note.updated_at,
    });

   } catch (error) {

    console.error("Create note error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });

   }
};

const getAllNotes = async (req, res) => {
  try {
    // Find notes owned by the authenticated user
    // Exclude archived notes by default
    const notes = await Note.find({
      owner: req.user._id,
      archived: false,
    }).sort({ created_at: -1 });

    // Transform documents into API response format
    const response = notes.map((note) => ({
      id: note._id,
      title: note.title,
      content: note.content,
      created_at: note.created_at,
      updated_at: note.updated_at,
    }));

    return res.status(200).json(response);

  } catch (error) {
    console.error("Get all notes error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });

  }
};


const getNoteById = async (req, res) => {
  try {

    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Find the note by ID
    const note = await Note.findById(id);

    // Note does not exist
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }


    // Authorization check: user must be owner or in sharedWith
    const isOwner =
    note.owner.toString() === req.user._id.toString();

    const isSharedWithUser = note.sharedWith.some(
     (userId) =>
      userId.toString() === req.user._id.toString()
    );  



    if (!isOwner && !isSharedWithUser) {
     return res.status(403).json({
     message: "Forbidden",
     }); 
   } 



    // Success response
    return res.status(200).json({
      id: note._id,
      title: note.title,
      content: note.content,
      created_at: note.created_at,
      updated_at: note.updated_at,
    });

    
  } catch (error) {
    console.error("Get note by ID error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate note ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Validate request body
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Find note
    const note = await Note.findById(id);

    // Note not found
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Authorization check
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Update note
    note.title = title;
    note.content = content;

    await note.save();

    // Return updated note
    return res.status(200).json({
      id: note._id,
      title: note.title,
      content: note.content,
      created_at: note.created_at,
      updated_at: note.updated_at,
    });
  } catch (error) {
    console.error("Update note error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate note ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Find note
    const note = await Note.findById(id);

    // Note not found
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Authorization check
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Delete note
    await note.deleteOne();

    // 204 No Content
    return res.status(204).send();

  } catch (error) {
    console.error("Delete note error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const toggleArchiveNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate note ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Find note
    const note = await Note.findById(id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Only owner can archive/unarchive
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Toggle archived value
    note.archived = !note.archived;

    // Save note
    await note.save();


    // Return response
    return res.status(200).json({
      message: note.archived
        ? "Note archived successfully"
        : "Note unarchived successfully",
      archived: note.archived,
    });


  } catch (error) {
    
    console.error("Toggle archive error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const shareNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { share_with_email } = req.body;

    // 1. Validate note ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // 2. Validate request body
    if (!share_with_email) {
      return res.status(400).json({
        message: "share_with_email is required",
      });
    }

    // 3. Find note
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // 4. Only owner can share
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // 5. Find target user by email
    const targetUser = await User.findOne({
      email: share_with_email,
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 6. Prevent sharing with yourself
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot share a note with yourself",
      });
    }

    // 7. Prevent duplicates
    const alreadyShared = note.sharedWith.some(
      (userId) =>
        userId.toString() === targetUser._id.toString()
    );

    if (alreadyShared) {
      return res.status(200).json({
        message: "Note is already shared with this user",
      });
    }

    // 8. Add target user to sharedWith
    note.sharedWith.push(targetUser._id);

    // 9. Save note
    await note.save();

    // 10. Success response
    return res.status(200).json({
      message: "Note shared successfully",
    });
  } catch (error) {
    console.error("Share note error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote,
  toggleArchiveNote
};


