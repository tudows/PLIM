/// <reference path="../typings/my/node&express.d.ts" />

var maintainService = require('../services/maintainService');

exports.getMaintainNumberPost = function(req, res) {
    maintainService.getMaintainNumber(req.body.userId, function (maintainNumber) {
        res.send(maintainNumber + "");
        res.end();
    });
};

exports.listMainPowerLinePost = function(req, res) {
    maintainService.listMainPowerLine(req.body.userId, function (powerLines) {
        res.json(powerLines);
    });
};

exports.getMaintainInfoPost = function (req, res) {
    maintainService.getMaintainInfo(req.body.powerLineId, function (maintain) {
        res.json(maintain);
    });
};