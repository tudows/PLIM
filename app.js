var express = require('express');
var app = express();
//var router = require('./routes');
var user = require('./routes/user');

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'));

//app.use('/', router);
app.use('/user', user);

var server = app.listen(777, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen start ! port:777');
});