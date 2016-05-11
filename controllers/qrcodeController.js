var crypto = require('../utils/cryptoUtil');
var converter = require('../utils/converterUtil');

exports.analyseGet = function(req, res) {
    var qrcode = req.params.id;
    if (qrcode == null || qrcode == '') {
        res.redirect('/#/app/maintain/list');
    }
    else {
        var type = qrcode.substring(0, 5);
        var code = qrcode.substring(5);
        switch(type) {
            // add powerline
            case('APLXX'): res.redirect('/#/app/addPowerLine/' + code);
            // get powerline
            case('GPLXX'): res.redirect('/#/app/powerline/powerline/' + code);
        }
    }
};

exports.encryptGet = function(req, res) {
    var encrypt = converter.base64ToUrl(
        crypto.rsaPublicEncrypt(
            req.params.id,
            'base64'
    ));
    res.send(encrypt);
    res.end();
};

exports.decryptGet = function(req, res) {
    var decrypt = crypto.rsaPrivateDecrypt(
        converter.stringToBuffer(
            converter.urlToBase64(req.params.id),
            'base64'
        ), 'ascii');
    res.send(decrypt);
    res.end();
};