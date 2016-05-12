/// <reference path="../typings/my/node&express.d.ts" />

var maintainService = require('../services/maintainService');
var session = require('../utils/sessionUtil');

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

exports.changeMaintainPost = function (req, res) {
    session.get(req, 'user', function (err, user) {
        if (!err) {
            if (user != null) {
                req.body.user = JSON.parse(user);
            }
            maintainService.changeMaintain(req.body, function (result) {
                res.send(result);
                res.end();
            });
        } else {
            res.end();
        }
    });
};

exports.positionGet = function(req, res) {
    res.render('maintain/position');
};

exports.listGet = function(req, res) {
    res.render('maintain/list');
};

exports.detailGet = function(req, res) {
    res.render('maintain/detail');
};