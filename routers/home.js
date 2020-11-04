var path = require('path');
var appDir = path.dirname(require.main.filename);
var home = require('../app/controllers/home');
var Multer  = require('multer')
const fs = require('fs');
const upload = Multer();
const passport = require('passport');
const FacebookStrategy  = require('passport-facebook').Strategy;
const config = require('../config/config');
const User = require('../app/models/user')
var dateFormat = require('dateformat');
var UserController = require('../app/controllers/usercontroller')

var storage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

const uploadImage = Multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});


module.exports = function (app, passport) {
    app.get('/', home.checkLogin, home.home);
    app.get('/acceptsongs', home.checkLogin, home.acceptSongs);
    //show bai viet
    app.get('/posts', home.checkLogin, home.showBaiViet);
    app.get('/post-detail/:slug', home.checkLogin, home.showBaiVietChiTiet);
    app.post('/getallposts', home.checkLogin, home.getAllPosts);
    app.post('/getpostbyslug', home.checkLogin, home.getPostBySlug);

    app.post('/searchsongs', home.searchSongs);
    app.post('/uploadtorank', home.checkLogin, home.uploadToRank);
    app.post('/getallsongsreview', home.getAllSongsReview);
    app.post('/uploadsing', upload.any("audio_data"), home.uploadSing)
    app.post('/addnewsongreview', home.checkLogin, home.addNewSongReview);
    app.post('/getuserinfo', home.checkLogin, UserController.getUserinfo);
    app.post('/imageforaudio', uploadImage.single("imageforaudio"), home.ImageForAudio);
    app.post('/checktogettypevideo', home.checkToGetTypeVideo);

    app.post('/changeeffectrecord', home.changeEffectRecord);
    app.post('/effectdone', home.effectDone);
}
