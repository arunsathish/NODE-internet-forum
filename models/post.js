var mongoose    = require("mongoose");

var postSchema  = new mongoose.Schema({
    title: String,
    content: String,
    categories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
    }],
    createdDate: { type: Date, default: Date.now },
    author: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    }],
    comment: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
    }],
    vote: Number,
    report: Boolean
});

module.exports  = mongoose.model("Post", postSchema);