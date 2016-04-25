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

exports.update = function(data, callback) {
    User.update(data.key, {
        $set: data.set
    },
    function(err, user) {
        if(!err) {
            callback(null, user);
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