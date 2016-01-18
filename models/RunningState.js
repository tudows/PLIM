var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var runningStateSchema = new Schema({
    no: Number,
    nameCn: String,
    nameEn: String
});

module.exports = mongoose.model('RunningState', runningStateSchema);