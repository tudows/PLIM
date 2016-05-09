var User = require('../models/user');
var UserType = require('../models/userType');
var async = require('async');

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
    if (data.user == null) {
        data.user = {};
    }
    async.parallel([
        function (_callback) {
            if (data.type != null) {
                UserType.find(data.type, '_id', function (err, types) {
                    if (!err) {
                        data.user.type = { $in: types };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        }
    ], function (err, results) {
        if (results.length == 1) {
            User.findOne(data.user)
            .populate('type')
            .exec(function(err, user) {
                if(!err) {
                    callback(null, user);
                } else {
                    callback(err, null);
                }
            });
        }
    });
};

exports.find = function(data, callback) {
    if (data.user == null) {
        data.user = {};
    }
    async.parallel([
        function (_callback) {
            if (data.type != null) {
                UserType.find(data.type, '_id', function (err, types) {
                    if (!err) {
                        data.user.type = { $in: types };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        }
    ], function (err, results) {
        if (results.length == 1) {
            User.find(data.user)
            .populate('type')
            .exec(function(err, users) {
                if(!err) {
                    callback(null, users);
                } else {
                    callback(err, null);
                }
            });
        }
    });
};