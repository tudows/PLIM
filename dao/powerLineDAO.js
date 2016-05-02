/// <reference path="../typings/my/node&express.d.ts" />

var PowerLine = require('../models/powerLine');
var VoltageClassUnit = require('../models/voltageClassUnit');

exports.find = function(data, callback) {
    PowerLine.find(data).populate("standardOperationParameter").populate("operationParameter").populate("voltageClass").populate("runningState").populate("province").exec(function(err, powerLines) {
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

exports.addPowerLine = function(data, callback) {
    data.save(function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.addStandardOperationParameter = function(data, callback) {
    data.save(function(err, result) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.addOperationParameter = function(data, callback) {
    data.save(function(err, result) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
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
        environment: data.environment,
        pullNewton: data.pullNewton,
        updateDate: data.updateDate
    }}, function (err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};