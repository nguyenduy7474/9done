var mongoose = require('mongoose');

//define schema
var SongUserSing = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	uploadsname: String,
	handledname: String,
	imagename: String,
	expiretime: Date
});

//create model
module.exports = mongoose.model('songusersing', SongUserSing, 'songusersing');