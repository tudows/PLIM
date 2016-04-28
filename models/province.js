var mongoose = require('../utils/mongooseUtil');
require('../models/provinceType');

var Schema = mongoose.Schema;
var provinceSchema = new Schema({
    nameEn: String,
    nameCn: String,
    pinyin: String,
    abridge: String,
    abridgePinYin: String,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'ProvinceType'
    }
});

module.exports = mongoose.model('Province', provinceSchema);