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

exports.getMaintainTypeGet = exports.getMaintainTypePost = function(req, res) {
    baseDataService.findDbRef('MaintainType', req.body, 'powerLineOperation', function(maintainTypes) {
        if (maintainTypes) {
            res.json(maintainTypes);
        }
        else {
            res.end();
        }
    });
};

exports.getMaintainStateGet = exports.getMaintainStatePost = function(req, res) {
    baseDataService.find('MaintainState', req.body, function(maintainStates) {
        if (maintainStates) {
            res.json(maintainStates);
        }
        else {
            res.end();
        }
    });
};