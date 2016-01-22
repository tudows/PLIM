var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var voltageClassSchema = new Schema({
    no: Number,
    voltage: Number,
    unit: Number
});

module.exports = mongoose.model('VoltageClass', voltageClassSchema);