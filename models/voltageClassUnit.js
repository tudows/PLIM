var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var voltageClassUnitSchema = new Schema({
    no: Number,
    unitEn: String,
    unitCn: String
});

module.exports = mongoose.model('VoltageClassUnit', voltageClassUnitSchema);