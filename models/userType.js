var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var userTypeSchema = new Schema({
    nameCn: String,
    nameEn: String,
    code: Number
});

module.exports = mongoose.model('UserType', userTypeSchema);