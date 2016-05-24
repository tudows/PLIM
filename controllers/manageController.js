/// <reference path="../typings/my/node&express.d.ts" />

var maintainDAO = require('../dao/maintainDAO');
var powerLineDAO = require('../dao/powerLineDAO');
var Segment = require('segment');
var segment = new Segment();
segment.useDefault();

exports.indexGet = function(req, res) {
    res.render('manage/index');
};

exports.videoGet = function(req, res) {
    res.redirect('http://127.0.0.1:3000');
};

exports.searchGet = function(req, res) {
    res.render('manage/search');
};

exports.splitGet = function(req, res) {
    res.json(segment.doSegment(req.query.keyWord));
};

exports.searchPowerLineGet = function(req, res) {
    if (req.query.keyWord == null) {
        req.query.keyWord = "";
    }
    var words = segment.doSegment(req.query.keyWord);
    // 已经
    // 正在
    // 维修/保养
    // 了/过
    // 的/得
    // 线路
    // 编号
    // 数字
    var meaning = [0, 0, 0, 0, 0, 0, 0];
    var powerLineNo = null;
    if (words.length > 0) {
        words.forEach(function (word, index) {
            switch (word.w) {
                case '已经':
                    meaning[0]++;
                    break;
                case '正在':
                    meaning[1]++;
                    break;
                case '维修':
                    meaning[2]++;
                    break;
                case '保养':
                    meaning[2]++;
                    break;
                case '了':
                    if (words.length >= 2 && words[index + 1].w == '的') {
                        meaning[3]++;
                    }
                    break;
                case '过':
                    if (words.length >= 2 && words[index + 1].w == '的') {
                        meaning[3]++;
                    }
                    break;
                case '的':
                    meaning[4]++;
                    break;
                case '得':
                    meaning[4]++;
                    break;
                case '线路':
                    meaning[5]++;
                    break;
                case '编号':
                    meaning[6]++;
                    break;
                default:
                    if ((/^[0-9]*$/g.test(word.w)) && ((words.length >= 2 && words[index - 1].w == '编号') || (words.length >= 3 && words[index - 2].w == '编号'))) {
                        powerLineNo = word.w;
                    }
                    break;
            }
        });
        // 0：所有线路，1：正在维修的线路，2：已经维修的线路
        var result = 0;
        if (meaning[2] > 0 && meaning[5] > 0) {
            if (meaning[1] > 0 || (meaning[0] == 0 && meaning[4] > 0 && meaning[3] == 0)) {
                result = 1;
            } else {
                if (meaning[0] > 0 || (meaning[3] > 0 && meaning[4] > 0)) {
                    result = 2;
                }
            }
        }
        
        var powerLineData = { powerLine: {} };
        if (powerLineNo != null) {
            powerLineData.powerLine.no = powerLineNo;
        }
        if (result != 0) {
            var data = {};
            if (result == 1) {
                data.maintainState = { code: { $ne: 4 } };
            } else if (result == 2) {
                data.maintainState = { code: 4 };
            }
            
            maintainDAO.find(data, function (err, maintains) {
                var powerLineIds = [];
                maintains.forEach(function (maintain) {
                    if (powerLineNo != null && maintain.powerLine._id == powerLineNo) {
                        powerLineIds.push(maintain.powerLine._id);
                    } else if (powerLineNo == null) {
                        powerLineIds.push(maintain.powerLine._id);
                    }
                });
                if (powerLineIds.length > 0) {
                    powerLineDAO.find({
                        powerLine: { _id: { $in: powerLineIds }
                    }}, function (err, powerLines) {
                        if (!err) {
                            res.json(powerLines);
                        } else {
                            res.json([]);
                        }
                    });
                } else {
                    res.json([]);
                }
            });
            
        } else {
            powerLineDAO.find(powerLineData, function (err, powerLines) {
                res.json(powerLines);
            });
        }
    } else {
        powerLineDAO.find({}, function (err, powerLines) {
            res.json(powerLines);
        });
    }
};