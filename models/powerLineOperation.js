var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var powerLineOperationSchema = new Schema({
    nameCn: String,
    nameEn: String,
    code: Number
});

module.exports = mongoose.model('PowerLineOperation', powerLineOperationSchema);