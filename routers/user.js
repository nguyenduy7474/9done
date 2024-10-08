var path = require('path');
var appDir = path.dirname(require.main.filename);
var home = require('../app/controllers/home');
var Multer  = require('multer')

var UserController = require('../app/controllers/usercontroller')

module.exports = function (app, passport) {
    app.get('/user/:fbid', home.checkLogin, UserController.userPage);
    app.post('/reactvideo', home.checkLogin, UserController.reactVideo);
    app.get('/logout', home.checkLogin, UserController.logOut);

    app.post('/infovideosongusersing', UserController.infoSongUserSing);

}
