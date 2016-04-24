var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    no: String,
    uuid: String,
    name: String,
    lastLoginDate: Date,
    lastLocation: {
        startLongitude: String,
        startLatitude: String,
        endLongitude: String,
        endLatitude: String
    },
    status: Number
});

module.exports = mongoose.model('User', userSchema);