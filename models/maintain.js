var mongoose = require('../utils/mongooseUtil');
require('../models/powerLine');
require('../models/user');
require('../models/maintainState');
require('../models/maintainType');

var Schema = mongoose.Schema;
var maintainSchema = new Schema({
    powerLine: {
        type: Schema.Types.ObjectId,
        ref: 'PowerLine'
    },
    maintainUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createDate: Date,
    updateUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updateDate: Date,
    maintainState: {
        type: Schema.Types.ObjectId,
        ref: 'MaintainState'
    },
    maintainType: {
        type: Schema.Types.ObjectId,
        ref: 'MaintainType'
    },
    maintainIllustration: String,
    maintainCompleteIllustration: String,
    status: Number,
    operationParameterSnapshot: Schema.Types.Mixed
});

module.exports = mongoose.model('Maintain', maintainSchema);