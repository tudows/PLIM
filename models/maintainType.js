var mongoose = require('../utils/mongooseUtil');
require('../models/powerLineOperation');

var Schema = mongoose.Schema;
var maintainTypeSchema = new Schema({
    nameCn: String,
    nameEn: String,
    code: Number,
    powerLineOperation: [{
        type: Schema.Types.ObjectId,
        ref: 'PowerLineOperation'
    }],
    level: Number
});

module.exports = mongoose.model('MaintainType', maintainTypeSchema);