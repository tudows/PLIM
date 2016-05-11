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
                    callback(result);
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
                    var maintain = maintains[0];
                    if (!err) {
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
};