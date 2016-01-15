var User = require('../models/user');

exports.add = function(data, callback) {
    data.save(function(err, user) {
        if(!err) {
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};

exports.findOne = function(data, callback) {
    User.findOne({
        username: data.username,
        password: data.password
    }, function(err, user) {
        if(!err) {
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};