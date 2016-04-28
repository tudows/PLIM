var mongoose = require('../utils/mongooseUtil');
require('../models/province');

var Schema = mongoose.Schema;
var regionSchema = new Schema({
    nameEn: String,
    nameCn: String,
    pinyin: String,
    provinces: [{
        type: Schema.Types.ObjectId,
        ref: 'Province'
    }]
});

module.exports = mongoose.model('Region', regionSchema);