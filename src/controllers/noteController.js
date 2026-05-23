const Note = require("../models/Note");
const User = require("../models/User");
const mongoose = require("mongoose");

const { 
        createUserNote
      , getUserNotes
      , getNotebyId
      , updateUserNote
      , deleteUserNote

} = require("../services/noteService.js");

const createNote = async (req, res) => {
  try {

    // Request body parsing 
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // Create note  service function call
    const note = await createUserNote(title, content, req.user._id);
    
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
    const notes = await  getUserNotes(req.user._id);

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
    
    // parse note id from request parameters
    const { id } = req.params;

    const note = await getNotebyId(id);

    // check what service function returned and handle accordingly
    if (note instanceof Error) {
      if (note.message === "Note not found") {
        return res.status(404).json({
          message: "Note not found",
        });
      }
    }
      if (note.message === "Forbidden") {
        return res.status(403).json({
          message: "Forbidden",
        });
       }


    // Success response formating
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

    // data parsing from request body and parameters
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate note ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    
    const note = await updateUserNote(id, req.user._id, title, content);

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

      if (error.message === "Note not found") {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      if (error.message === "Forbidden") {
        return res.status(403).json({
          message: "Forbidden",
        });
       }
    
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

    await deleteUserNote(id, req.user._id);

    // 204 No Content
    return res.status(204).send();

  } catch (error) {
    console.error("Delete note error:", error);
  
      if (error.message === "Note not found") {
        return res.status(404).json({
          message: "Note not found",
        });
      }
      if (error.message === "Forbidden") {
        return res.status(403).json({
          message: "Forbidden",
        });
       }



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
    const note = await toggleUsrNoteArchive(id, req.user._id);

    

    // Return response
    return res.status(200).json({
      message: note.archived
        ? "Note archived successfully"
        : "Note unarchived successfully",
      archived: note.archived,
    });


  } catch (error) {
    
    console.error("Toggle archive error:", error);
 
    if (error.message === "Note not found") {
      return res.status(404).json({
        message: "Note not found",
      });
    }
    if( error.message === "Forbidden") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

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
   
    const  sharedNote = await shareUserNote(id, req.user._id, share_with_email);

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


