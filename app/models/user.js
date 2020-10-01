var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//define the schema for our user model
var userSchema = mongoose.Schema({
	rootuser: String,
	rootpass: String,
	email: String,
	full_name: String,
	gender: String,
	address: String,
	avatar: { type : String , "default" : "/images/default-avatar.png" },
	subcribe: { type : Array , "default" : [] },
	created_date: Date,
	user_public_folder: String, 
	role: { type : String , "default" : "member" },
	facebook_id: String,
	access_token: String,
});
//checking if password is valid
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.rootpass);
};

//create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema, 'users');

