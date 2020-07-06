var mongoose = require('mongoose');

//define schema
var SongsReview = mongoose.Schema({
	songname: String,
	singger: String,
	songid: String,
	datecreated: Date
});

//create model
module.exports = mongoose.model('songsreview', SongsReview, 'songsreview');