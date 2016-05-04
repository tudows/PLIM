var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var maintainTypeSchema = new Schema({
});

module.exports = mongoose.model('MaintainType', maintainTypeSchema);