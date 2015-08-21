/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var md5 = require('MD5');
var mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('dzbY2mySNE_Zsqr3hsK70A');
module.exports = {
    adminlogin: function (data, callback) {
        var exit = 0;
        var exitup = 0;
        data.password = md5(data.password);
        sails.query(function (err, db) {
            if (db) {
                exit++;
                db.collection('user').find({
                    email: data.email,
                    password: data.password,
                    accesslevel: "admin"
                }, {
                    password: 0,
                    forgotpassword: 0
                }).each(function (err, found) {
                    if (err) {
                        callback({
                            value: "false"
                        });
                        console.log(err);
                    }
                    if (found != null) {
                        exitup++;
                        callback(found);
                    } else {
                        if (exit != exitup) {
                            callback({
                                value: "false"
                            });
                        }
                    }
                });
            }
            if (err) {

            }
        });
    },
    save: function (data, callback) {
        data.password = md5(data.password);
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
                if (db) {
                    exit++;
                    db.collection("user").find({
                        "email": data.email
                    }).each(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (data2 != null) {
                            exitup++;
                            callback({
                                value: false
                            });
                        } else {
                            if (exit != exitup) {
                                var cuser = db.collection('user').insert(data, function (err, created) {
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
                            }
                        }
                    });
                }
            });
        } else {
            sails.query(function (err, db) {
                var user = sails.ObjectID(data._id);
                delete data._id
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    var cuser = db.collection('user').update({
                        _id: user
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
        var accesslevel = data.accesslevel;
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        var sortnum = parseInt(data.sort);
        var sort = {};
        sort[data.filter] = sortnum;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({
                    $or: [{
                        name: {
                            '$regex': check
                        }
                }, {
                        email: {
                            '$regex': check
                        }
                }],
                    accesslevel: accesslevel
                }, function (err, number) {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    newcallback++;
                    if (newcallback == 2) {
                        callback(newreturns);
                    }

                });
                db.collection("user").find({
                    $or: [{
                        name: {
                            '$regex': check
                        }
                }, {
                        email: {
                            '$regex': check
                        }
                }],
                    accesslevel: accesslevel
                }, {
                    password: 0,
                    forgotpassword: 0
                }, {
                    sort: sort
                }).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
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
                db.collection("user").find({}, {
                    password: 0,
                    forgotpassword: 0
                }).each(function (err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
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
    findbyletter: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        data.search = "^" + data.search;
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
                db.collection("user").count({
                    "name": check,
                    "accesslevel": "artist"
                }, function (err, number) {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    newcallback++;
                    if (newcallback == 2) {
                        callback(newreturns);
                    }

                });
                db.collection("user").find({
                    "name": check,
                    "accesslevel": "artist"
                }, {
                    password: 0,
                    forgotpassword: 0
                }).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
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
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": sails.ObjectID(data._id)
                }, {
                    password: 0,
                    forgotpassword: 0
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        delete data.password;
                        callback(data);
                    }
                });
            }
        });
    },
    searchmail: function (data, callback) {
        var exit = 0;
        var exitup = 0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                exit++;
                db.collection("user").find({
                    "email": data.email
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        exitup++;
                        callback({
                            value: true
                        });
                    } else {
                        if (exit != exitup) {
                            callback({
                                value: false
                            });
                        }
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
            var cuser = db.collection('user').remove({
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
    login: function (data, callback) {
        var exitup = 0;
        var exit = 0;
        var exitdown = 0;
        data.password = md5(data.password);
        sails.query(function (err, db) {
            db.collection('user').find({
                email: data.email,
                password: data.password
            }, {
                password: 0
            }).each(function (err, found) {
                exitup++;
                if (err) {
                    callback({
                        value: false
                    });
                    console.log(err);
                }
                if (found != null) {
                    if (found.forgotpassword) {
                        db.collection('user').update({
                            email: data.email,
                            password: data.password
                        }, {
                            $set: {
                                forgotpassword: ""
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                        });
                    }
                    delete found.forgotpassword;
                    callback(found);
                } else {
                    db.collection('user').find({
                        email: data.email,
                        forgotpassword: data.password
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).each(function (err, found) {
                        exit++;
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                        }
                        if (found != null) {
                            callback(found);
                            sails.ObjectID(data._id);
                            db.collection('user').update({
                                email: data.email
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: data.password
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                }
                            });
                        } else {
                            exitdown++;
                            if (exit == exitup == exitdown) {
                                callback({
                                    value: false
                                });
                            }
                        }
                    });
                }
            });
        });
    },
    changepassword: function (data, callback) {
        data.password = md5(data.password);
        var user = sails.ObjectID(data._id);
        var newpass = md5(data.editpassword);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (data.editpassword == "") {
                callback({
                    value: false
                });
            }
            if (data.editpassword != "") {
                db.collection('user').update({
                    "_id": user,
                    "email": data.email,
                    "password": data.password
                }, {
                    $set: {
                        "password": newpass
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        if (updated.result.nModified == 1) {
                            callback({
                                value: true
                            });
                        } else {
                            callback({
                                value: true
                            });
                        }
                    }
                });
            }
        });
    },
    forgotpassword: function (data, callback) {
        var exit = 0;
        var exitup = 0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                exit++;
                db.collection('user').find({
                    email: data.email
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        exitup++;
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 8; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        var encrypttext = md5(text);
                        sails.query(function (err, db) {
                            var user = sails.ObjectID(data._id);
                            db.collection('user').update({
                                email: data.email
                            }, {
                                $set: {
                                    forgotpassword: encrypttext
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });

                                }
                                if (updated) {
                                    var template_name = "Aura Art";
                                    var template_content = [{
                                        "name": "aura-art",
                                        "content": "aura-art"
    }]
                                    var message = {
                                        "from_email": "vigneshkasthuri2009@gmail.com",
                                        "from_name": "Wohlig",
                                        "to": [{
                                            "email": data.email,
                                            "type": "to"
        }],
                                        "global_merge_vars": [
                                            {
                                                "name": "password",
                                                "content": text
  }
]
                                    };
                                    mandrill_client.messages.sendTemplate({
                                        "template_name": template_name,
                                        "template_content": template_content,
                                        "message": message
                                    }, function (result) {
                                        callback({
                                            value: true
                                        });
                                    }, function (e) {
                                        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                    });
                                }
                            });
                        });
                    } else {
                        if (exit != exitup) {
                            callback({
                                value: false
                            });
                        }
                    }
                });
            }
        });
    },
    countusers: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({}, function (err, number) {
                    if (number != null) {
                        callback(number);
                    }
                });
            }
        });
    },
    findimage: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").find({}, {}).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
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
    countusers: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({}, function (err, number) {
                    if (number != null) {
                        callback(number);
                    }
                    console.log(number);
                });
            }
        });
    },
    countartwork: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$artwork"
                    },
                    {
                        $match: {
                            "artwork.name": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
                    if (result[0]) {
                        callback(result[0].count);
                    }
                    if (!result[0]) {
                        callback(0);
                    }
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                });
            }
        });
    }
};