var path = require('path');
var appDir = path.dirname(require.main.filename);
const fs = require('fs');
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const config = require('../config/config');
const User = require('../app/models/user')

module.exports = function (app, passport) {


    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: '/login' }),
        function(req, res) {
            console.log("/auth/facebook/callback");
            console.dir(req.user._doc);

            let data = req.user._doc

            User.findOneAndUpdate({ _id: data._id },{$set: {user_public_folder: data.user_public_folder}}, function(err){
                if(err) throw err;
                req.session.user = data;
                res.redirect('/');
            });

        });

/*    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });*/

    passport.use(new FacebookStrategy({
            clientID: config.facebook_api_key,
            clientSecret:config.facebook_api_secret ,
            callbackURL: config.callback_url,
            profileFields: ['email','gender','location','name', 'photos']
        },
        function(accessToken, refreshToken, profile, done) {

            User.findOne({ facebook_id: profile.id }, async function (err, user) {
                if(err) throw err

                if(user){

                    let updateInfo = {
                        access_token: accessToken,
                    };

                    if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                        updateInfo["image"] = profile.photos[0].value;
                    }
                    updateInfo["full_name"] = profile._json.first_name + " " + profile._json.last_name
                    User.findOneAndUpdate({ facebook_id: profile.id },{$set: updateInfo}, function(err){
                        if(err) throw err;
                        user.access_token = accessToken;
                        return done(null, user);
                    });
                }else{
                    let userinfo = {
                        full_name: profile._json.first_name + " " + profile._json.last_name,
                        created_date: new Date(),
                        facebook_id: profile._json.id,
                        access_token: accessToken
                    }

                    if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                        userinfo["avatar"] = profile.photos[0].value;
                    }

                    if (profile.gender)  {
                        userinfo["gender"] = profile.gender;
                    }

                    if (profile._json.email)  {
                        userinfo["email"] = profile._json.email;
                    }

                    if(profile._json.location){
                        userinfo.address = profile._json.location.name
                    }

                    let data = new User(userinfo)
                    data.save(function(err){
                        if(err) throw err
                        try {
                            if (!fs.existsSync(appDir + "/public/uploads/")) {
                                fs.mkdirSync(appDir + "/public/uploads/" );
                            }

                            if (!fs.existsSync(appDir + "/public/users/")) {
                                fs.mkdirSync(appDir + "/public/users/" );
                            }

                            let user_public_folder = "/public/users/" + data._id;
                            //Crate folder for temp
                            if (!fs.existsSync(appDir + user_public_folder)) {
                                fs.mkdirSync(appDir + user_public_folder);
                            }

                        }catch(ex) {
                            console.log("can't create user folder: " + data._id);
                            console.log("Err: " + ex);
                        }

                        return done(null, data)
                    })
                }
            });
        }
    ));
}