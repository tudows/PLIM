var Region = require('../models/region');
var Province = require('../models/province');

exports.findProvince = function(callback) {
    Province.find(function(err, provinces) {
        if(!err) {
            callback(null, provinces);
        } else {
            callback(err, null);
        }
    });
};