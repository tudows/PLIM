var regionService = require('../services/regionService');

exports.listProvinceGet = function(req, res) {
    regionService.listProvince(function(result) {
        if (result) {
            res.json(result);
        }
        else {
            res.end();
        }
    });
};