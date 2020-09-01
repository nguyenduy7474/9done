var mongoose = require('mongoose');

//define schema
var SongUserSing = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	uploadsname: { type : String , "default" : "duyvipsilip" },
	handledname: { type : String , "default" : "duyvipsilip" },
	handlednameweb: { type : String , "default" : "duyvipsilip" },
	imagename: { type : String , "default" : "duyvipsilip" },
	expiretime: Date
});

//create model
module.exports = mongoose.model('songusersing', SongUserSing, 'songusersing');