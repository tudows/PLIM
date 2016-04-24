var User = require('../models/user');
var userDAO = require('../dao/userDAO');

exports.add = function(data, callback) {
    var user = new User({
        no: data.no,
        uuid: data.uuid,
        name: data.name,
        status: 1,
        lastLoginDate: null,
        lastLocation: {
            startLongitude: null,
            startLatitude: null,
            endLongitude: null,
            endLatitude: null
        }
    });
    userDAO.add(user, function(err, user){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.register = function(data, callback) {
    var _data = {};
    _data.no = data.no;
    _data.set = {};
    if (data.uuid != null && data.uuid != '') {
        _data.set.uuid = data.uuid;
    }
    if (data.name != null && data.name != '') {
        _data.set.name = data.name;
    }
    if (data.lastLoginDate != null && data.lastLoginDate != '') {
        _data.set.lastLoginDate = data.lastLoginDate;
    }
    if (data.lastLocation != null && data.lastLocation != '') {
        _data.set.lastLocation = data.lastLocation;
    }
    userDAO.updateByNo(_data, function(err, user) {
        if(!err){
            callback(user);
        } else {
            callback(null);
        }
    });
};

exports.findOne = function(data, callback) {
    var user = {};
    if (data.no != null && data.no != '') {
        user.no = data.no;
    }
    if (data.uuid != null && data.uuid != '') {
        user.uuid = data.uuid;
    }
    if (data.name != null && data.name != '') {
        user.name = data.name;
    }
    userDAO.findOne(user, function(err, user){
        if(!err){
            callback(user);
        } else {
            callback(null);
        }
    });
};