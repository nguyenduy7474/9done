var mongoose = require('mongoose');

//define schema
var Songs = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	yttitle: String,
	songname: String,
	songnameremoveaccent: String,
	singger: String,
	songtags: { type : Array , "default" : [] },
	counttimesing: { type : Number , "default" : 0},
	lengthsong: Number,
	songid: String,
	datecreated: Date,
	linkoriginsong: String,
	reviewed: { type : Number , "default" : 0 }
});

//create model
module.exports = mongoose.model('songs', Songs, 'songs');