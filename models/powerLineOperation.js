var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var powerLineOperationSchema = new Schema({
});

module.exports = mongoose.model('PowerLineOperation', powerLineOperationSchema);