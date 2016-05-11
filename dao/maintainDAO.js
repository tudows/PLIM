/// <reference path='../typings/my/node&express.d.ts' />

var Maintain = require('../models/maintain');
var MaintainState = require('../models/maintainState');
var MaintainType = require('../models/maintainType');
var PowerLineOperation = require('../models/powerLineOperation');
var PowerLine = require('../models/powerLine');
var RunningState = require('../models/runningState');
var User = require('../models/user');
var async = require('async');
var mongoose = require('mongoose');

exports.find = function(data, callback) {
    if (data.maintain == null) {
        data.maintain = {};
    }
    async.parallel([
        function (_callback) {
            if (data.powerLine != null) {
                PowerLine.find(data.powerLine, '_id', function (err, powerLines) {
                    if (!err) {
                        data.maintain.powerLine = { $in: powerLines };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.maintainUser != null) {
                User.find(data.maintainUser, '_id', function (err, maintainUsers) {
                    if (!err) {
                        data.maintain.maintainUser = { $in: maintainUsers };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.createUser != null) {
                User.find(data.createUser, '_id', function (err, createUsers) {
                    if (!err) {
                        data.maintain.createUser = { $in: createUsers };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.updateUser != null) {
                User.find(data.updateUser, '_id', function (err, updateUsers) {
                    if (!err) {
                        data.maintain.updateUser = { $in: updateUsers };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.maintainState != null) {
                MaintainState.find(data.maintainState, '_id', function (err, maintainStates) {
                    if (!err) {
                        data.maintain.maintainState = { $in: maintainStates };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (data.maintainType != null) {
                MaintainType.find(data.maintainType, '_id', function (err, maintainTypes) {
                    if (!err) {
                        data.maintain.maintainType = { $in: maintainTypes };
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        }
    ], function (err, results) {
        if (results.length == 6) {
            if (data.sort == null) {
                data.sort = { '_id': -1 };
            }
            Maintain.find(data.maintain).sort(data.sort)
            .populate('powerLine')
            .populate('maintainUser')
            .populate('createUser')
            .populate('updateUser')
            .populate('maintainState')
            .populate('maintainType')
            .exec(function(err, maintains) {
                if (!err) {
                    PowerLineOperation.populate(maintains, {
                        path: 'maintainType.powerLineOperation'
                    }, function (_err, _maintains) {
                        if (!err) {
                            callback(null, _maintains);
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

exports.findMaintainType = function (data, callback) {
    MaintainType.find(data).populate('powerLineOperation').exec(function (err, maintainTypes) {
        if (!err) {
            callback(null, maintainTypes);
        } else {
            callback(err, null);
        }
    });
};

exports.findMaintainState = function (data, callback) {
    MaintainState.find(data).exec(function (err, maintainStates) {
        if (!err) {
            callback(null, maintainStates);
        } else {
            callback(err, null);
        }
    });
};

exports.operationPowerLine = function (data, callback) {
    switch (data.code) {
        case 1:
            RunningState.findOne({ code: 2 }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
        case 8:
            var runningStateCode = null;
            if (data.maintainTypeCode == 6) {
                runningStateCode = 4;
            } else if (data.maintainTypeCode == 7) {
                runningStateCode = 3;
            }
            RunningState.findOne({ code: runningStateCode }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
        case 9:
            RunningState.findOne({ code: 5 }, function (err, runningState) {
                if (!err) {
                    PowerLine.update({
                        _id: data._id
                    }, {
                        $set: {
                            runningState: runningState._id
                        }
                    }, function (err, result) {
                        if (!err) {
                            callback(null, result);
                        } else {
                            callback(err, null);
                        }
                    });
                } else {
                    callback(err, null);
                }
            });
            break;
    }
};

exports.add = function(data, callback) {
    data.save(function(err) {
        if(!err) {
            callback(null);
        } else {
            callback(err);
        }
    });
};

exports.findUserMaintainNumber = function(maintainUserId, callback) {
    Maintain.aggregate([
        { $match:  { maintainUser: maintainUserId, maintainState: { $ne: mongoose.Types.ObjectId('573035613982d8481f73dca5') } }},
        { $project: { maintainUser: 1, maintainNumber: 1 } },
        { $group:  { _id: '$maintainUser', maintainNumber: { $sum: 1 } } }
    ]).exec(function (err, maintains) {
        if (!err && maintains.length == 1) {
            callback(null, maintains[0].maintainNumber);
        } else {
            callback(err, 0);
        }
    });
};

exports.update = function(data, populateSet, callback) {
    async.parallel([
        function (_callback) {
            if (populateSet.maintainState != null) {
                MaintainState.findOne(populateSet.maintainState, '_id', function (err, maintainState) {
                    if (!err) {
                        data.set.$set.maintainState = maintainState;
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        },
        function (_callback) {
            if (populateSet.maintainType != null) {
                MaintainType.findOne(populateSet.maintainType, '_id', function (err, maintainType) {
                    if (!err) {
                        data.set.$set.maintainType = maintainType;
                    }
                    _callback(null, '');
                });
            } else {
                _callback(null, '');
            }
        }
    ], function (err, results) {
        if (results.length == 2) {
            Maintain.update(data.query, data.set, function (err, result) {
                if (!err) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        }
    });
};

exports.findMaintainPowerLine = function (maintainUserId, callback) {
    Maintain.aggregate([
        { $match:  { maintainUser: maintainUserId } },
        { $project: { _id: '$powerLine' } }
    ]).exec(function (err, powerLineIds) {
        if (!err) {
            callback(powerLineIds);
        } else {
            callback([]);
        }
    });
};