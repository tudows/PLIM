// var express = require('express');
// var router = express.Router();
var userService = require('../services/userService.js');

// router.get('/login', function(req, res, next) {
//     res.render('user/login');
// });
// router.post('/login', function(req, res, next) {
//     var message = 'null';
//     userService.find({'username': req.body.username, 'password': req.body.password}, function(err, result) {
//         if (!err) {
//             message = 'welcome ' + result;
//             console.log(result.username + ' login success');
//         }
//         else {
//             message = 'fail';
//             console.log('login fail');
//         }
//     });
//     res.redirect('/');
// });

// router.get('/register', function(req, res, next) {
//     res.render('user/register');
// });
// router.post('/register', function(req, res, next) {
//     userService.add({'username': req.body.username, 'password': req.body.password}, function(err, result) {
//         if (!err) {
//             console.log(req.body.username + ' register success');
//         }
//         else {
//             console.log('register fail');
//         }
//     });
//     res.redirect('/user/login');
// });

exports.loginGet = function(data, callback) {
    data.res.render('user/login');
};

// module.exports = router;
