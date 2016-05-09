var mongoose = require('../utils/mongooseUtil');
require('../models/userType');

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
    lastDevice: String,
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'UserType'
    }]
});

module.exports = mongoose.model('User', userSchema);