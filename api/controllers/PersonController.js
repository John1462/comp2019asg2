/**
 * PersonController
 *
 * @description :: Server-side logic for managing People
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    // create function
    create: function (req, res) {
        if (req.method == "POST") {
            Person.create(req.body.Person).exec(function (err, model) {
                res.redirect('/');
            });
        } else {
            return res.view('person/create');
        }
    },
    // json function
    json: function (req, res) {
        Person.find().exec(function (err, persons) {
            return res.json(persons);
        });
    },
    // index function
    index: function (req, res) {
        Person.find().exec(function (err, persons) {
            return res.view('person/index', { 'persons': persons });
        });
    },


    home: function (req, res) {
        const qPage = req.query.page || 1;

        Person.find().where({ district: "HKIsland" }).sort("createTime").paginate({ page: 1, limit: 2 }).exec(function (err, hk) {
            Person.find().where({ district: "Kowloon" }).sort("createTime").paginate({ page: 1, limit: 2 }).exec(function (err, kowloon) {
                Person.find().where({ district: "New Territories" }).sort("createTime").paginate({ page: 1, limit: 2 }).exec(function (err, nt) {
                    // Person.count().exec(function (err, value) {
                    return res.view('homepage', { 'hk': hk, 'kowloon': kowloon, 'nt': nt });
                    // });
                });
            });
        });
    },

    mycoupons: function (req, res) {


        Person.find().populate('isFor').where().sort("createTime").exec(function (err, persons) {
            return res.view('person/mycoupons', { 'persons': persons });
        });
    },

    showmember: function (req, res) {
        
                Person.findOne(req.params.id).populate('isFor').sort('createTime').exec(function (err, model) {
                    if (model == null) return res.redirect("/");
                    
                            console.log(model.isFor.length);
        
                            return res.view('person/showmember', { 'persons': model.isFor});
                           // return res.json(model.isFor);
                    
                });
            },

    // view function
    view: function (req, res) {
        Person.findOne(req.params.id).populateAll().exec(function (err, persons) {
            return res.view('person/view', { 'persons': persons });
        });
    },

    // delete function
    delete: function (req, res) {
        Person.findOne(req.params.id).exec(function (err, model) {
            if (model != null) {
                model.destroy();
                Person.find().exec(function (err, persons) {
                    return res.view('person/index', { 'persons': persons });
                });
            } else {
                return res.send("Not found");
            }
        });
    },

    // update function
    update: function (req, res) {
        if (req.method == "GET") {
            Person.findOne(req.params.id).exec(function (err, model) {
                if (model == null)
                    return res.send("No such one!");
                else
                    return res.view('person/update', { 'persons': model });
            });
        } else {
            Person.findOne(req.params.id).exec(function (err, model) {
                model.title = req.body.Person.title;
                model.restaurant = req.body.Person.restaurant;
                model.district = req.body.Person.district;
                model.mall = req.body.Person.mall;
                model.image = req.body.Person.image;
                model.coin = req.body.Person.coin;
                model.deal = req.body.Person.deal;
                model.quota = req.body.Person.quota;
                model.details = req.body.Person.details;
                model.save();
                res.redirect('/');
            });
        }
    },

    // search function
    search: function (req, res) {
        const qPage = req.query.page || 1;
        const qDist = req.query.district || "";
        const qDate = req.query.date || "";
        const qCoins = req.query.range || "";
        const arr = qCoins.split(";");
        const qSmall = arr[0];
        const qLarge = arr[1];
        if (qDist == "all") {
            Person.find()
                .where({ district: { '!': [qDist] } })
                .sort("createTime")
                .paginate({ page: 1, limit: 2 })
                .exec(function (err, persons) {
                    Person.count().exec(function (err, value) {
                        var pages = Math.ceil(value / 2);
                        return res.view('person/search', { 'persons': persons, 'count': pages });
                    });
                })
        } else {
            if (qCoins == "") {
                if (qDate == "") {
                    Person.find().where({ district: { contains: qDist } }).sort('createTime')
                        .paginate({ page: qPage, limit: 2 })
                        .exec(function (err, persons) {
                            Person.count().where({ district: { contains: qDist } }).sort('createTime').exec(function (err, value) {
                                var pages = Math.ceil(value / 2);
                                return res.view('person/search', { 'persons': persons, 'count': pages });
                            });
                        });

                } else {
                    Person.find().where({ district: { contains: qDist } })
                        .where({ deal: { '<=': qDate } }).sort('createTime')
                        .paginate({ page: qPage, limit: 2 })
                        .exec(function (err, persons) {
                            Person.count().where({ district: { contains: qDist } })
                                .where({ deal: { '<=': qDate } }).sort('createTime').exec(function (err, value) {
                                    var pages = Math.ceil(value / 2);
                                    return res.view('person/search', { 'persons': persons, 'count': pages });
                                });
                        });
                }
            } else {
                if (qDate == "") {
                    Person.find().where({ district: { contains: qDist } })
                        .where({ coin: { '<=': qLarge, '>=': qSmall } })
                        .sort('createTime')
                        .paginate({ page: qPage, limit: 2 })
                        .exec(function (err, persons) {
                            Person.count().where({ district: { contains: qDist } })
                                .where({ coin: { '<=': qLarge, '>=': qSmall } })
                                .sort('createTime')
                                .exec(function (err, value) {
                                    var pages = Math.ceil(value / 2);
                                    return res.view('person/search', { 'persons': persons, 'count': pages });
                                });
                        });
                } else {
                    Person.find().where({ district: { contains: qDist } })
                        .where({ coin: { '<=': qLarge, '>=': qSmall } })
                        .where({ deal: { '>=': qDate } })
                        .sort('createTime')
                        .paginate({ page: qPage, limit: 2 })
                        .exec(function (err, persons) {
                            Person.count().where({ district: { contains: qDist } })
                                .where({ coin: { '<=': qLarge, '>=': qSmall } })
                                .where({ deal: { '>': qDate } })
                                .sort('createTime').exec(function (err, value) {
                                    var pages = Math.ceil(value / 2);
                                    return res.view('person/search', { 'persons': persons, 'count': pages });
                                });
                        });
                }
            }
        }
    },



};

