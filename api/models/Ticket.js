/**
 * Ticket.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function (data, callback) {
        if (data.user) {
            for (var i = 0; i < data.user.length; i++) {
                data.user[i] = sails.ObjectID(data.user[i]);
            }
        }
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                var exit = 0;
                var exitup = 0;
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                var cticket = db.collection('ticket').insert(data, function (err, created) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (created) {
                        callback({
                            value: true
                        });
                    }
                });
            });
        } else {
            sails.query(function (err, db) {
                var ticket = sails.ObjectID(data._id);
                delete data._id
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    var cticket = db.collection('ticket').update({
                        _id: ticket
                    }, {
                        $set: data
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback({
                                value: true
                            });
                        }
                    });
                }
            });
        }
    },
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").count({
                    artist: {
                        '$regex': check
                    }
                }, function (err, number) {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    newcallback++;
                    if (newcallback == 2) {
                        callback(newreturns);
                    }

                });
                db.collection("ticket").find({
                    artist: {
                        '$regex': check
                    }
                }, {}).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                    }
                    if (found != null) {
                        newreturns.data.push(found);
                    } else {
                        if (found == null) {
                            newcallback++;
                            if (newcallback == 2) {
                                callback(newreturns);
                            }
                        }
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({}, {}).each(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                    }
                    if (found != null) {
                        returns.push(found);
                    } else {
                        if (found == null) {
                            callback(returns);
                        }
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").find({
                    "_id": sails.ObjectID(data._id)
                }, {}).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        callback(data);
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cticket = db.collection('ticket').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        });
    },
    countticket: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("ticket").count({}, function (err, number) {
                    if (number != null) {
                        callback(number);
                    }
                });
            }
        });
    }
};