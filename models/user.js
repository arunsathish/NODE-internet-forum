var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose")

var userSchema  = new mongoose.Schema({
    username: String,
    password: String,
    gender: String,
    DOR: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);