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