var PowerLine = require('../models/powerLine');
var powerLineDAO = require('../dao/powerLineDAO');

exports.add = function(data, callback) {
    var powerLine = new PowerLine({
        no: data.no,
        modelNo: data.modelNo,
        voltageClass: data.voltageClass,
        serviceDate: new Date(),
        repairDay: data.repairDay,
        maintainDay: data.maintainDay,
        designYear: data.designYear,
        runningState: data.runningState,
        provinceNo: data.provinceNo,
        lastRepairDate: null,
        lastRepairNo: null,
        lastMaintainDate: null,
        lastMaintainNo: null,
        location: {
            startLongitude: data.startLongitude,
            startDimension: data.startDimension,
            endLongitude: data.endLongitude,
            endDimension: data.endDimension
        }
    });
    powerLineDAO.add(powerLine, function(err, powerLines){
        if(!err){
            callback(true);
        } else {
            callback(false);
        }
    });
};

exports.list = function(provinceNo, callback) {
    powerLineDAO.find({'provinceNo': provinceNo}, function(err, powerLines){
        if(!err){
            callback(powerLines);
        } else {
            callback(null);
        }
    });
};