var mongoose = require('../utils/mongooseUtil');
require('../models/provinceType');

var Schema = mongoose.Schema;
var regionSchema = new Schema({
    nameEn: String,
    nameCn: String,
    pinyin: String,
    provinces: [{
        _id: Schema.Types.ObjectId,
        nameEn: String,
        nameCn: String,
        pinyin: String,
        abridge: String,
        abridgePinYin: String,
        type: {
            type: Schema.Types.ObjectId,
            ref: 'ProvinceType'
        }
    }]
});

module.exports = mongoose.model('Region', regionSchema);