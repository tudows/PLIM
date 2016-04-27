var ProvinceType = require('../models/provinceType');
var Region = require('../models/region');
var RunningState = require('../models/runningState');
var VoltageClass = require('../models/voltageClass');
var VoltageClassUnit = require('../models/voltageClassUnit');

exports.find = function(model, data, callback) {
    var model = eval(model);
    model.find(data, function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findOne = function(model, data, callback) {
    var model = eval(model);
    model.findOne(data, function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findDbRef = function(model, data, populate, callback) {
    var model = eval(model);
    model.find(data).populate(populate).exec(function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findOneDbRef = function(model, data, populate, callback) {
    var model = eval(model);
    model.find(data).populate(populate).exec(function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};