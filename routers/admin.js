var AdminPage =      require('../app/controllers/admin');
var home = require('../app/controllers/home');
const User = require('../app/models/user')
var LocalStrategy   = require('passport-local').Strategy;
var Multer  = require('multer')

var storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

var upload = Multer({ storage: storage})


module.exports = function (app, passport) {
    app.get('/duylogin', AdminPage.adminLogin);
    app.get('/manage9done', AdminPage.checkAdmin, AdminPage.manage9Done);

    app.post('/deletesong', AdminPage.checkAdmin, AdminPage.deleteSong);
    app.post('/logout', AdminPage.checkAdmin, AdminPage.logout);
    app.post('/editsong', AdminPage.checkAdmin, AdminPage.editSong);

    //app.post('/getAllSongs', AdminPage.checkAdmin, AdminPage.getAllSongs);
    // process the login form
    app.post('/duyloginadmin', passport.authenticate('local-login', {
        failureRedirect: '/duylogin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }), function(req,res){
        // If user is "root" create cookie for check update
        res.redirect('/manage9done');
    });

    app.get('/adminsongreview', AdminPage.checkAdmin, AdminPage.adminSongReview);
    app.post('/adminadnewsong', AdminPage.checkAdmin, AdminPage.adminAdNewSong);

    app.get('/addnewpostpage', AdminPage.checkAdmin, AdminPage.AddNewPostPage);
    app.get('/manageposts', AdminPage.checkAdmin, AdminPage.manageposts);
    app.post('/getallposts', AdminPage.checkAdmin, AdminPage.getAllPosts);
    app.post('/addnewpost', AdminPage.checkAdmin, AdminPage.AddNewPost);
    app.post('/editpost', AdminPage.checkAdmin, AdminPage.editPost);
    app.post('/deletepost', AdminPage.checkAdmin, AdminPage.deletePost);

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            username : 'username',
            password : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'rootuser' :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata

                //if((user.role != 'root') && (user.role != 'mod'))
                //return done(null, false, req.flash('error', 'Auth not found')); // create the loginMessage and save it to session as flashdata

                //Check and create user folder
                //create User Folder
                // all is well, return successful user
                req.session.user = user;

                return done(null, user);
            });

        }));
}