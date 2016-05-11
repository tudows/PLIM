var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var historyOperationParameterSchema = new Schema({
    healthy: String,
    volt: String,
    ampere: String,
    ohm: String,
    celsius: String,
    pullNewton: String,
    updateDate: Date,
    powerLine: {
        type: Schema.Types.ObjectId,
        ref: 'PowerLine'
    }
});

module.exports = mongoose.model('HistoryOperationParameter', historyOperationParameterSchema);