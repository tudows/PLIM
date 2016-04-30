/// <reference path="../typings/my/node&express.d.ts" />

var PowerLine = require('../models/powerLine');
var VoltageClassUnit = require('../models/voltageClassUnit');
var OperationParameter = require('../models/operationParameter');

exports.find = function(data, callback) {
    PowerLine.find(data).populate("operationParameter").populate("voltageClass").populate("runningState").populate("province").exec(function(err, powerLines) {
        if(!err) {
            VoltageClassUnit.populate(powerLines, { "path": "voltageClass.unit" }, function (_err, _result) {
                if (!_err) {
                    callback(null, _result);
                } else {
                    callback(_err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

exports.add = function(data, callback) {
    var operationParameter = new OperationParameter({
        volt: null,
        ampere: null,
        ohm: null,
        celsius: null,
        weather: null,
        pullNewton: null
    });
    operationParameter.save(function(err, powerLine) {});
    
    data.operationParameter = operationParameter._id;
    data.save(function(err, powerLine) {
        if(!err) {
            callback(null, powerLine);
        } else {
            callback(err, null);
        }
    });
};

exports.remove = function(data, callback) {
    PowerLine.remove(data, function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
    OperationParameter.remove(data, function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.updateOperationParameter = function(data, callback) {
    OperationParameter.update({_id: data.id}, {$set: {
        volt: data.volt,
        ampere: data.ampere,
        ohm: data.ohm,
        celsius: data.celsius,
        weather: data.weather,
        pullNewton: data.pullNewton
    }}, function (err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};