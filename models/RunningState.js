var mongoose = require('../utils/mongooseUtil');

var Schema = mongoose.Schema;
var runningStateSchema = new Schema({
    nameCn: String,
    nameEn: String
});
 
module.exports = mongoose.model('RunningState', runningStateSchema);