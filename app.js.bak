var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var session = require('./utils/sessionUtil');
var https = require('https');
var fs = require('fs');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

// var NODE_ENV = process.env.NODE_ENV || 'production';
var appName = 'PLIM';

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

var options = {
     key: fs.readFileSync(config.httpsConfig.privateKeyPath),
     cert: fs.readFileSync(config.httpsConfig.publicKeyPath)
};

if (config.numCPUs > 0 && config.numCPUs <= numCPUs) {
    numCPUs = config.numCPUs;
}

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});

if (cluster.isMaster) {
	process.title = appName + ' master';
	console.log(process.title, 'started'); // 根据 CPU 个数来启动相应数量的 worker 
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	process.on('SIGHUP', function() { // master 进程忽略 SIGHUP 信号 
	});
	cluster.on('death', function(worker) {
		console.log(appName, 'worker', '#' + worker.pid, 'died');
		cluster.fork();
	});
} else {
	process.title = appName + ' worker ' + process.env.NODE_WORKER_ID;
	console.log(process.title, '#' + process.pid, 'started');
	process.on('SIGHUP', function() { // 接收到 SIGHUP 信号时，关闭 worker 
		process.exit(0);
	});
    var serverHttp = app.listen(config.httpPort, function() {
        var host = serverHttp.address().address;
        var port = serverHttp.address().port;
        console.log('http listen start ! host: ' + host + ', port: ' + port);
        
        //init
        // var initDAO = require('./dao/initDAO');
        // initDAO.addRunningState();
        // initDAO.addRegionData();
        // initDAO.addVoltageClassData();
        // initDAO.addPowerLineData();
        
        // var baseDataDAO = require('./dao/baseDataDAO');
        // baseDataDAO.findDbRef();
    });

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
}