var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    no: String,
    uuid: Array,
    name: String,
    status: Number,
    salt: String,
    lastLoginDate: Date,
    lastLocation: {
        longitude: String,
        latitude: String
    },
    lastDevice: String
});

module.exports = mongoose.model('User', userSchema);