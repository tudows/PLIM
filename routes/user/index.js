var express = require('express');
var router = express.Router();
var userDAL = require('./dal.js');

router.get('/',function(req, res, next) {
    userDAL.create({"name": "rabbit"}, function(err, result) {
        if (!err) {
            res.render('index', {'message': result.name});
        } else {
            res.render('index', {'message': err});
        }
    });
});

module.exports = router;
