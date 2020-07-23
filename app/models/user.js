var mongoose = require('mongoose');

//define the schema for our user model
var userSchema = mongoose.Schema({	
	email: String,
	full_name: String,
	gender: String,
	address: String,
	avatar: { type : String , "default" : "/images/default-avatar.png" },
	created_date: Date,
	user_public_folder: String, 
	role: { type : String , "default" : "member" },
	facebook_id: String,
	access_token: String,
});

//create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema, 'users');

