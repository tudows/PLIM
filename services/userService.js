var User = require('../models/user.js');

exports.add = function(data, callback) {
    var user = new User({
        username: data.username,
        password: data.password
    });
    user.save(function(err, user){
        if(!err){
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};

exports.find = function(data, callback) {
    User.findOne({
        username: data.username,
        password: data.password
    }, function(err, user){
        if(!err){
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};