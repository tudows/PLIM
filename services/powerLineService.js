/// <reference path="../typings/my/node&express.d.ts" />

var PowerLine = require('../models/powerLine');
var OperationParameter = require('../models/operationParameter');
var StandardOperationParameter = require('../models/standardOperationParameter');
var powerLineDAO = require('../dao/powerLineDAO');
var request = require('request');
var async = require("async");
var mongoose = require('mongoose');
var crypto = require('../utils/cryptoUtil');
var converter = require('../utils/converterUtil');

exports.add = function (data, callback) {
    var standardOperationParameterId = null;
    var operationParameterId = null;
    async.parallel([
        function (_callback) {
            var _operationParameter = new OperationParameter({
                healthy: null,
                volt: null,
                ampere: null,
                ohm: null,
                celsius: null,
                environment: [],
                pullNewton: null,
                updateDate: null
            });
            powerLineDAO.addOperationParameter(_operationParameter, function (_err) {
                operationParameterId = _operationParameter._id;
                _callback(_err, '');
            });
        },
        function (_callback) {
            var _standardOperationParameter = new StandardOperationParameter({
                minVolt: data.standardOperationParameter.minVolt,
                maxVolt: data.standardOperationParameter.maxVolt,
                minAmpere: data.standardOperationParameter.minAmpere,
                maxAmpere: data.standardOperationParameter.maxAmpere,
                minOhm: data.standardOperationParameter.minOhm,
                maxOhm: data.standardOperationParameter.maxOhm,
                minCelsius: data.standardOperationParameter.minCelsius,
                maxCelsius: data.standardOperationParameter.maxCelsius,
                minPullNewton: data.standardOperationParameter.minPullNewton,
                maxPullNewton: data.standardOperationParameter.maxPullNewton
            });
            powerLineDAO.addStandardOperationParameter(_standardOperationParameter, function (_err) {
                standardOperationParameterId = _standardOperationParameter._id;
                _callback(_err, '');
            });
        }
    ], function (_err, _results) {
        if (_results.length == 2 && _err == null) {
            var _powerLine = new PowerLine({
                no: data.no,
                modelNo: data.modelNo,
                voltageClass: mongoose.Types.ObjectId(data.voltageClass),
                serviceDate: new Date(),
                repairDay: data.repairDay,
                maintainDay: data.maintainDay,
                designYear: data.designYear,
                runningState: mongoose.Types.ObjectId(data.runningState),
                province: mongoose.Types.ObjectId(data.province),
                lastRepairDate: null,
                lastRepairNo: null,
                lastMaintainDate: null,
                lastMaintainNo: null,
                location: {
                    startLongitude: data.location.startLongitude,
                    startLatitude: data.location.startLatitude,
                    endLongitude: data.location.endLongitude,
                    endLatitude: data.location.endLatitude
                },
                encrypt: converter.base64ToUrl(crypto.rsaPublicEncrypt(data.no, 'base64')),
                status: 1,
                operationParameter: operationParameterId,
                standardOperationParameter: standardOperationParameterId
            });
            powerLineDAO.addPowerLine(_powerLine, function (err) {
                if (!err) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
        }
    });  
};

exports.list = function (powerLine, callback) {
    powerLineDAO.find({powerLine: powerLine}, function (err, powerLines) {
        if (!err) {
            callback(powerLines);
        } else {
            callback(null);
        }
    });
};

exports.remove = function (callback) {
    powerLineDAO.remove({}, function (err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.updateOperationParameter = function (data, callback) {
    powerLineDAO.updateOperationParameter({
        _id: data._id
    }, {
        $set: {
            volt: data.volt,
            ampere: data.ampere,
            ohm: data.ohm,
            celsius: data.celsius,
            pullNewton: data.pullNewton,
            updateDate: new Date()
        }
    }, function(err) {
        if (!err) {
            callback(true);
        } else {
            callback(false);
        }
    });
};