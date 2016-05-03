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
    powerLineDAO.find(powerLine, function (err, powerLines) {
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
    powerLineDAO.find({ status: 1 }, function (err, powerLines) {
        if (!err) {
            powerLines.forEach(function (powerLine) {
                async.series([
                    function (_callback) {
                        if (data == null) {
                            if (powerLine.operationParameter.environment == null ||
                            powerLine.operationParameter.environment.length == 0 ||
                            powerLine.operationParameter.environment[0].updateDate == null ||
                            ((new Date()).getTime() - powerLine.operationParameter.environment[0].updateDate.getTime()) >= 1000 * 60 * 60) {
                                request.get('http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURI(powerLine.province.nameCn) + '&output=json&ak=hDMeBeFR3ccORh6CsKzOGIsc', function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        var weather = JSON.parse(body);
                                        if (weather.error == 0) {
                                            powerLine.operationParameter.environment = [];
                                            var weatherDate = new Date();
                                            weatherDate.setHours(0, 0, 0, 0);
                                            for (var i = 0; i < weather.results[0].weather_data.length; i++) {
                                                var _weather = weather.results[0].weather_data[i];
                                                var nowTemperature = null;
                                                if (i == 0) {
                                                    nowTemperature = _weather.date.substring(_weather.date.indexOf('：') + 1, _weather.date.indexOf('℃'));
                                                }
                                                var temperatures = _weather.temperature.substring(0, _weather.temperature.indexOf('℃')).split(' ~ ');
                                                var minTemperature = temperatures[1];
                                                var maxTemperature = temperatures[0];
                                                var minWindSpeed = null;
                                                var maxWindSpeed = null;
                                                var windDirection = _weather.wind.replace(/[微风]/ig, "");
                                                if (windDirection.indexOf('级') > -1) {
                                                    var windSpeeds = windDirection.replace(/[^0-9\-0-9]/ig, "").split('-');
                                                    windDirection = windDirection.replace(/[0-9\-0-9级]/ig, "");
                                                    if (windSpeeds.length > 1) {
                                                        minWindSpeed = windSpeeds[0];
                                                        maxWindSpeed = windSpeeds[1];
                                                    } else {
                                                        minWindSpeed = windSpeeds[0];
                                                        maxWindSpeed = windSpeeds[0];
                                                    }
                                                } else {
                                                    windSpeed = '0';
                                                    if (windDirection == '') {
                                                        windDirection = null;
                                                    }
                                                }
                                                var environment = {
                                                    minTemperature: minTemperature,
                                                    maxTemperature: maxTemperature,
                                                    nowTemperature: nowTemperature,
                                                    minWindSpeed: minWindSpeed,
                                                    maxWindSpeed: maxWindSpeed,
                                                    windDirection: windDirection,
                                                    weather: _weather.weather,
                                                    date: weatherDate,
                                                    dayPictureUrl: _weather.dayPictureUrl,
                                                    nightPictureUrl: _weather.nightPictureUrl,
                                                    updateDate: new Date()
                                                };
                                                powerLine.operationParameter.environment.push(environment);
                                                weatherDate.setDate(weatherDate.getDate() + 1);
                                            }
                                        }
                                    }
                                    _callback(null, null);
                                });
                            } else {
                                _callback(null, null);
                            }
                        }
                    }
                ], function (err, result) {
                    if (data == null) {
                        powerLine.operationParameter.volt = (Math.random() * 1000).toFixed(4);
                        powerLine.operationParameter.ampere = (Math.random() * 1000).toFixed(4);
                        powerLine.operationParameter.ohm = (Math.random() * 1000).toFixed(4);
                        powerLine.operationParameter.celsius = (Math.random() * 1000).toFixed(4);
                        powerLine.operationParameter.pullNewton = (Math.random() * 1000).toFixed(4);
                    } else {
                        powerLine.operationParameter = data;
                    }
                    powerLine.operationParameter.updateDate = new Date();
                    powerLineDAO.updateOperationParameter(powerLine.operationParameter, function (err) {
                        if (!err) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                });
            });
        } else {
            callback(false);
        }
    });
};