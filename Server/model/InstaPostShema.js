const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const InstaPostShema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    likes: [{
        type: String,
    }, ],

    comments: [{
        comments: { type: String },
        postedbyId: { type: String },
        postedby: { type: String },
    }, ],

    postedby: {
        type: String,
        required: true,
    },
    postedbyId: {
        type: String,
        required: true,
    },
});

const Posts = mongoose.model("POSTS", InstaPostShema);
module.exports = Posts;