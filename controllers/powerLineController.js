/// <reference path="../typings/my/node&express.d.ts" />

var powerLineService = require('../services/powerLineService');
var crypto = require('../utils/cryptoUtil');
var converter = require('../utils/converterUtil');

exports.addGet = function(req, res) {
    if (req.params.id == null){
        res.render('powerLine/add');
    }
    else {
        var data = crypto.rsaPrivateDecrypt(
            converter.stringToBuffer(
                converter.urlToBase64(req.params.id),
                'base64'
            ), 'ascii');
        var dataList = data.split(',');
        var powerLine = {
            no: dataList[0],
            modelNo: dataList[1],
            voltageClass: dataList[2],
            repairDay: dataList[3],
            maintainDay: dataList[4],
            designYear: dataList[5],
            runningState: dataList[6],
            province: dataList[7],
            location: {
                startLongitude: dataList[8],
                startLatitude: dataList[9],
                endLongitude: dataList[10],
                endLatitude: dataList[11]
            }
        };
        res.json(powerLine);
    }
    
};

exports.addPost = function(req, res) {
    powerLineService.add(req.body, function(result) {
        // res.render('powerLine/add', {'message': result});
        // res.redirect('/');
        res.end();
    });
};

exports.listPowerLineGet = function(req, res) {
    var powerline = req.query;
    if (powerline.no != null && powerline.no != '') {
        powerline.no = crypto.rsaPrivateDecrypt(
            converter.stringToBuffer(
                converter.urlToBase64(powerline.no),
                'base64'
            ), 'ascii');
    }
    powerLineService.list(powerline, function(result) {
        if (result) {
            res.json(result);
        }
        else {
            res.end();
        }
    });
};

exports.removePost = function(req, res) {
    powerLineService.remove(function(result) {
        res.send(result);
        res.end();
    });
};

exports.positionGet = function(req, res) {
    res.render('powerLine/position');
};

exports.listGet = function(req, res) {
    res.render('powerLine/list');
};

exports.detailGet = function(req, res) {
    res.render('powerLine/detail');
};

exports.updateOperationParameterPost = function (req, res) {
    powerLineService.updateOperationParameter(req.body, function(result) {
        res.send(result);
        res.end();
    });
}