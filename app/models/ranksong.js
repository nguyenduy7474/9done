var mongoose = require('mongoose');

//define schema
var RankSong = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	songname: String,
	singername: String,
	lengthsong: Number,
	songid: String,
	pathsong: String,
	countlisten: Number,
	datecreated: Date
});

//create model
module.exports = mongoose.model('ranksong', RankSong, 'ranksong');