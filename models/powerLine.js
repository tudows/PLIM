var mongoose = require('../utils/mongooseUtil');
require('../models/runningState');

var Schema = mongoose.Schema;
var powerLineSchema = new Schema({
    no: String,
    modelNo: String,
    voltageClass: Number,
    serviceDate: Date,
    repairDay: Number,
    maintainDay: Number,
    designYear: Number,
    runningState: {
        type: Schema.Types.ObjectId,
        ref: 'RunningState'
    },
    provinceNo: String,
    lastRepairDate: Date,
    lastRepairNo: String,
    lastMaintainDate: Date,
    lastMaintainNo: String,
    location: {
        startLongitude: String,
        startLatitude: String,
        endLongitude: String,
        endLatitude: String
    },
    encrypt: String,
    status: Number
});

module.exports = mongoose.model('PowerLine', powerLineSchema);