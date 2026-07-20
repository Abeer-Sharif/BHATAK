const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    //passport-local-mongoose automatically defines the username and password. password is also hashed and salted
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);