var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var regionSchema = new Schema({
    no: String,
    nameEn: String,
    nameCn: String,
    pinyin: String
});

module.exports = mongoose.model('Region', regionSchema);