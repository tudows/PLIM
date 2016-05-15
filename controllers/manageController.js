exports.indexGet = function(req, res) {
    res.render('manage/index');
};

exports.videoGet = function(req, res) {
    res.redirect('http://127.0.0.1:3000');
};