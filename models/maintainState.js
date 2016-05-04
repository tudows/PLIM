var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var maintainStateSchema = new Schema({
    nameCn: String,
    nameEn: String,
    code: Number
});

module.exports = mongoose.model('MaintainState', maintainStateSchema);