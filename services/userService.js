var User = require('../models/user');
var userDAO = require('../dao/userDAO');
var crypto = require('../utils/cryptoUtil');

exports.add = function(data, callback) {
    var user = new User({
        no: data.no,
        uuid: [],
        name: data.name,
        status: 1,
        salt: crypto.random(20, 'hex'),
        lastLoginDate: null,
        lastLocation: {
            longitude: null,
            latitude: null
        },
        lastDevice: null
    });
    userDAO.add(user, function(err, result){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.addUuid = function(data, callback) {
    // userDAO.findOne({
    //     no: data.no
    // }, function(err, user){
    //     if(!err){
    //         if (user != null) {
                
    //         } else {
    //             callback(null);
    //         }
    //     } else {
    //         callback(null);
    //     }
    // });
    
    var uuid = crypto.sha256(data.uuid, 'rrabbit', 'hex');
    userDAO.findOne({
        no: data.no,
        uuid: {$nin: [uuid]}
    }, function(err, user){
        if(!err){
            if (user != null) {
                userDAO.update({
                    key: {no: data.no},
                    set: {$push: {uuid: uuid}}
                }, function(err, result) {
                    if(!err){
                        callback(result);
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};

exports.removeUuid = function(data, callback) {
    var uuid = crypto.sha256(data.uuid, 'rrabbit', 'hex');
    userDAO.update({
        key: {
            no: data.no,
            uuid: {$in: [uuid]}
        },
        set: {$pull: {uuid: uuid}}
    }, function(err, result) {
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.updateLastInfo = function(data, callback) {
    userDAO.update({
        key: {no: data.no},
        set: {
            $set: {
                lastLoginDate: data.lastLoginDate,
                lastLocation: data.lastLocation,
                lastDevice: crypto.sha256(data.lastDevice, 'rrabbit', 'hex')
            }
        }
    }, function(err, result) {
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findOne = function(data, callback) {
    var _user = {};
    if (data.no != null && data.no != '') {
        _user.no = data.no;
    }
    if (data.uuid != null && data.uuid != '') {
        _user.uuid = {$in: [crypto.sha256(data.uuid, 'rrabbit', 'hex')]};
    }
    if (data.name != null && data.name != '') {
        _user.name = data.name;
    }
    userDAO.findOne(_user, function(err, user){
        if(!err){
            callback(user);
        } else {
            callback(null);
        }
    });
};

exports.findByUuid = function(data, callback) {
    userDAO.find({},function(err, users){
        if(!err){
            if (users != null) {
                users.forEach(function(user) {
                    user.uuid.forEach(function(_uuid) {
                        if (crypto.sha256(data.uuid, user.salt, 'hex') == _uuid) {
                            callback(user);
                        } 
                    });
                });
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};