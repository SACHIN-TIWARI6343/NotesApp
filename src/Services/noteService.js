const Note = require("../models/Note");

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

const getNotebyId = async ( id ) => {

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
    
    
    return note;
}

const updateUserNote = async (noteId, userId, title, content) => {
  // Implementation for updating a note
    const note =  await Note.findById(noteId);

    // note not found 
    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Authorization check
    if (note.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    // Update note
    note.title = title;
    note.content = content;

    await note.save();

    return note;
};

const deleteUserNote =  async (noteId, userId) => {
    
    // Find note
        const note = await Note.findById(noteId);
    
        // Note not found
        if (!note) {
          return res.status(404).json({
            message: "Note not found",
           });
        }
    
        // Authorization check
        if (note.owner.toString() !== userId.toString()) {
          return res.status(403).json({
            message: "Forbidden",
          });
        }
    
        // Delete note
        await note.deleteOne();

}
const toggleUsrNoteArchive = async (noteId, userId) => {

    const note = await Note.findById(noteId);
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

    return note;

}

const  shareNoteWithUser = async (noteId, ownerId, share_with_email) => 
    {
        
            // 2. Validate request body
            if (!share_with_email) {
              return res.status(400).json({
                message: "share_with_email is required",
              });
            }
        
            // 3. Find note
            const note = await Note.findById(noteId);
        
            if (!note) {
              return res.status(404).json({
                message: "Note not found",
              });
            }
        
            // 4. Only owner can share
            if (note.owner.toString() !== ownerId.toString()) {
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
            if (targetUser._id.toString() === ownerId.toString()) {
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

            return note;
        
    }


module.exports = {
    createUserNote,
    getUserNotes,
    getNotebyId,
    updateUserNote,
    deleteUserNote,
    toggleUsrNoteArchive,
    shareNoteWithUser
}  ;