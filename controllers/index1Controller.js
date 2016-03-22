var session = require('../utils/sessionUtil');

exports.indexGet = function(req, res) {
    session.get(req, 'username', function(err, reply) {
        if(reply) {
            res.render('index1', {'message': 'welcome ' + reply});
        }
        else {
            res.render('index1', {'message': 'welcome user'});
        }
    });
};