var userService = require('../services/userService');
var session = require('../utils/sessionUtil');

exports.indexGet = function (req, res) {
    res.render('user/index');
};

exports.loginGet = exports.loginPost = function(req, res) {
    userService.findOne({uuid: req.body.uuid}, function(user) {
        if (user != null) {
            session.del(req, 'user');
            session.set(req, 'user', user);
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
    userService.register(req.body, function(result) {
        if (user != null) {
            session.del(req, 'user');
            session.set(req, 'user', user);
            res.json(user);
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