var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var Songs = require('../models/songs');
var RankSong = require('../models/ranksong');
var User = require('../models/user');
const fs = require('fs');
var exec = require("child_process").exec;
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
var DownloadYTMp3AndThumbnail = require("../../downloadvideo");
const youtubedl = require('youtube-dl')
var SongsReview = require('../models/songsreview');
var async = require('async');
const got = require('got');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var mongoose = require('mongoose');

class UserController{
	static logOut(req, res){
		req.session.user = "";
		res.redirect("/")
	}

	static userPage(req, res){
		let userinfo = ""
		console.log(userinfo)
		if(req.session.user){
			userinfo = req.session.user
		}

		res.render('userpage.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: req.session.user
		 });
	}

	static async getUserinfo(req, res){
		console.log("aa")
		console.log(req.body.userid)
		console.log(mongoose.Types.ObjectId.isValid(req.body.userid))
		if(!mongoose.Types.ObjectId.isValid(req.body.userid)){
			res.send("Not Foud User")
			return
		}else{
			let user = await User.findOne({_id: req.body.userid})
			if(!user){
				res.send("Not Foud User")
				return
			}else{
				if(req.session.user && user.id == req.session.user._id){
					res.send({userinfo: user, currentuser: true})
				}else{
					res.send({userinfo: user, currentuser: false})
				}
			}
		}
	}
}

module.exports = UserController