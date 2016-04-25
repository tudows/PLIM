var User = require('../models/user');
var userDAO = require('../dao/userDAO');
var crypto = require('../utils/cryptoUtil');

exports.add = function(data, callback) {
    var user = new User({
        no: data.no,
        uuid: data.uuid,
        name: data.name,
        status: 1,
        salt: crypto.random(20, 'hex'),
        lastLoginDate: null,
        lastLocation: {
            longitude: null,
            latitude: null
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

exports.update = function(data, callback) {
    var _data = {};
    _data.key = {};
    _data.set = {};
    
    if (data.no != null && data.no != '') {
        _data.key.no = data.no;
    }
    if (data.uuid != null && data.uuid != '') {
        _data.key.uuid = {$in: [data.uuid]};
    }
    
    if (data.no != null && data.no != '') {
        _data.set.no = data.no;
    }
    if (data.name != null && data.name != '') {
        _data.set.name = data.name;
    }
    if (data.no != null && data.no != '') {
        _data.set.no = data.no;
    }
    if (data.status != null && data.status != '') {
        _data.set.status = data.status;
    }
    if (data.lastLoginDate != null && data.lastLoginDate != '') {
        _data.set.lastLoginDate = data.lastLoginDate;
    }
    if (data.lastLocation != null && data.lastLocation != '') {
        _data.set.lastLocation = data.lastLocation;
    }
    userDAO.update(_data, function(err, user) {
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