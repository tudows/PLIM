/// <reference path="../typings/my/node&express.d.ts" />

var PowerLine = require('../models/powerLine');
var OperationParameter = require('../models/operationParameter');
var StandardOperationParameter = require('../models/standardOperationParameter');
var powerLineDAO = require('../dao/powerLineDAO');
var maintainDAO = require('../dao/maintainDAO');
var request = require('request');
var async = require("async");
var mongoose = require('mongoose');
var crypto = require('../utils/cryptoUtil');
var converter = require('../utils/converterUtil');
var moment = require('moment');

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
        powerLineNo: data.powerLineNo
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

exports.maintainAnalyse = function (powerLineId, callback) {
    var attrs = ['volt', 'ampere', 'pullNewton', 'celsius' ];
    var result = {
        lineLabels: [],
        lineData: [[], [], [], []],
        doughnutData: []
    };
    
    async.parallel([
        function (_call1) {
            var nowDate = new Date();
            nowDate.setHours(0, 0, 0, 0);
            nowDate.setDate(nowDate.getDate() - 6);
            powerLineDAO.findHistoryOperationParameter({
                powerLine: mongoose.Types.ObjectId(powerLineId),
                updateDate: { $gt: nowDate }
            }, function (historyOperationParameters) {
                if (historyOperationParameters != null && historyOperationParameters.length > 0) {
                    var lastUpdateDate = moment(historyOperationParameters[0].updateDate).format('YYYY-MM-DD');
                    var _lineData = [];
                    var _sum = [0, 0, 0, 0];
                    var _number = 0;
                    historyOperationParameters.forEach(function (historyOperationParameter) {
                        var updateDate = moment(historyOperationParameter.updateDate).format('YYYY-MM-DD');
                        if (updateDate != lastUpdateDate) {
                            for (var i = 0; i < _sum.length; i++) {
                                _sum[i] = _sum[i] / _number;
                            }
                            result.lineLabels.push(lastUpdateDate);
                            _lineData.push(_sum);
                            lastUpdateDate = moment(historyOperationParameter.updateDate).format('YYYY-MM-DD');
                            _sum = [0, 0, 0, 0];
                            _number = 0;
                        }
                        for (var i = 0; i < attrs.length; i++) {
                            _sum[i] += parseFloat(historyOperationParameter[attrs[i]]);
                        }
                        _number++;
                    });
                    for (var i = 0; i < _sum.length; i++) {
                        _sum[i] = _sum[i] / _number;
                    }
                    result.lineLabels.push(lastUpdateDate);
                    _lineData.push(_sum);
                    
                    _lineData.forEach(function (ld) {
                        result.lineData[0].push(ld[0]);
                        result.lineData[1].push(ld[1]);
                        result.lineData[2].push(ld[2]);
                        result.lineData[3].push(ld[3]);
                    });
                    _call1(null);
                } else {
                    _call1(1);
                }
            });
        },
        function (_call1) {
            maintainDAO.findPowerLineMaintainNumber(mongoose.Types.ObjectId(powerLineId), function (maintains) {
                if (maintains != null) {
                    result.doughnutData = [0, 0, 0, 0, 0];
                    maintains.forEach(function (maintain) {
                        if (maintain._id.code < 6) {
                            result.doughnutData[maintain._id.code - 1] = maintain.maintainNumber;
                        }
                    });
                    _call1(null);
                } else {
                    _call1(1);
                }
            });
        }
    ], function (err) {
        if (!err) {
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.update = function (data, callback) {
    powerLineDAO.update({
        query: { _id: mongoose.Types.ObjectId(data.powerlineId) }
    }, {
        runningState: { code: data.runningStateCode }
    }, function (err, result) {
        if (!err) {
            powerLineDAO.find({
                powerLine: { _id: mongoose.Types.ObjectId(data.powerlineId) }
            }, function (err, powerLines) {
                if (!err) {
                    callback(powerLines[0]);
                } else {
                    callback(true);
                }
            });
        } else {
            callback(false);
        }
    });
}