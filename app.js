/// <reference path="typings/my/node&express.d.ts" />

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

// if (cluster.isMaster) {
// 	process.title = appName + ' master';
// 	console.log(process.title, 'started'); // 根据 CPU 个数来启动相应数量的 worker 
// 	for (var i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	process.on('SIGHUP', function() { // master 进程忽略 SIGHUP 信号 
// 	});
// 	cluster.on('death', function(worker) {
// 		console.log(appName, 'worker', '#' + worker.pid, 'died');
// 		cluster.fork();
// 	});
// } else {
// 	process.title = appName + ' worker ' + process.env.NODE_WORKER_ID;
// 	console.log(process.title, '#' + process.pid, 'started');
// 	process.on('SIGHUP', function() { // 接收到 SIGHUP 信号时，关闭 worker 
// 		process.exit(0);
// 	});
//     var serverHttp = app.listen(config.httpPort, function() {
//         var host = serverHttp.address().address;
//         var port = serverHttp.address().port;
//         console.log('http listen start ! host: ' + host + ', port: ' + port);
//     });

//     var serverHttps = https.createServer(options, app).listen(config.httpsPort, function () {
//         var host = serverHttps.address().address;
//         var port = serverHttps.address().port;
//         console.log('https listen start ! host: ' + host + ', port: ' + port);
//     });
// }

var serverHttp = app.listen(config.httpPort, function() {
    var host = serverHttp.address().address;
    var port = serverHttp.address().port;
    console.log('http listen start ! host: ' + host + ', port: ' + port);
});

var serverHttps = https.createServer(options, app).listen(config.httpsPort, function () {
    var host = serverHttps.address().address;
    var port = serverHttps.address().port;
    console.log('https listen start ! host: ' + host + ', port: ' + port);
});

var powerLineJob = require('./jobs/powerLineJob');
powerLineJob.updateEnvironment(1000 * 60, function (result) {});
powerLineJob.randomOperationParameter(1000, function (result) {});
powerLineJob.maintainAnalyze(1000, function (result) {});
powerLineJob.maintainArrange(1000, function (result) {});

// require('./dao/initDAO').user();