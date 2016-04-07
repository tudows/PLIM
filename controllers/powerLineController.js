var powerLineService = require('../services/powerLineService');
var crypto = require('../utils/cryptoUtil');
var converter = require('../utils/converterUtil');

exports.addGet = function(req, res) {
    res.render('powerLine/add', {'message': ''});
};
exports.addPost = function(req, res) {
    var powerline = req.body;
    powerline.encrypt = converter.base64ToUrl(crypto.rsaPublicEncrypt(powerline.no, 'base64'));
    powerLineService.add(powerline, function(result) {
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