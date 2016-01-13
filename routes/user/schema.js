var mongoose = require('../db.js');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    Name:String
});
module.exports = mongoose.model('User', userSchema);