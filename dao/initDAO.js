var async = require('async');
var mongoose = require('mongoose');

var Region = require('../models/region');
var Province = require('../models/province');
var ProvinceType = require('../models/provinceType');
var PowerLine = require('../models/powerLine');
var VoltageClass = require('../models/voltageClass');
var VoltageClassUnit = require('../models/voltageClassUnit');
var RunningState = require('../models/runningState');
var MaintainState = require('../models/maintainState');
var PowerLineOperation = require('../models/powerLineOperation');
var MaintainType = require('../models/maintainType');
var UserType = require('../models/userType');
var User = require('../models/user');

exports.addRegionData = function() {
    console.log('地区数据初始化开始。。。');
    
    async.series([
        function(callback) {
            console.log('删除地区类型数据开始。。。');
            ProvinceType.remove({}, function(err){
                console.log('删除地区类型数据完成。。。');
                callback(null, null);
            });
        },
        function(callback) {
            console.log('删除区域数据开始。。。');
            Region.remove({}, function(err){
                console.log('删除区域数据完成。。。');
                callback(null, null);
            });
        },
        function(callback) {
            console.log('删除地区数据开始。。。');
            Province.remove({}, function(err){
                console.log('删除地区数据完成。。。');
                callback(null, null);
            });
        },
        function(callback) {
            console.log('读取json文件。。。');
            var json = require('../data/region.json');
            console.log('读取完毕。。。');
            
            console.log('开始插入地区类型。。。');
            var provinceTypes = json.provinceTypes;
            var _provinceTypes =[];
            provinceTypes.forEach(function (provinceType) {
                var pt = new ProvinceType({
                    nameCn: provinceType.nameCn,
                    nameEn: provinceType.nameEn
                });
                _provinceTypes.push(pt);
                pt.save(function(err, user) {
                    if(err) {}
                });
            });
            console.log('地区类型插入完毕。。。');
            
            console.log('开始插入地区数据。。。');
            var regions = json.regions;
            regions.forEach(function(region) {
                var _provinces = [];
                region.provinces.forEach(function(province) {
                    var p = new Province({
                        nameEn: province.nameEn,
                        nameCn: province.nameCn,
                        pinyin: province.pinyin,
                        abridge: province.abridge,
                        abridgePinYin: province.abridgePinYin,
                        type: _provinceTypes[parseInt(province.type) - 1]._id
                    });
                    _provinces.push(p._id);
                    p.save(function(err, user) {
                        if(err) {
                            console.log(_provinces);
                            console.log(err);
                            callback(null, null);
                        }
                    });
                });
                var r = new Region({
                    nameEn: region.nameEn,
                    nameCn: region.nameCn,
                    pinyin: region.pinyin,
                    provinces: _provinces
                });
                r.save(function(err, user) {
                    if(err) {
                        console.log(_provinces);
                        console.log(err);
                        callback(null, null);
                    }
                });
            });
            console.log('地区数据插入完毕。。。');
            callback(null, null);
        }
    ],
    function(err, result) {
    });
    
    console.log('初始化地区数据完成。。。');
};

exports.addMaintainData = function() {
    var json = require('../data/maintain.json');
    
    json.maintainStates.forEach(function(maintainState) {
        var ms = new MaintainState({
            nameCn: maintainState.nameCn,
            nameEn: maintainState.nameEn,
            code: maintainState.code
        });
        ms.save();
    });
    
    var powerLineOperations = [];
    json.powerLineOperations.forEach(function(powerLineOperation) {
        var po = new PowerLineOperation({
            nameCn: powerLineOperation.nameCn,
            nameEn: powerLineOperation.nameEn,
            code: powerLineOperation.code
        });
        powerLineOperations.push(po);
        po.save();
    });
    
    json.maintainTypes.forEach(function(maintainType) {
        var _powerLineOperation = [];
        maintainType.powerLineOperation.forEach(function(po) {
            _powerLineOperation.push(powerLineOperations[po - 1]._id);
        });
        var mt = new MaintainType({
            nameCn: maintainType.nameCn,
            nameEn: maintainType.nameEn,
            code: maintainType.code,
            powerLineOperation: _powerLineOperation
        });
        mt.save();
    });
}

exports.addVoltageClassData = function() {
    console.log('电压等级数据初始化开始。。。');
    console.log('读取json文件。。。');
    var json = require('../data/voltageClass.json');
    console.log('读取完毕。。。');
    
    console.log('开始插入电压等级单位。。。');
    var _voltageClassUnits = [];
    json.voltageClassUnits.forEach(function(voltageClassUnit) {
        var vcu = new VoltageClassUnit({
            unitEn: voltageClassUnit.unitEn,
            unitCn: voltageClassUnit.unitCn
        });
        _voltageClassUnits.push(vcu);
        vcu.save(function(err, user) {
            if(err) {}
        });
    });
    console.log('电压等级单位插入完毕。。。');
    
    console.log('开始插入电压等级数据。。。');
    json.voltageClasses.forEach(function(voltageClass) {
        var vc = new VoltageClass({
            voltage: voltageClass.voltage,
            unit: _voltageClassUnits[voltageClass.unit - 1]
        });
        vc.save(function(err, user) {
            if(err) {}
        });
    });
    console.log('电压等级数据插入完毕。。。');
    console.log('初始化电压等级数据完成。。。');
}

exports.addRunningState = function() {
    console.log('运行状态数据初始化。。。');
    console.log('读取json文件。。。');
    var json = require('../data/runningState.json').runningStates;
    console.log('读取完毕。。。');
    
    console.log('开始插入运行状态。。。');
    
    json.forEach(function (runningState) {
        var rs = new RunningState({
            nameCn: runningState.nameCn,
            nameEn: runningState.nameEn
        });
        rs.save(function(err, user) {
            if(err) {}
        });
    });
    
    console.log('运行状态数据插入完毕。。。');
    console.log('初始化运行状态数据完成。。。');
}

exports.addUserDate = function() {
    var json = require('../data/user.json');
    
    json.userTypes.forEach(function (userType) {
        var ut = new UserType({
            nameCn: userType.nameCn,
            nameEn: userType.nameEn,
            code: userType.code
        });
        ut.save(function (err, result) {});
    });
}

exports.user = function() {
    UserType.find({ code: {$in: [1, 2, 3]} }, function (err, result) {
        var type = [];
        result.forEach(function (r) {
            type.push(r);
        });
        
        User.update({
            no: '20160002'
        }, {
            $set: {
                type: type
            }
        }, function (err, result) {});
    });
}