var baseDataDAO = require('../dao/baseDataDAO');

exports.find = function(model, data, callback) {
    baseDataDAO.find(model, data, function(err, result){
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findDbRef = function(model, data, populate, callback) {
    baseDataDAO.findDbRef(model, data, populate, function(err, result){
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findOne = function(model, data, callback) {
    baseDataDAO.findOne(model, data, function(err, result){
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

exports.findOneDbRef = function(model, data, populate, callback) {
    baseDataDAO.findOneDbRef(model, data, populate, function(err, result){
        if(!err){
            callback(result);
        } else {
            callback(null);
        }
    });
};

// exports.findRegionByNameDbRef = function(data, callback) {
//     baseDataDAO.findRegionByNameDbRef(data, function(err, result){
//         if(!err){
//             callback(result);
//         } else {
//             callback(null);
//         }
//     });
// };