const  mongoose = require("mongoose");

const noteSchema =  new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content :{
            type: String,
            required: true,
            trim: true,
        },
        owner :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sharedWith: [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
         },
        ],
        archived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("Note", noteSchema); // return the model to be used in other parts of the application (e.g., controllers)