var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var operationParameterSchema = new Schema({
    healthy: String,
    volt: String,
    ampere: String,
    ohm: String,
    celsius: String,
    environment: [{
        minTemperature: String,
        maxTemperature: String,
        nowTemperature: String,
        minWindSpeed: String,
        maxWindSpeed: String,
        windDirection: String,
        weather: String,
        date: Date,
        dayPictureUrl: String,
        nightPictureUrl: String,
        updateDate: Date
    }],
    pullNewton: String,
    updateDate: Date
});

module.exports = mongoose.model('OperationParameter', operationParameterSchema);