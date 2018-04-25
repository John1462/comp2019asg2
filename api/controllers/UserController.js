/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    login: function (req, res) {

        if (req.method == "GET")
            return res.view('user/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {

                if (user == null)
                    return res.send("No such user");

                // Load the bcrypt module
                var bcrypt = require('bcrypt');

                // Generate a salt
                var salt = bcrypt.genSaltSync(10);

                //  if (user.password != req.body.password)
                if (!bcrypt.compareSync(req.body.password, user.password))
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {

                    console.log("The new session id is " + req.session.id + ".");

                    req.session.username = req.body.username;
                    req.session.role = user.role;
                    req.session.coin = user.coin;
                    req.session.pid = user.id;

                    return res.send("login successfully.");

                });
            });
        }
    },

    logout: function (req, res) {

        console.log("The current session id " + req.session.id + " is going to be destroyed.");

        req.session.destroy(function (err) {
            return res.redirect('/');
        });
    },


    showcoupons: function (req, res) {

        User.findOne(req.params.id).populate('qpon').sort('createTime').exec(function (err, model) {
            if (model == null) return res.redirect("/");

            //console.log(model.qpon.length);

            return res.view('user/showcoupons', { 'user': model.qpon });
            // return res.json(model.isFor);

        });
    },
    addqpon: function (req, res) {
        
            User.findOne(req.params.id).exec( function (err, model) {
                
              // if(req.params.id:model.qpon.id)

                if (model !== null) {
                    model.qpon.add(req.query.pid);
                    model.coin -= model.qpon.coin;
                    model.save();
                    return res.redirect('/');
                }
                else {
                    return res.send("Fail to add it!");
                }
            });
        },
};

