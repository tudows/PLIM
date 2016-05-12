var callfile = require('child_process');

exports.healthyAnalyze = function (callback) {
    callfile.execFile('shell/hadoop.sh', [], null, function (err, stdout, stderr) {
        callback();
    });
};

var intervals = [];
exports.run = function () {
    exports.healthyAnalyze(function (result) {});
    intervals.push(setInterval(function () {
        exports.healthyAnalyze(function (result) {});
    }, 1000 * 60 * 10));
};

exports.stop = function () {
    intervals.forEach(function (interval) {
        clearInterval(interval);
    });
    intervals = [];
}