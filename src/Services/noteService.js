const Note = require("../models/Note");
const User = require("../models/User");

const mongoose = require("mongoose");



const createUserNote = async (title, content, userId) => {

    // Create note
    const note = await Note.create({
      title,
      content,
      owner: userId,   // this is the important line where we associate the note with the authenticated user
    });

    return note;
    
}

const getUserNotes = async (userId) => {
    return await Note.find({
    owner: userId,
    archived: false,
  }).sort({ created_at: -1 });
}

const getNotebyId = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { status: 404, message: "Invalid id" };
  }

  const note = await Note.findById(id);
  if (!note) {
    return { status: 404, message: "Note not found" };
  }

  const isOwner = note.owner.toString() === userId.toString();
  const isSharedWithUser = (note.sharedWith || []).some(
    (u) => u.toString() === userId.toString()
  );

  if (!isOwner && !isSharedWithUser) {
    return { status: 403, message: "Forbidden" };
  }

  return note;
};

const updateUserNote = async (noteId, userId, title, content) => {

  const note = await Note.findById(noteId);

  if (!note) return { status: 404, message: "Note not found" };
  
  if (note.owner.toString() !== userId.toString()) return { status: 403, message: "Forbidden" };

  note.title = title;
  note.content = content;
  await note.save();
  return note;
};

const deleteUserNote = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  if (!note) return { status: 404, message: "Note not found" };
  if (note.owner.toString() !== userId.toString()) return { status: 403, message: "Forbidden" };

  await note.deleteOne();
  return true;
};
const toggleUsrNoteArchive = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  if (!note) return { status: 404, message: "Note not found" };
  if (note.owner.toString() !== userId.toString()) return { status: 403, message: "Forbidden" };

  note.archived = !note.archived;
  await note.save();
  return note;
};

const shareNoteWithUser = async (noteId, ownerId, share_with_email) => {

  if (!share_with_email) return { status: 400, message: "share_with_email is required" };

  const note = await Note.findById(noteId);
  if (!note) return { status: 404, message: "Note not found" };
  if (note.owner.toString() !== ownerId.toString()) return { status: 403, message: "Forbidden" };

  const targetUser = await User.findOne({ email: share_with_email });

  if (!targetUser) return { status: 404, message: " Share user not found" };

  if (targetUser._id.toString() === ownerId.toString()) return { status: 400, message: "You cannot share a note with yourself" };

  const alreadyShared = (note.sharedWith).some(
    (userId) => userId.toString() === targetUser._id.toString()
  );

  if (alreadyShared) return note;

  note.sharedWith.push(targetUser._id);

  await note.save();

  return note;
  
};



module.exports = {
    createUserNote,
    getUserNotes,
    getNotebyId,
    updateUserNote,
    deleteUserNote,
    toggleUsrNoteArchive,
    shareNoteWithUser
} ;