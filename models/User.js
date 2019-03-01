let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    login : String,
    password : String
});

module.exports = mongoose.model('User', UserSchema);