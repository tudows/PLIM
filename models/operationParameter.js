var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var operationParameterSchema = new Schema({
    volt: String,
    ampere: String,
    ohm: String,
    celsius: String,
    weather: Schema.Types.Mixed,
    pullNewton: String
});

module.exports = mongoose.model('OperationParameter', operationParameterSchema);