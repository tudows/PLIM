var mongoose = require('mongoose');
var uri = 'mongodb://localhost:27017/PLI';
var options = {
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};

// Build the connection string

console.log('连接数据库。。。');
// Create the database connection
mongoose.connect(uri, options);
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('数据库连接成功');
});
// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('数据库连接失败：' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('数据库连接断开');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('进程终止，数据库连接断开');
        process.exit(0);
    });
});

module.exports = mongoose;