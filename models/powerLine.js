var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var powerLineSchema = new Schema({
    no: String,
    modelNo: String,
    voltageClass: String,
    serviceDate: Date,
    repairDay: Number,
    maintainDay: Number,
    designYear: Number,
    runningState: Number,
    provinceNo: String,
    lastRepairDate: Date,
    lastRepairNo: String,
    lastMaintainDate: Date,
    lastMaintainNo: String,
    location: {
        startLongitude: Number,
        startDimension: Number,
        endLongitude: Number,
        endDimension: Number
    }
});

module.exports = mongoose.model('PowerLine', powerLineSchema);