var Region = require('../models/region');
var Province = require('../models/province');
var ProvinceType = require('../models/provinceType');
var PowerLine = require('../models/powerLine');
var VoltageClass = require('../models/voltageClass');
var VoltageClassUnit = require('../models/voltageClassUnit');

exports.addRegionData = function() {
    console.log('地区数据初始化开始。。。');
    console.log('读取json文件。。。');
    var json = require('../data/region.json');
    console.log('读取完毕。。。');
    
    console.log('开始插入地区类型。。。');
    var provinceTypes = json.regionTypes;
    for (var i = 0, len = provinceTypes.length; i < len; i++) {
        var provinceType = provinceTypes[i];
        var pt = new ProvinceType({
            no: provinceType.no,
            nameCn: provinceType.nameCn,
            nameEn: provinceType.nameEn
        });
        pt.save(function(err, user) {
            if(err) {}
        });
    }
    console.log('地区类型插入完毕。。。');
    
    console.log('开始插入地区数据。。。');
    var regions = json.regions;
    for (var i = 0, len = regions.length; i < len; i++) {
        var region = regions[i];
        var r = new Region({
            no: region.no,
            nameEn: region.nameEn,
            nameCn: region.nameCn,
            pinyin: region.pinyin
        });
        r.save(function(err, user) {
            if(err) {}
        });
        console.log('\t插入地区' + region.no);
        for (var j = 0, len1 = region.provinces.length; j < len1; j++) {
            var province = region.provinces[j];
            var p = new Province({
                no: province.no,
                nameEn: province.nameEn,
                nameCn: province.nameCn,
                pinyin: province.pinyin,
                abridge: province.abridge,
                abridgePinYin: province.abridgePinYin,
                type: province.type,
                regionNo: province.regionNo
            });
            p.save(function(err, user) {
                if(err) {}
            });
            console.log('\t\t插入省份' + province.no);
        }
        console.log('\t地区' + region.no + '插入完毕');
    }
    console.log('地区数据插入完毕。。。');
    console.log('初始化地区数据完成。。。');
};

exports.addPowerLineData = function() {
    var powerLine = new PowerLine({
        no: '1',
        modelNo: '1',
        voltageClass: '1',
        serviceDate: new Date(),
        repairDay: 1,
        maintainDay: 1,
        designYear: 1,
        runningState: 1,
        provinceNo: '1',
        lastRepairDate: new Date(),
        lastRepairNo: '1',
        lastMaintainDate: new Date(),
        lastMaintainNo: '1',
        location: {
            startLongitude: 121.48,
            startDimension: 31.22,
            endLongitude: 121.50,
            endDimension: 31.25
        }
    });
    powerLine.save(function(err, user) {
        if(err) {}
    });
    var powerLine2 = new PowerLine({
        no: '2',
        modelNo: '2',
        voltageClass: '2',
        serviceDate: new Date(),
        repairDay: 2,
        maintainDay: 2,
        designYear: 2,
        runningState: 2,
        provinceNo: '2',
        lastRepairDate: new Date(),
        lastRepairNo: '2',
        lastMaintainDate: new Date(),
        lastMaintainNo: '2',
        location: {
            startLongitude: 121.50,
            startDimension: 31.25,
            endLongitude: 121.55,
            endDimension: 31.30
        }
    });
    powerLine2.save(function(err, user) {
        if(err) {}
    });
};

exports.addVoltageClassData = function() {
    console.log('电压等级数据初始化开始。。。');
    console.log('读取json文件。。。');
    var json = require('../data/voltageClass.json');
    console.log('读取完毕。。。');
    
    console.log('开始插入电压等级单位。。。');
    var voltageClassUnits = json.voltageClassUnits;
    for (var i = 0, len = voltageClassUnits.length; i < len; i++) {
        var voltageClassUnit = voltageClassUnits[i];
        var vcu = new VoltageClassUnit({
            no: voltageClassUnit.no,
            unitEn: voltageClassUnit.unitEn,
            unitCn: voltageClassUnit.unitCn
        });
        vcu.save(function(err, user) {
            if(err) {}
        });
    }
    console.log('电压等级单位插入完毕。。。');
    
    console.log('开始插入电压等级数据。。。');
    var voltageClasses = json.voltageClasses;
    for (var i = 0, len = voltageClasses.length; i < len; i++) {
        var voltageClass = voltageClasses[i];
        var vc = new VoltageClass({
            no: voltageClass.no,
            voltage: voltageClass.voltage,
            unit: voltageClass.unit
        });
        vc.save(function(err, user) {
            if(err) {}
        });
        console.log('\t电压等级' + voltageClass.no + '插入完毕');
    }
    console.log('电压等级数据插入完毕。。。');
    console.log('初始化电压等级数据完成。。。');
}