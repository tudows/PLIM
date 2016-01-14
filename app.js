var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var app = express();

// var indexController = require('./routes/indexController');
// var userController = require('./routes/userController');

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(favicon('public/images/favicon.png'));

// app.use('/user', userController);
// app.use('/', indexController);
require('./route')(app, express);

var server = app.listen(777, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen start ! host: ' + host + ', port: ' + port);
});