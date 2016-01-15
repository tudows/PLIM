var userService = require('../services/userService');
var session = require('../utils/sessionUtil');

exports.loginGet = function(req, res) {
    res.render('user/login');
};
exports.loginPost = function(req, res) {
    var message = 'null';
    userService.find({'username': req.body.username, 'password': req.body.password}, function(err, result) {
        if (!err) {
            message = 'welcome ' + result;
            console.log(result.username + ' login success');
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
    userService.add({'username': req.body.username, 'password': req.body.password}, function(err, result) {
        if (!err) {
            console.log(req.body.username + ' register success');
        }
        else {
            console.log('register fail');
        }
    });
    res.redirect('/user/login');
};
