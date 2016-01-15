var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var session = require('./utils/sessionUtil');

var app = express();

app.set('views', './views');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(favicon('public/images/favicon.png'));
app.use(session());

require('./utils/routeUtil')(app, express);

var server = app.listen(777, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen start ! host: ' + host + ', port: ' + port);
    
    //init
    // var initDAO = require('./dao/initDAO');
    // initDAO.addRegionData();
});