var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var session = require('./utils/sessionUtil');
var https = require('https');
var fs = require('fs');

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

//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();  
});

require('./utils/routeUtil')(app, express);

var config = require('./config/globalConfig.json');

var serverHttp = app.listen(config.httpPort, function() {
    var host = serverHttp.address().address;
    var port = serverHttp.address().port;
    console.log('http listen start ! host: ' + host + ', port: ' + port);
    
    //init
    // var initDAO = require('./dao/initDAO');
    // initDAO.addRegionData();
    // initDAO.addPowerLineData();
    // initDAO.addVoltageClassData();
    
});


var options = {
     key: fs.readFileSync(config.httpsConfig.privateKeyPath),
     cert: fs.readFileSync(config.httpsConfig.publicKeyPath)
};

var serverHttps = https.createServer(options, app).listen(config.httpsPort, function () {
    var host = serverHttps.address().address;
    var port = serverHttps.address().port;
    console.log('https listen start ! host: ' + host + ', port: ' + port);
    
    // var opt = {
    //     host:'api.map.baidu.com',
    //     method:'GET',
    //     path:'/geoconv/v1',
    //     headers:{}
    // }
    // var req = http.request(opt, function(res) {
    //     res.on('data', function(data){
    //         console.log(data);
    //     }).on('end', function(){
    //         console.log('end');
    //     });
    // }).on('error', function(e) {
    //     console.log("Got error: " + e.message);
    // })
    // data = {
    //     coords: '114.21892734521,29.575429778924;114.21892734521,29.575429778924',
    //     sn: 'eWCqKxtRe4wef5V4t7HeVRdXDgf0oQpq',
    //     ak: 'pYy1xlv85GnjPlmsCb0hl5v21e6jYtVV'};
    // req.write(require('querystring').stringify(data));
    // req.end();
});