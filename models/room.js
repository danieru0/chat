const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
    name: String,
    author: String,
    messages: [{
        username: String,
        message: String
    }]
});

module.exports = mongoose.model('Room', Room, 'rooms');