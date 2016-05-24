exports.indexGet = function(req, res) {
    res.render('manage/index');
};

exports.videoGet = function(req, res) {
    res.redirect('http://127.0.0.1:3000');
};

exports.searchGet = function(req, res) {
    res.render('manage/search');
};

var Segment = require('segment');
var segment = new Segment();
segment.useDefault();
exports.splitGet = function(req, res) {
    res.json(segment.doSegment(req.query.keyWord));
}