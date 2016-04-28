var baseDataService = require('../services/baseDataService');

exports.getVoltageClassGet = exports.getVoltageClassPost = function(req, res) {
    baseDataService.findDbRef('VoltageClass', req.body, 'unit', function(voltageClasses) {
        if (voltageClasses) {
            res.json(voltageClasses);
        }
        else {
            res.end();
        }
    });
};

exports.getRunningStateGet = exports.getRunningStatePost = function(req, res) {
    baseDataService.find('RunningState', req.body, function(runningStates) {
        if (runningStates) {
            res.json(runningStates);
        }
        else {
            res.end();
        }
    });
};

exports.getProvinceGet = exports.getProvincePost = function(req, res) {
    baseDataService.findDbRef('Province', req.body, 'type', function(provinces) {
        if (provinces) {
            res.json(provinces);
        }
        else {
            res.end();
        }
    });
};