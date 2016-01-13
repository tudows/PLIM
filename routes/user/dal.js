var User = require('./schema.js');
exports.create = function(data, callback){
    var user = new User({
        Name: data.name
    });
    user.save(function(err, user){
        if(!err){
            callback(null, user);
        } else {
            callback(err, null);
        }
    });
};