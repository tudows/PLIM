var User = require('../models/user');

exports.add = function(data, callback) {
    data.save(function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.update = function(data, callback) {
    User.update(data.key, data.set,
    function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findOne = function(data, callback) {
    User.findOne(data, function(err, user) {
        if(!err) {
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};

exports.find = function(data, callback) {
    User.find(data, function(err, user) {
        if(!err) {
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};