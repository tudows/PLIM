var crypto = require('crypto');
var fs = require('fs');
var config = require('../config/globalConfig.json');

var keys = {
    privateKey: fs.readFileSync(config.httpsConfig.privateKeyPath).toString('ascii'),
    publicKey: fs.readFileSync(config.httpsConfig.publicKeyPath).toString('ascii')
};

module.exports.rsaPrivateDecrypt = function(buffer, encode) {
    var dedata = crypto.privateDecrypt({
        key: keys.privateKey,
        passphrase: 'rrabbit',
        padding: crypto.RSA_PKCS1_PADDING
    }, buffer);
    if (encode == null) {
        return dedata;
    }
    else {
        return dedata.toString(encode);
    }
};

module.exports.rsaPublicEncrypt = function(str, encode) {
    var endata = crypto.publicEncrypt(
        { key: keys.publicKey },
        new Buffer(new Buffer(str))
    );
    if (encode == null) {
        return endata;
    }
    else {
        return endata.toString(encode);
    }
};

module.exports.random = function(len, encode) {
    return crypto.randomBytes(len).toString(encode);
};


module.exports.sha256 = function(str, salt, encode) {
    return crypto.pbkdf2Sync(str, salt, 100000, 256, 'sha256').toString(encode);
};