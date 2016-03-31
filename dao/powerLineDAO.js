var PowerLine = require('../models/powerLine');

exports.find = function(data, callback) {
    PowerLine.find(data, function(err, powerLines) {
        if(!err) {
            callback(null, powerLines);
        } else {
            callback(err, null);
        }
    });
};

exports.add = function(data, callback) {
    data.save(function(err, powerLine) {
        if(!err) {
            callback(null, powerLine);
        } else {
            callback(err, null);
        }
    });
};

exports.remove = function(data, callback) {
    PowerLine.remove(data, function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};