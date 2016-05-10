/// <reference path='../typings/my/node&express.d.ts' />

var PowerLine = require('../models/powerLine');
var VoltageClassUnit = require('../models/voltageClassUnit');
var VoltageClass = require('../models/voltageClass');
var OperationParameter = require('../models/operationParameter');
var StandardOperationParameter = require('../models/standardOperationParameter');
var RunningState = require('../models/runningState');
var Province = require('../models/province');
var async = require('async');

exports.find = function(data, callback) {
    if (data.powerLine == null) {
        data.powerLine = {};
    }
    
    async.parallel([
        function (_callback) {
            if (data.standardOperationParameter != null) {
                StandardOperationParameter.find(data.standardOperationParameter, '_id', function (err, standardOperationParameters) {
                    if (!err) {
                        data.powerLine.standardOperationParameter = { $in: standardOperationParameters };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.operationParameter != null) {
                OperationParameter.find(data.operationParameter, '_id', function (err, operationParameters) {
                    if (!err) {
                        data.powerLine.operationParameter = { $in: operationParameters };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.voltageClass != null) {
                VoltageClass.find(data.voltageClass, '_id', function (err, voltageClasses) {
                    if (!err) {
                        data.powerLine.voltageClass = { $in: voltageClasses };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.runningState != null) {
                RunningState.find(data.runningState, '_id', function (err, runningStates) {
                    if (!err) {
                        data.powerLine.runningState = { $in: runningStates };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.province != null) {
                Province.find(data.province, '_id', function (err, provinces) {
                    if (!err) {
                        data.powerLine.province = { $in: provinces };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
    ], function (err, results) {
        if (results.length == 5) {
            PowerLine.find(data.powerLine)
            .populate('standardOperationParameter')
            .populate('operationParameter')
            .populate('voltageClass')
            .populate('runningState')
            .populate('province')
            .exec(function(err, powerLines) {
                if(!err) {
                    VoltageClassUnit.populate(powerLines, {
                        path: 'voltageClass.unit'
                    }, function (_err, _result) {
                        if (!_err) {
                            callback(null, _result);
                        } else {
                            callback(_err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
        }
    });
};

exports.addPowerLine = function(data, callback) {
    data.save(function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.addStandardOperationParameter = function(data, callback) {
    data.save(function(err, result) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.addOperationParameter = function(data, callback) {
    data.save(function(err, result) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.remove = function(data, callback) {
    PowerLine.remove(data, function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
    OperationParameter.remove(data, function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.updateOperationParameter = function(query, set, callback) {
     OperationParameter.update(query, set, function (err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.update = function (data, populateSet, callback) {
    if (data.set == null) {
        data.set = { $set: {} };
    }
    async.parallel([
        function (_callback) {
            if (populateSet.runningState != null) {
                RunningState.findOne(populateSet.runningState, '_id', function (err, runningState) {
                    if (!err) {
                        data.set.$set.runningState = runningState;
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        }
    ], function (err, results) {
        PowerLine.update(data.query, data.set, function (err, result) {
            if (!err) {
                callback(null, result);
            } else {
                callback(err, null);
            }
        });
    });
};