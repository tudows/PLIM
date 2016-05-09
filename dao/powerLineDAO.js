/// <reference path="../typings/my/node&express.d.ts" />

var PowerLine = require('../models/powerLine');
var VoltageClassUnit = require('../models/voltageClassUnit');
var OperationParameter = require('../models/operationParameter');
var StandardOperationParameter = require('../models/standardOperationParameter');

exports.find = function(data, callback) {
    PowerLine.find(data.powerLine == null ? {} : data.powerLine).populate({
        path: "standardOperationParameter",
        match: data.standardOperationParameter == null ? {} : data.standardOperationParameter
    }).populate({
        path: "operationParameter",
        match: data.operationParameter == null ? {} : data.operationParameter
    }).populate({
        path: "voltageClass",
        match: data.voltageClass == null ? {} : data.voltageClass
    }).populate({
        path: "runningState",
        match: data.runningState == null ? {} : data.runningState
    }).populate({
        path: "province",
        match: data.province == null ? {} : data.province
    }).exec(function(err, powerLines) {
        if(!err) {
            VoltageClassUnit.populate(powerLines, {
                path: "voltageClass.unit",
                match: data.voltageClassUnit == null ? {} : data.voltageClassUnit
            }, function (_err, _result) {
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

exports.updateOperationParameter = function(query, set, callback) {
     OperationParameter.update(query, set, function (err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};