var mongoose = require('mongoose');

//define schema
var SongGuestSing = mongoose.Schema({
	datatype: { type : String , "default" : "mp3" },
	user: {type : String , "default" : "notlogin"},
	uploadsname: { type : String , "default" : "duyvipsilip" },
	handledname: { type : String , "default" : "duyvipsilip" },
	handlednameweb: { type : String , "default" : "duyvipsilip" },
	imagename: { type : String , "default" : "duyvipsilip" },
	expiretime: Date,
	reverb: { type : String , "default" : "duyvipsilip" }
});

//create model
module.exports = mongoose.model('songguestsing', SongGuestSing, 'songguestsing');