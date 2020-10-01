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
var SongUserSing = require('../models/songusersing');
var UserReact =require('../models/userreact');

class UserController{

	static async infoSongUserSing(req, res){
		var userreact
		var likecount = await UserReact.find({songusersingid: req.body.songid, react: "like"}).count()
		var dislikecount = await UserReact.find({songusersingid: req.body.songid, react: "dislike"}).count()
		if(req.session.user){
			userreact = await UserReact.findOne({songusersingid: req.body.songid, userid: req.session.user._id})
			if(userreact){
				userreact = userreact.react
			}
		}
		res.send({likecount: likecount, dislikecount: dislikecount, userreact: userreact})
	}

	static async reactVideo(req, res){
		if(req.session.user){
		    var userreact = await UserReact.findOne({songusersingid: req.body.songid, userid: req.session.user._id})
			console.log(userreact)
            if(userreact){
            	console.log("do day")
                if(userreact.react != req.body.react){
                    userreact.react = req.body.react
                }
                await userreact.save()
            }else{
                var userreactsave = UserReact({
                    songusersingid: req.body.songid,
                    userid: req.session.user._id,
                    react: req.body.react,
                    datecreate: new Date()
                })
                await userreactsave.save()
            }
		}
		res.send("success")
	}


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
		if(!mongoose.Types.ObjectId.isValid(req.body.userid)){
			res.send("Not Found User")
			return
		}else{
			let user = await User.findOne({_id: req.body.userid})
			if(!user){
				res.send("Not Found User")
				return
			}else{
				var allsonguser = await SongUserSing.find({userid: req.body.userid}).lean()
				var songinfo
				var songuserarr = []
				var songuserobj

				for(var i=0; i<allsonguser.length; i++){
					/*songuserobj = {}*/
					songinfo = await Songs.findOne({songid: allsonguser[i].songid})
/*					songuserobj = Object.assign({}, allsonguser[i])
					songuserobj = songuserobj._doc
					songuserarr.push(songuserobj)*/
					allsonguser[i].songname = songinfo.songname
				}
				console.log(allsonguser)
				var userinfo = {
					id: user._id,
					avatar: user.avatar,
					full_name: user.full_name
				}
				if(req.session.user && user.id == req.session.user._id){
					res.send({userinfo: userinfo, currentuser: true, allsonguser: allsonguser, checklogined: true})
				}else{
					if(req.session.user){
						res.send({userinfo: userinfo, currentuser: false, allsonguser: allsonguser, checklogined: true})
					}else{
						res.send({userinfo: userinfo, currentuser: false, allsonguser: allsonguser, checklogined: false})
					}

				}
			}
		}
	}
}

module.exports = UserController