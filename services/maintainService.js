/// <reference path="../typings/my/node&express.d.ts" />

var maintainDAO = require('../dao/maintainDAO');
var powerLineDAO = require('../dao/powerLineDAO');
var mongoose = require('mongoose');

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