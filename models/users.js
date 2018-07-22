const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocaMongoose = require('passport-local-mongoose');

const User = new Schema({
    username: String,
    password: String
});

User.plugin(passportLocaMongoose);

module.exports = mongoose.model('User', User);