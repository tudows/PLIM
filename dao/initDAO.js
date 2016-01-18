var Region = require('../models/region');
var Province = require('../models/province');
var RegionType = require('../models/provinceType');

exports.addRegionData = function() {
    console.log('地区数据初始化开始。。。');
    console.log('读取json文件。。。');
    var json = require('../data/region.json');
    console.log('读取完毕。。。');
    
    console.log('开始插入地区类型。。。');
    var provinceTypes = json.regionTypes;
    for (var i = 0, len = provinceTypes.length; i < len; i++) {
        var provinceType = provinceTypes[i];
        var pt = new RegionType({
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