var powerLineService = require('../services/powerLineService');

exports.addGet = function(req, res) {
    res.render('powerLine/add', {'message': ''});
};
exports.addPost = function(req, res) {
    powerLineService.add(req.body, function(result) {
        // res.render('powerLine/add', {'message': result});
        // res.redirect('/');
        res.end();
    });
};

exports.listGet = function(req, res) {
    powerLineService.list(req.query.provinceNo, function(result) {
        if (result) {
            res.json(result);
        }
        else {
            res.end();
        }
    });
};

exports.showGet = function(req, res) {
    res.render('powerLine/show', {'message': ''});
};