var session = require('../utils/sessionUtil');

exports.indexGet = function(req, res) {
    session.get(req, 'username', function(err, reply) {
        if(reply) {
            res.render('index', {'message': 'welcome ' + reply});
        }
        else {
            res.render('index', {'message': 'welcome user'});
        }
    });
};