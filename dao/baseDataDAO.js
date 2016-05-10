var ProvinceType = require('../models/provinceType');
var Province = require('../models/province');
var Region = require('../models/region');
var RunningState = require('../models/runningState');
var VoltageClass = require('../models/voltageClass');
var VoltageClassUnit = require('../models/voltageClassUnit');
var MaintainType = require('../models/maintainType');

exports.find = function(model, data, callback) {
    var model = eval(model);
    model.find(data, function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findOne = function(model, data, callback) {
    var model = eval(model);
    model.findOne(data, function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

exports.findDbRef = function(model, data, populate, callback) {
    // if (model == 'Region') {
    //     Region.aggregate().unwind('provinces').exec(function(err, result) {
    //         if(!err) {
    //             ProvinceType.populate(result, {"path": "provinces.type"}, function(_err, _result) {
    //                 if (!_err) {
    //                     callback(null, _result);
    //                 } else {
    //                     callback(_err, null);
    //                 }
    //             });
    //         } else {
    //             callback(err, null);
    //         }
    //     });
    // } else {
        var model = eval(model);
        model.find(data).populate(populate).exec(function(err, result) {
            if(!err) {
                callback(null, result);
            } else {
                callback(err, null);
            }
        });
    // }
};

exports.findOneDbRef = function(model, data, populate, callback) {
    var model = eval(model);
    model.find(data).populate(populate).exec(function(err, result) {
        if(!err) {
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};

// exports.findRegionByNameDbRef = function(data, callback) {
//     Region.aggregate({
//         '$project':{'provinces': '$provinces'}
//     },{
//         '$unwind': '$provinces'
//     },{
//         '$match':{'provinces.nameCn': data}
//     }).exec(function(err, result) {
//         if(!err) {
//             ProvinceType.populate(result, {"path": "provinces.type"}, function(_err, _result) {
//                 if (!_err) {
//                     callback(null, result);
//                 } else {
//                     callback(err, null);
//                 }
//             });
//         } else {
//             callback(err, null);
//         }
//     });
// };