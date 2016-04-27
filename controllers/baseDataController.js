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

exports.getRegionGet = exports.getRegionPost = function(req, res) {
    baseDataService.findDbRef('Region', null, null, function(regions) {
        if (regions) {
            res.json(regions);
        }
        else {
            res.end();
        }
    });
};

exports.getRegionByNameGet = exports.getRegionByNamePost = function(req, res) {
    baseDataService.findRegionByNameDbRef(req.body.nameCn, function(regions) {
        if (regions) {
            res.json(regions);
        }
        else {
            res.end();
        }
    });
};