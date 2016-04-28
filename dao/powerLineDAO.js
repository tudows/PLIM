var PowerLine = require('../models/powerLine');
var VoltageClassUnit = require('../models/voltageClassUnit');

exports.find = function(data, callback) {
    PowerLine.find(data).populate("voltageClass").populate("runningState").populate("province").exec(function(err, powerLines) {
        if(!err) {
            VoltageClassUnit.populate(powerLines, { "path": "voltageClass.unit" }, function (_err, _result) {
                if (!_err) {
                    callback(null, _result);
                } else {
                    callback(_err, null);
                }
            });
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