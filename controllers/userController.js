/// <reference path="../typings/my/node&express.d.ts" />

var userService = require('../services/userService');
var session = require('../utils/sessionUtil');
var crypto = require('../utils/cryptoUtil');

exports.indexGet = function (req, res) {
    res.render('user/index');
};

exports.loginGet = exports.loginPost = function(req, res) {
    userService.findOne({uuid: req.body.uuid}, function(user) {
        if (user != null) {
            session.del(req, 'user');
            session.set(req, 'user', JSON.stringify(user));
            res.json(user);
        }
        else {
            res.end();
        }
    });
};

exports.findNoGet = exports.findNoPost = function(req, res) {
    userService.findOne({no: req.body.no}, function(user) {
        if (user != null) {
            res.json(user);
        }
        else {
            res.end();
        }
    });
};

exports.registerGet = function (req, res) {
    res.render('user/register');
};
exports.registerPost = function (req, res) {
    userService.addUuid(req.body, function(result) {
        if (result != null) {
            userService.findOne({no: req.body.no}, function(user) {
                if (user != null) {
                    session.del(req, 'user');
                    session.set(req, 'user', JSON.stringify(user));
                    res.json(user);
                }
                else {
                    res.end();
                }
            });
        }
        else {
            res.end();
        }
    });
};

exports.addUserPost = function (req, res) {
    userService.add(req.body, function(result) {
        res.end();
    });
};

exports.updateLastInfoGet = exports.updateLastInfoPost = function(req, res) {
    userService.updateLastInfo(req.body, function(user) {
        res.end();
    });
};

exports.unBindDeviceGet = exports.unBindDevicePost = function (req, res) {
    userService.removeUuid(req.body, function(result) {
        if (result) {
            session.del(req, 'user');
        }
        res.send(result);
        res.end();
    });
};

exports.listUserGet = function (req, res) {
    userService.find(function (result) {
        res.json(result);
    });
};