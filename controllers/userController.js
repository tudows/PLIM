var userService = require('../services/userService');
var session = require('../utils/sessionUtil');

exports.loginGet = function(req, res) {
    res.render('user/login');
};
exports.loginPost = function(req, res) {
    var message = 'null';
    userService.findOne({'username': req.body.username, 'password': req.body.password}, function(result) {
        if (result) {
            message = 'welcome ' + req.body.username;
            console.log(req.body.username + ' login success');
            session.set(req, 'username', req.body.username);
        }
        else {
            message = 'fail';
            console.log('login fail');
        }
    });
    res.redirect('/');
};

exports.registerGet = function(req, res) {
    res.render('user/register');
};
exports.registerPost = function(req, res) {
    userService.add({'username': req.body.username, 'password': req.body.password}, function(result) {
        if (result) {
            session.del(req, 'username');
            res.redirect('/user/login');
        }
        else {
            res.render('user/register');
        }
    });
};

exports.logoutGet = function(req, res) {
    session.del(req, 'username');
    res.redirect('/');
};