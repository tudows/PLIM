var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var provinceSchema = new Schema({
    no: String,
    nameEn: String,
    nameCn: String,
    pinyin: String,
    type: Number,
    regionNo: String
});

module.exports = mongoose.model('Province', provinceSchema);