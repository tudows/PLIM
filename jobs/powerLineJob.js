/// <reference path="../typings/my/node&express.d.ts" />

var powerLineDAO = require('../dao/powerLineDAO');
var maintainDAO = require('../dao/maintainDAO');
var userDAO = require('../dao/userDAO');
var Maintain = require('../models/maintain');
var request = require('request');
var async = require('async');
var mongoose = require('mongoose');

exports.updateEnvironment = function (callback) {
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
                        request.get('http://api.map.baidu.com/telematics/v3/weather?location=' + encodeURI(powerLine.province.nameCn) + '&output=json&ak=xxxIsc', function (error, response, body) {
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
                                        dayPictureUrl: _weather.dayPictureUrl.replace('http://', 'https://'),
                                        nightPictureUrl: _weather.nightPictureUrl.replace('http://', 'https://'),
                                        updateDate: new Date()
                                    };
                                    environments.push(environment);
                                }
                                
                                powerLineDAO.updateOperationParameter({
                                    powerLineNo: powerLine.no
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
    // setInterval(function () {
    //     func(callback);
    // }, time);
};

exports.randomOperationParameter = function (data, callback) {
    if (data.multiple == null) {
        data.multiple = 1;
    }
    if (data.powerNo == null) {
        data.powerNo = {status: 1};
    } else {
        data.powerNo = { no: data.powerNo, status: 1 };
    }
    var func = function (_callback) {
        powerLineDAO.find({
            powerLine: data.powerNo
        }, function(err, result) {
            if (!err) {
                result.forEach(function (powerLine) {
                    powerLineDAO.updateOperationParameter({
                        powerLineNo: powerLine.no
                    }, {
                        $set: {
                            volt: ((Math.random() * 100).toFixed(4) + 300) * data.multiple,
                            ampere: ((Math.random() * 100).toFixed(4) + 300) * data.multiple,
                            ohm: ((Math.random() * 50).toFixed(4) + 100) * data.multiple,
                            celsius: (Math.random() * 100).toFixed(4) * data.multiple,
                            pullNewton: (Math.random() * 40).toFixed(4) * data.multiple,
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
    // setInterval(function () {
    //     func(callback);
    // }, time);
};

exports.maintainAnalyze = function (callback) {
    var func = function (_callback) {
        powerLineDAO.find({
            powerLine: { status: 1 },
            runningState: { code: 5 }
        }, function (err, powerLines) {
            if (!err) {
                var powerLineCount = 0;
                async.whilst(
                    function () { return powerLineCount < powerLines.length },
                    function (_call6) {
                        var powerLine = powerLines[powerLineCount];
                        var start = new Date();
                        start.setMinutes(start.getMinutes() - 30);
                        maintainDAO.find({
                            maintain: { $and: [
                                { powerLine: powerLine._id },
                                { $or: [
                                    { maintainState: { $ne: mongoose.Types.ObjectId('573035613982d8481f73dca5') } },
                                    { updateDate: { $gte: start } }
                                ] }
                            ] }
                        }, function(err, maintains) {
                            if (!err && maintains.length == 0) {
                                var maintainTypeCode = null;
                                var avgOperationParameter = null;
                                var start = new Date();
                                start.setMinutes(start.getMinutes() - 30);
                                var attrs = ['volt', 'ampere', 'pullNewton', 'celsius', 'ohm' ];
                                powerLineDAO.findHistoryOperationParameter({
                                    powerLine: powerLine._id,
                                    updateDate: {$gte: start}
                                }, function (historyOperationParameters) {
                                    if (historyOperationParameters != null && historyOperationParameters.length > 0) {
                                        var _sum = [0, 0, 0, 0];
                                        var _number = 0;
                                        historyOperationParameters.forEach(function (historyOperationParameter) {
                                            for (var i = 0; i < attrs.length; i++) {
                                                _sum[i] += parseFloat(historyOperationParameter[attrs[i]]);
                                            }
                                            _number++;
                                        });
                                        for (var i = 0; i < _sum.length; i++) {
                                            _sum[i] = _sum[i] / _number;
                                        }
                                        avgOperationParameter = {
                                            volt: _sum[0],
                                            ampere: _sum[1],
                                            pullNewton: _sum[2],
                                            celsius: _sum[3],
                                            ohm: _sum[4]
                                        };
                                        
                                        if (avgOperationParameter.pullNewton <= 0) {
                                            maintainTypeCode = 1;
                                        } else if (avgOperationParameter.ampere <= 100 && avgOperationParameter.volt < 0) {
                                            maintainTypeCode = 1;
                                        } else if (avgOperationParameter.ampere < 0 && avgOperationParameter.volt < 100) {
                                            maintainTypeCode = 2;
                                        } else if (avgOperationParameter.pullNewton > powerLine.standardOperationParameter.maxPullNewton) {
                                            var pullNewtonDiffUp = avgOperationParameter.pullNewton - powerLine.standardOperationParameter.minPullNewton;
                                            var pullNewtonDiffDown = powerLine.standardOperationParameter.maxPullNewton - powerLine.standardOperationParameter.minPullNewton;
                                            if (parseInt(pullNewtonDiffUp / pullNewtonDiffDown * 100) > 300) {
                                                maintainTypeCode = 4;
                                            }
                                        } else if (avgOperationParameter.ampere > powerLine.standardOperationParameter.maxAmpere) {
                                            var ampereDiffUp = avgOperationParameter.ampere - powerLine.standardOperationParameter.minAmpere;
                                            var ampereDiffDown = powerLine.standardOperationParameter.maxAmpere - powerLine.standardOperationParameter.minAmpere;
                                            if (parseInt(ampereDiffUp / ampereDiffDown * 100) > 500) {
                                                maintainTypeCode = 3;
                                            }
                                        } else if (avgOperationParameter.volt > powerLine.standardOperationParameter.maxVolt) {
                                            var voltDiffUp = avgOperationParameter.volt - powerLine.standardOperationParameter.minVolt;
                                            var voltDiffDown = powerLine.standardOperationParameter.maxVolt - powerLine.standardOperationParameter.minVolt;
                                            if (parseInt(voltDiffUp / voltDiffDown * 100) > 500) {
                                                maintainTypeCode = 4;
                                            }
                                        } else if (avgOperationParameter.celsius > powerLine.standardOperationParameter.maxCelsius) {
                                            var celsiusDiffUp = avgOperationParameter.celsius - powerLine.standardOperationParameter.minCelsius;
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
                                                    }, function (_call1) {
                                                        maintainDAO.operationPowerLine({
                                                            _id: powerLine._id,
                                                            code: maintainType.powerLineOperation[i].code,
                                                            maintainTypeCode: maintainTypeCode
                                                        }, function (err, result) {
                                                            i++;
                                                            _call1(err, i);
                                                        });
                                                    }, function (err, n) { });
                                                    maintainDAO.findMaintainState({ code: 1 }, function(err, maintainStates) {
                                                        if (!err && maintainStates.length > 0) {
                                                            var maintainIllustration = "";
                                                            for (var j = 0; j < maintainType.powerLineOperation.length; j++) {
                                                                maintainIllustration += (j + 1) + ". " + maintainType.powerLineOperation[j].nameCn + "\n";
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
                                                                maintainIllustration: maintainIllustration,
                                                                maintainCompleteIllustration: null,
                                                                maintainSuggestion: null,
                                                                status: 1,
                                                                operationParameterSnapshot: {
                                                                    volt: avgOperationParameter.volt,
                                                                    ampere: avgOperationParameter.ampere,
                                                                    ohm: avgOperationParameter.ohm,
                                                                    celsius: avgOperationParameter.celsius,
                                                                    pullNewton: avgOperationParameter.pullNewton
                                                                }
                                                            });
                                                            maintainDAO.add(_maintain, function(err) {
                                                                _call6(err, ++powerLineCount);
                                                            });
                                                        } else {
                                                            _call6(err, ++powerLineCount);
                                                        }
                                                    });
                                                } else {
                                                    _call6(err, ++powerLineCount);
                                                }
                                            });
                                        } else {
                                            _call6(err, ++powerLineCount);
                                        }
                                    } else {
                                        _call6(err, ++powerLineCount);
                                    }
                                });
                            } else {
                                _call6(err, ++powerLineCount);
                            }
                        });
                    },
                    function (err, n) {
                        _callback(true);
                    }
                );
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    // setInterval(function () {
    //     func(callback);
    // }, time);
};

exports.maintainArrange = function (callback) {
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
                                        var i = 0;
                                        async.whilst(
                                            function () { return i < _users.length },
                                            function (_call4) {
                                                var user = _users[i];
                                                if (((new Date()).getTime() - user.lastLoginDate.getTime()) <= 1000 * 60 * 60 * 24 * 30) {
                                                    var logDiff = maintain.powerLine.location.startLongitude - user.lastLocation.longitude;
                                                    var latDiff = maintain.powerLine.location.startLatitude - user.lastLocation.latitude;
                                                    user.distance = logDiff * logDiff + latDiff * latDiff;
                                                    maintainDAO.findUserMaintainNumber(user._id, function (err, number) {
                                                        user.maintainNumber = number;
                                                        users.push(user);
                                                        i++;
                                                        _call4(null, i);
                                                    });
                                                } else {
                                                    i++;
                                                    _call4(null, i);
                                                }
                                            },
                                            function (err, n) {
                                                if (n == _users.length) {
                                                    _call2(null, users);
                                                }
                                            }
                                        );
                                    } else {
                                        _call2(null, users);
                                    }
                                });
                            }
                        ], function (err, result) {
                            var users = result[0];
                            if (users.length > 0) {
                                users.sort(function (a, b) {
                                    var aRate = a.distance * 0.7 + a.maintainNumber * 0.3;
                                    var bRate = b.distance * 0.7 + b.maintainNumber * 0.3;
                                    return aRate > bRate;
                                });
                                var userId = null;
                                for (var i = 0; i < users.length; i++) {
                                    if (users[i].maintainNumber < 5) {
                                        userId = users[0]._id;
                                        break;
                                    }
                                }
                                if (userId == null) {
                                    users.sort(function (a, b) {
                                        return a.maintainNumber > b.maintainNumber;
                                    });
                                    userId = users[0]._id;
                                }
                                async.series([
                                    function (_call7) {
                                        maintainDAO.update({
                                            query: {
                                                _id: maintain._id
                                            },
                                            set: {
                                                $set: { maintainUser: userId }
                                            }
                                        }, {
                                            maintainState: { code: 2 }
                                        }, function (err, result) {
                                            _call7(null);
                                        });
                                    },
                                    function (_call7) {
                                        var runningStateCode = null;
                                        if (maintain.maintainType.code == 6) {
                                            runningStateCode = 4
                                        } else {
                                            runningStateCode = 3
                                        }
                                        powerLineDAO.update({
                                            query: { _id: maintain.powerLine._id }
                                        }, {
                                            runningState: { code: runningStateCode }
                                        }, function (err, result) {
                                            _call7(null);
                                        });
                                    }
                                ], function (err) {
                                    count++;
                                    _call1(null, count);
                                });
                            } else {
                                count++;
                                _call1(null, count);
                            }
                        });
                    },
                    function (err, n) {
                        _callback(true);
                    }
                );
            } else {
                _callback(false);
            }
        });
    };
    
    func(callback);
    // setInterval(function () {
    //     func(callback);
    // }, time);
};

var runSwitch = true;
var intervals = [];
exports.run = function () {
    runSwitch = true;
    async.whilst(
        function () { return runSwitch; },
        function (callback1) {
            async.parallel([
                function (callback2) {
                    exports.maintainAnalyze(function (result) {
                        callback2(null);
                    });
                },
                function (callback2) {
                    exports.maintainArrange(function (result) {
                        callback2(null);
                    });
                }
            ], function (err) {
                callback1(null);
            });
        },
        function (err) { }
    );
    
    exports.updateEnvironment(function (result) {});
    intervals.push(setInterval(function () {
        exports.updateEnvironment(function (result) {});
    }, 1000 * 60 * 10));
    
    exports.randomOperationParameter({}, function (result) {});
    intervals.push(setInterval(function () {
        exports.randomOperationParameter({}, function (result) {});
    }, 1000 * 60 * 10));
};

exports.stop = function () {
    runSwitch = false;
    intervals.forEach(function (interval) {
        clearInterval(interval);
    });
    intervals = [];
}