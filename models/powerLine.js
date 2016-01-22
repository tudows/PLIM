var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var powerLineSchema = new Schema({
    no: String,
    modelNo: String,
    voltageClass: Number,
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
        startLongitude: String,
        startLatitude: String,
        endLongitude: String,
        endLatitude: String
    }
});

module.exports = mongoose.model('PowerLine', powerLineSchema);