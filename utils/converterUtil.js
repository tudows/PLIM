module.exports.base64ToUrl = function(base64Str) {
    return base64Str.replace(/[\/]/g, '%7C');
};

module.exports.urlToBase64 = function(urlStr) {
    return urlStr.replace(/[|]/g, '/').replace(/[ ]/g, '+');
};

module.exports.stringToBuffer = function(str, encode) {
    var len = Buffer.byteLength(str, encode);
    var buffer = new Buffer(len);
    buffer.write(str, 0, len, encode);
    return buffer;
};