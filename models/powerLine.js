var mongoose = require('../utils/mongooseUtil');
require('../models/runningState');
require('../models/region');
require('../models/voltageClass');
require('../models/operationParameter');

var Schema = mongoose.Schema;
var powerLineSchema = new Schema({
    no: String,
    modelNo: String,
    voltageClass: {
        type: Schema.Types.ObjectId,
        ref: 'VoltageClass'
    },
    serviceDate: Date,
    repairDay: Number,
    maintainDay: Number,
    designYear: Number,
    runningState: {
        type: Schema.Types.ObjectId,
        ref: 'RunningState'
    },
    province:  {
        type: Schema.Types.ObjectId,
        ref: 'Province'
    },
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
    status: Number,
    operationParameter: {
        type: Schema.Types.ObjectId,
        ref: 'OperationParameter'
    }
});

module.exports = mongoose.model('PowerLine', powerLineSchema);