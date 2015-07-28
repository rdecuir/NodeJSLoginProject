var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    profileimage: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);