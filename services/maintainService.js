/// <reference path="../typings/my/node&express.d.ts" />

var maintainDAO = require('../dao/maintainDAO');
var powerLineDAO = require('../dao/powerLineDAO');
var mongoose = require('mongoose');
var async = require('async');

exports.getMaintainNumber = function(userId, callback) {
    maintainDAO.findUserMaintainNumber(mongoose.Types.ObjectId(userId), function (err, maintainNumber) {
        callback(maintainNumber);
    });
};

exports.listMainPowerLine = function(userId, callback) {
    maintainDAO.findMaintainPowerLine(mongoose.Types.ObjectId(userId), function (powerLineIds) {
        if (powerLineIds.length > 0) {
            powerLineDAO.find({
                powerLine: { _id: { $in: powerLineIds }
            } }, function (err, result) {
                if (!err) {
                    // callback(result);
                    var count = 0;
                    var maintains = [];
                    async.whilst(
                        function () { return count < result.length; },
                        function (_call4) {
                            var _powerLine = result[count];
                            async.series([
                                function (_call3) {
                                    maintainDAO.find({
                                        maintain: {
                                            powerLine: _powerLine._id,
                                            maintainState: { $ne: mongoose.Types.ObjectId('573035613982d8481f73dca5') }
                                        }
                                    }, function (err, _maintain) {
                                        _call3(err, _maintain);
                                    });
                                }
                            ], function (err, result) {
                                maintains.push(result[0][0]);
                                count++;
                                _call4(null);
                            });
                        },
                        function (err) {
                            callback({
                                powerLines: result,
                                maintains: maintains
                            });
                        }
                    );
                } else {
                    callback([]);
                }
            });
        } else {
            callback([]);
        }
    });
};

exports.getMaintainInfo = function (powerLineId, callback) {
    maintainDAO.find({
        maintain: { powerLine: mongoose.Types.ObjectId(powerLineId) },
        maintainState: { code: { $ne: 4 } }
    }, function (err, maintains) {
        if (!err) {
            callback(maintains[0]);
        } else {
            callback(null);
        }
    });
};

exports.changeMaintain = function (data, callback) {
    if (data.user != null) {
        var _set = null
        if (data.maintainStateCode == 3) {
            _set = { $set: {
                maintainType: data.maintainTypeId,
                updateDate: new Date(),
                updateUser: data.user._id
            } };
        } else if (data.maintainStateCode == 4) {
            _set = { $set: {
                maintainCompleteIllustration: data.maintainCompleteIllustration,
                updateDate: new Date(),
                updateUser: data.user._id
            } };
        }
        
        if (_set != null) {
            maintainDAO.update({
                query: { _id: data.maintanId },
                set: _set
            }, {
                maintainState: { code: data.maintainStateCode }
            }, function (err, result) {
                if (!err) {
                    maintainDAO.find({
                        maintain: { _id: data.maintanId }
                    }, function (err, maintains) {
                        if (!err) {
                            var maintain = maintains[0];
                            async.series([
                                function (_call1) {
                                    if (data.maintainStateCode == 3) {
                                        maintainDAO.find({
                                            maintain: {
                                                powerLine: data.powerLineId,
                                                maintainType: data.maintainTypeId
                                            },
                                            maintainState: { code: 4 }
                                        }, function (err, _maintains) {
                                            if (!err && _maintains.length > 0) {
                                                var _maintainsDis = [];
                                                _maintains.forEach(function (_maintain) {
                                                    // Euclidean Distance
                                                    var attrs = ['pullNewton', 'celsius', 'ohm', 'ampere', 'volt'];
                                                    var dis = 0;
                                                    attrs.forEach(function (attr) {
                                                        var diff = _maintain.operationParameterSnapshot[attr] - maintain.operationParameterSnapshot[attr];
                                                        dis += diff * diff;
                                                    });
                                                    _maintainsDis.push({
                                                        maintainCompleteIllustration: _maintain.maintainCompleteIllustration,
                                                        euclideanDistance: Math.sqrt(dis)
                                                    });
                                                });
                                                _maintainsDis.sort(function (a, b) {
                                                    return a.euclideanDistance > b.euclideanDistance;
                                                });
                                                maintain.maintainSuggestion = _maintainsDis[0].maintainCompleteIllustration;
                                                maintainDAO.update({
                                                    query: { _id: maintain._id },
                                                    set: { $set: { maintainSuggestion: maintain.maintainSuggestion } }
                                                }, {}, function (err, result) { });
                                                _call1(null, '');
                                            } else {
                                                _call1(null, '');
                                            }
                                        });
                                    } else if (data.maintainStateCode == 4) {
                                        var _set = {};
                                        if (maintain.maintainType.code == 6) {
                                            _set = {
                                                lastMaintainDate: new Date(),
                                                lastMaintainNo: data.user._id.toString()
                                            };
                                        } else {
                                            _set = {
                                                lastRepairDate: new Date(),
                                                lastRepairNo: data.user._id.toString()
                                            };
                                        }
                                        powerLineDAO.update({
                                            query: { _id: maintain.powerLine },
                                            set: { $set: _set }
                                        }, {
                                            runningState: { code: 2 }
                                        }, function (err, result) { });
                                        _call1(null, '');
                                    } else {
                                        _call1(null, '');
                                    }
                                }
                            ], function (err, results) {
                                callback(maintain);
                            });
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    } else {
        callback(null);
    }
};