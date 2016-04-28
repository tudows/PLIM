var PowerLine = require('../models/powerLine');
var powerLineDAO = require('../dao/powerLineDAO');
var request = require('request');
var async = require("async");
var mongoose = require('mongoose');

exports.add = function(data, callback) {
    var powerLine = new PowerLine({
        no: data.no,
        modelNo: data.modelNo,
        voltageClass: mongoose.Types.ObjectId(data.voltageClass),
        serviceDate: new Date(),
        repairDay: data.repairDay,
        maintainDay: data.maintainDay,
        designYear: data.designYear,
        runningState: mongoose.Types.ObjectId(data.runningState),
        province: mongoose.Types.ObjectId(data.province),
        lastRepairDate: null,
        lastRepairNo: null,
        lastMaintainDate: null,
        lastMaintainNo: null,
        location: {
            startLongitude: data.location.startLongitude,
            startLatitude: data.location.startLatitude,
            endLongitude: data.location.endLongitude,
            endLatitude: data.location.endLatitude
        },
        encrypt: data.encrypt,
        status: 1
    });
    powerLineDAO.add(powerLine, function(err, powerLines){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.list = function(powerLine, callback) {
    powerLineDAO.find(powerLine, function(err, powerLines){
        if(!err){
            callback(powerLines);
        } else {
            callback(null);
        }
    });
};

exports.remove = function(callback) {
    powerLineDAO.remove({}, function(err){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};