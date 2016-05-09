/// <reference path="../typings/my/node&express.d.ts" />

var Maintain = require('../models/maintain');
var MaintainState = require('../models/maintainState');
var MaintainType = require('../models/maintainType');
var PowerLineOperation = require('../models/powerLineOperation');
var PowerLine = require('../models/powerLine');
var RunningState = require('../models/runningState');
var User = require('../models/user');

exports.find = function(data, callback) {
    Maintain.find(data.maintain == null ? {} : data.maintain).populate({
        path: "powerLine",
        match: data.powerLine == null ? {} : data.powerLine
    }).populate({
        path: "maintainUser",
        match: data.maintainUser == null ? {} : data.maintainUser
    }).populate({
        path: "createUser",
        match: data.createUser == null ? {} : data.createUser
    }).populate({
        path: "updateUser",
        match: data.updateUser == null ? {} : data.updateUser
    }).populate({
        path: "maintainState",
        match: data.maintainState == null ? {} : data.maintainState
    }).populate({
        path: "maintainType",
        match: data.maintainType == null ? {} : data.maintainType
    }).exec(function(err, maintains) {
        if (!err) {
            PowerLineOperation.populate(maintains, {
                path: "maintainType.powerLineOperation",
                match: data.powerLineOperation == null ? {} : data.powerLineOperation
            }, function (_err, _maintains) {
                if (!err) {
                    callback(null, _maintains);
                } else {
                    callback(_err, null);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

exports.findMaintainType = function (data, callback) {
    MaintainType.find(data).populate("powerLineOperation").exec(function (err, maintainTypes) {
        if (!err) {
            callback(null, maintainTypes);
        } else {
            callback(err, null);
        }
    });
};

exports.findMaintainState = function (data, callback) {
    MaintainState.find(data).exec(function (err, maintainStates) {
        if (!err) {
            callback(null, maintainStates);
        } else {
            callback(err, null);
        }
    });
};

exports.operationPowerLine = function (data, callback) {
    switch (data.code) {
        case 1:
            RunningState.findOne({ code: 2 }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
        case 8:
            var runningStateCode = null;
            if (data.maintainTypeCode == 6) {
                runningStateCode = 4;
            } else if (data.maintainTypeCode == 7) {
                runningStateCode = 3;
            }
            RunningState.findOne({ code: runningStateCode }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
        case 9:
            RunningState.findOne({ code: 5 }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
    }
};

exports.add = function(data, callback) {
    data.save(function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};