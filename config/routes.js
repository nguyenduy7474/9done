var home = require('../app/controllers/home');
var Multer  = require('multer')
const fs = require('fs');

const upload = Multer();


module.exports = function (app, passport) {
    app.get('/', home.home);
    app.get('/acceptsongs', home.acceptSongs);

    app.post('/searchsongs', home.searchSongs);
    app.post('/uploadtorank', home.uploadToRank);
    app.post('/getallsongsreview', home.getAllSongsReview);
    app.post('/uploadsing', upload.any("audio_data"), home.uploadSing)
    app.post('/addnewsongreview', home.addNewSongReview);
}
