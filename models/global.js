const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GlobalMessage = new Schema({
    username: String,
    message: String
});

module.exports = mongoose.model('GlobalMessage', GlobalMessage, 'globalmessages');