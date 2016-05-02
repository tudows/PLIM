var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var standardOperationParameterSchema = new Schema({
    minVolt: String,
    maxVolt: String,
    minAmpere: String,
    maxAmpere: String,
    minOhm: String,
    maxOhm: String,
    minCelsius: String,
    maxCelsius: String,
    minPullNewton: String,
    maxPullNewton: String
});

module.exports = mongoose.model('StandardOperationParameter', standardOperationParameterSchema);