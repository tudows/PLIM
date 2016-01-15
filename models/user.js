var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);