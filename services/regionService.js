var regionDAO = require('../dao/regionDAO');

exports.listProvince = function(callback) {
    regionDAO.findProvince(function(err, provinces){
        if(!err){
            callback(provinces);
        } else {
            callback(null);
        }
    });
};