var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var provinceTypeSchema = new Schema({
    nameCn: String,
    nameEn: String
});

module.exports = mongoose.model('ProvinceType', provinceTypeSchema);