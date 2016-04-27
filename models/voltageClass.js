var mongoose = require('../utils/mongooseUtil');
require('../models/voltageClassUnit');

var Schema = mongoose.Schema;
var voltageClassSchema = new Schema({
    voltage: Number,
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'VoltageClassUnit'
    }
});

module.exports = mongoose.model('VoltageClass', voltageClassSchema);