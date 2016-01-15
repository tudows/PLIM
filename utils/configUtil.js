var fs = require('fs');
var path = require('path');

var cache = {};

module.exports.getConfigs = function (cfgFileName) {
    cfgFileName = 'config/' + cfgFileName;
    if (!cache[cfgFileName]) {
        if (!process.env.cloudDriveConfig) {
            process.env.cloudDriveConfig = path.join(process.cwd(), cfgFileName);
        }
        if (fs.existsSync(process.env.cloudDriveConfig)) {
            var contents = fs.readFileSync(
                process.env.cloudDriveConfig, {encoding: 'utf-8'});
            cache[cfgFileName] = JSON.parse(contents);
        }
    }
    return cache[cfgFileName];
};