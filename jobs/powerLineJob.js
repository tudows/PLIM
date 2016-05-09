/// <reference path="../typings/my/node&express.d.ts" />

var powerLineDAO = require('../dao/powerLineDAO');
var maintainDAO = require('../dao/maintainDAO');
var userDAO = require('../dao/userDAO');
var Maintain = require('../models/maintain');
var request = require('request');
var async = require('async');

exports.updateEnvironment = function (time, callback) {
    var func = function (_callback) {
        powerLineDAO.find({
            powerLine: {status: 1}
        }, function (err, powerLines) {
            if (!err) {
                powerLines.forEach(function (powerLine) {
                    if (powerLine.operationParameter.environment == null ||
                        powerLine.operationParameter.environment.length == 0 ||
                        powerLine.operationParameter.environment[0].updateDate == null ||
                        ((new Date()).getTime() - powerLine.operationParameter.environment[0].updateDate.getTime()) >= 1000 * 60 * 60) {
                        request.get('http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURI(powerLine.province.nameCn) + '&output=json&ak=hDMeBeFR3ccORh6CsKzOGIsc', function (error, response, body) {
                            if (!error && response.statusCode == 200 && JSON.parse(body).error == 0) {
                                var weather = JSON.parse(body);
                                var environments = [];
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
                                        date: new Date(weatherDate.setDate(weatherDate.getDate() + 1)),
                                        dayPictureUrl: _weather.dayPictureUrl,
                                        nightPictureUrl: _weather.nightPictureUrl,
                                        updateDate: new Date()
                                    };
                                    environments.push(environment);
                                }
                                
                                powerLineDAO.updateOperationParameter({
                                    _id: powerLine.operationParameter._id
                                }, {
                                    $set: {environment: environments}
                                }, function (err) {});
                            }
                        });
                    }
                });
                _callback(true);
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    setInterval(function () {
        func(callback);
    }, time);
};

exports.randomOperationParameter = function (time, callback) {
    var func = function (_callback) {
        powerLineDAO.find({
            powerLine: {status: 1}
        }, function(err, result) {
            if (!err) {
                result.forEach(function (powerLine) {
                    powerLineDAO.updateOperationParameter({
                        _id: powerLine.operationParameter._id
                    }, {
                        $set: {
                            volt: (Math.random() * 1000).toFixed(4),
                            ampere: (Math.random() * 1000).toFixed(4),
                            ohm: (Math.random() * 1000).toFixed(4),
                            celsius: (Math.random() * 1000).toFixed(4),
                            pullNewton: (Math.random() * 1000).toFixed(4),
                            updateDate: new Date()
                        }
                    }, function(err) {
                        if (!err) {
                            _callback(true);
                        } else {
                            _callback(false);
                        }
                    });
                });
                _callback(true);
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    setInterval(function () {
        func(callback);
    }, time);
};

exports.maintainAnalyze = function (time, callback) {
    var func = function (_callback) {
        powerLineDAO.find({
            powerLine: { status: 1 }
        }, function (err, powerLines) {
            if (!err) {
                powerLines.forEach(function (powerLine) {
                    maintainDAO.find({
                        maintainState: { code: { $ne: 4 } },
                        maintain: { powerLine: powerLine._id }
                    }, function(err, maintains) {
                        if (!err && maintains.length == 0) {
                            var maintainTypeCode = null;
                            if (powerLine.operationParameter.pullNewton <= 0) {
                                maintainTypeCode = 1;
                            } else if (powerLine.operationParameter.ampere <= 100 && powerLine.operationParameter.volt < 0) {
                                maintainTypeCode = 1;
                            } else if (powerLine.operationParameter.ampere < 0 && powerLine.operationParameter.volt < 100) {
                                maintainTypeCode = 2;
                            } else if (powerLine.operationParameter.pullNewton > powerLine.standardOperationParameter.maxPullNewton) {
                                var pullNewtonDiffUp = powerLine.operationParameter.pullNewton - powerLine.standardOperationParameter.minPullNewton;
                                var pullNewtonDiffDown = powerLine.standardOperationParameter.maxPullNewton - powerLine.standardOperationParameter.minPullNewton;
                                if (parseInt(pullNewtonDiffUp / pullNewtonDiffDown * 100) > 300) {
                                    maintainTypeCode = 4;
                                }
                            } else if (powerLine.operationParameter.ampere > powerLine.standardOperationParameter.maxAmpere) {
                                var ampereDiffUp = powerLine.operationParameter.ampere - powerLine.standardOperationParameter.minAmpere;
                                var ampereDiffDown = powerLine.standardOperationParameter.maxAmpere - powerLine.standardOperationParameter.minAmpere;
                                if (parseInt(ampereDiffUp / ampereDiffDown * 100) > 500) {
                                    maintainTypeCode = 3;
                                }
                            } else if (powerLine.operationParameter.volt > powerLine.standardOperationParameter.maxVolt) {
                                var voltDiffUp = powerLine.operationParameter.volt - powerLine.standardOperationParameter.minVolt;
                                var voltDiffDown = powerLine.standardOperationParameter.maxVolt - powerLine.standardOperationParameter.minVolt;
                                if (parseInt(voltDiffUp / voltDiffDown * 100) > 500) {
                                    maintainTypeCode = 4;
                                }
                            } else if (powerLine.operationParameter.celsius > powerLine.standardOperationParameter.maxCelsius) {
                                var celsiusDiffUp = powerLine.operationParameter.celsius - powerLine.standardOperationParameter.minCelsius;
                                var celsiusDiffDown = powerLine.standardOperationParameter.maxCelsius - powerLine.standardOperationParameter.minCelsius;
                                if (parseInt(celsiusDiffUp / celsiusDiffDown * 100) > 120) {
                                    maintainTypeCode = 5;
                                }
                            } else {
                                var nowDate = new Date();
                                
                                var serviceYearDiff = (nowDate.getFullYear() - powerLine.serviceDate.getFullYear()) - powerLine.designYear;
                                var repairDay = powerLine.repairDay;
                                var maintainDay = powerLine.maintainDay;
                                if (serviceYearDiff > 0) {
                                    repairDay -= serviceYearDiff;
                                    maintainDay -= serviceYearDiff;
                                    if (repairDay < powerLine.repairDay / 2) {
                                        repairDay = powerLine.repairDay / 2
                                    }
                                    if (maintainDay < powerLine.maintainDay / 2) {
                                        maintainDay = powerLine.maintainDay / 2
                                    }
                                }
                                
                                var repairDatyDiff = null;
                                var maintainDayDiff = null;
                                if (powerLine.lastRepairDate != null) {
                                    repairDatyDiff = (nowDate.getTime() - powerLine.lastRepairDate.getTime()) / (1000 * 60 * 60 * 24) - repairDay;
                                } else {
                                    repairDatyDiff = (nowDate.getTime() - powerLine.serviceDate.getTime()) / (1000 * 60 * 60 * 24) - repairDay;
                                }
                                if (powerLine.lastMaintainDate != null) {
                                    maintainDayDiff = (nowDate.getTime() - powerLine.lastMaintainDate.getTime()) / (1000 * 60 * 60 * 24) - maintainDay;
                                } else {
                                    maintainDayDiff = (nowDate.getTime() - powerLine.serviceDate.getTime()) / (1000 * 60 * 60 * 24) - maintainDay;
                                }
                                
                                if (repairDatyDiff > 0) {
                                    maintainTypeCode = 7;
                                } else if (maintainDayDiff > 0) {
                                    maintainTypeCode = 6;
                                }
                            }
                            
                            if (maintainTypeCode != null) {
                                maintainDAO.findMaintainType({ code: maintainTypeCode }, function (err, maintainTypes) {
                                    if (!err && maintainTypes.length > 0) {
                                        var maintainType = maintainTypes[0];
                                        var i = 0;
                                        async.whilst(function () {
                                            return i < maintainType.powerLineOperation.length;
                                        }, function (_callback) {
                                            maintainDAO.operationPowerLine({
                                                _id: powerLine._id,
                                                code: maintainType.powerLineOperation[i].code,
                                                maintainTypeCode: maintainTypeCode
                                            }, function (err, result) {
                                                i++;
                                                _callback(err, i);
                                            });
                                        }, function (err, n) { });
                                        maintainDAO.findMaintainState({ code: 1 }, function(err, maintainStates) {
                                            if (!err && maintainStates.length > 0) {
                                                var maintainIllustration = "";
                                                for (var j = 0; j < maintainType.powerLineOperation.length; j++) {
                                                    maintainIllustration += (j + 1) + ". " + maintainType.powerLineOperation[j].nameCn + "<br/>";
                                                }
                                                var _maintain = new Maintain({
                                                    powerLine: powerLine._id,
                                                    maintainUser: null,
                                                    createUser: null,
                                                    createDate: new Date(),
                                                    updateUser: null,
                                                    updateDate: null,
                                                    maintainState: maintainStates[0]._id,
                                                    maintainType: maintainType._id,
                                                    maintainIllustration: maintainIllustration.substring(0, maintainIllustration.length - 5),
                                                    maintainCompleteIllustration: null,
                                                    status: 1,
                                                    operationParameterSnapshot: {
                                                        volt: powerLine.operationParameter.volt,
                                                        ampere: powerLine.operationParameter.ampere,
                                                        ohm: powerLine.operationParameter.ohm,
                                                        celsius: powerLine.operationParameter.celsius,
                                                        pullNewton: powerLine.operationParameter.pullNewton
                                                    }
                                                });
                                                maintainDAO.add(_maintain, function(err) { });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                    _callback(true);
                });
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    setInterval(function () {
        func(callback);
    }, time);
};

exports.maintainArrange = function (time, callback) {
    var func = function (_callback) {
        maintainDAO.find({
            maintainState: { code: 1 }
        }, function (err, maintains) {
            if (!err) {
                var count = 0;
                async.whilst(
                    function () {
                        return count < maintains.length;
                    },
                    function (_call1) {
                        var maintain = maintains[count];
                        async.series([
                            function (_call2) {
                                userDAO.find({
                                    type: { code: 2 }
                                }, function (err, _users) {
                                    var users = [];
                                    if (!err) {
                                        _users.forEach(function (user) {
                                            if (user.type.length > 0 && ((new Date()).getTime() - user.lastLoginDate.getTime()) <= 1000 * 60 * 60 * 24) {
                                                var logDiff = maintain.powerLine.location.startLongitude - user.lastLocation.longitude;
                                                var latDiff = maintain.powerLine.location.startLatitude - user.lastLocation.latitude;
                                                user.distance = Math.sqrt(logDiff * logDiff + latDiff * latDiff);
                                                users.push(user);
                                            }
                                        });
                                    }
                                    _call2(null, users);
                                });
                            }
                        ], function (err, result) {
                            var users = result[0];
                            if (users.length > 0) {
                                users.sort(function (a, b) {
                                    return a.distance > b.distance;
                                });
                                users.forEach(function (user) {
                                    // 寻找user的正在做的维修机了
                                    // 如果不超过5个就安排给他。
                                    // 如果大家都很忙，就安排任务相对少的的但是比较近的那个
                                    maintainDAO.find({
                                        maintain: {
                                            maintainUser: user._id
                                        }
                                    }, function (err, _maintains) {
                                        if (!err) {
                                        
                                        }
                                    });
                                });
                                count++;
                                _call1(null, count);
                            } else {
                                count++;
                                _call1(null, count);
                            }
                        });
                    },
                    function (err, n) {
                        if (n == maintains.length) {
                            
                        }
                    }
                );
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    setInterval(function () {
        func(callback);
    }, time);
};