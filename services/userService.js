var User = require('../models/user');
var userDAO = require('../dao/userDAO');

exports.add = function(data, callback) {
    var user = new User({
        username: data.username,
        password: data.password
    });
    userDAO.add(user, function(err, user){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.findOne = function(data, callback) {
    var user = new User({
        username: data.username,
        password: data.password
    });
    userDAO.findOne(user, function(err, user){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};