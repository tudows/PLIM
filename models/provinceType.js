var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var provinceTypeSchema = new Schema({
    no: Number,
    nameCn: String,
    nameEn: String
});

module.exports = mongoose.model('ProvinceType', provinceTypeSchema);