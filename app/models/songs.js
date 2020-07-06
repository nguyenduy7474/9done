var mongoose = require('mongoose');

//define schema
var Songs = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	yttitle: String,
	songname: String,
	songnameremoveaccent: String,
	singger: String,
	lengthsong: Number,
	songid: String,
	datecreated: Date,
	reviewed: { type : Number , "default" : 0 }
});

//create model
module.exports = mongoose.model('songs', Songs, 'songs');