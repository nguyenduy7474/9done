var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var Songs = require('../models/songs');
var RankSong = require('../models/ranksong');
const fs = require('fs');
var exec = require("child_process").exec;
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
var DownloadYTMp3AndThumbnail = require("../../downloadvideo");
const youtubedl = require('youtube-dl')
var SongsReview = require('../models/songsreview');
var async = require('async');
const got = require('got');

class Home{
	static home(req, res) {
		res.render('index.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,
		
		 });
	}

	static async searchSongs(req, res){
		var namesong = req.body.namesong
		console.log(namesong)
		let match = {
            $and: [ { datatype: 'mp3', reviewed: 1 } ] 
        }
        // defined data will send to client
        let project = {
            yttitle :'$yttitle',
			songname : '$songname',
			singger : '$singger',
			lengthsong: '$lengthsong',   
			songid: '$songid',
			datecreated: '$datecreated'
        }
        let sort= {
            datecreated: -1
        }
        if(namesong){
            match.$and.push({$or: [{'songname': {$regex: namesong,$options:"xi"}}, {'singger': {$regex: namesong,$options:"xi"}}, {'songnameremoveaccent': {$regex: namesong,$options:"xi"}}]})
        }

        try{
            //set default variables
            let pageSize = 8
            let currentPage = req.body.paging_num || 1
    
            // find total item
            let pages = await Songs.find(match).countDocuments()
    
    
            // find total pages
            let pageCount = Math.ceil(pages/pageSize)
            let data = await Songs.aggregate([{$match:match},{$project:project},{$sort:sort},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
            res.send({data, pageSize, pageCount, currentPage});
        }catch(err) {
            console.log(err.message)
            res.send({"fail": "fail"});
        }
	}

	static async uploadSing(req, res){
		var filesinger = req.files[0].fieldname + "_" + Date.now()
		var pathsong = "public/allsongs/" + req.body.songid + ".mp3"
    	var pathsinger = "public/uploads/" + filesinger + ".wav"
		pathsinger = removeSpace(pathsinger)
		await writeFile(pathsinger, Buffer.from(req.files[0].buffer))
		var despath = "/songhandled/" + req.body.songid + "_" + filesinger + ".wav"
		despath = removeSpace(despath)
		var pathmergerfile = "public" + despath

		exec(`python public/pydub/mergewav.py ${pathsong} ${pathsinger} ${pathmergerfile}`, (error, stdout, stderr) => {
		  if (error) {
		    console.error(`exec error: ${error}`);
		    return;
		  }
		  	console.log(stdout.trim())
		  	return res.json({"status": "success", "despath": despath})
		});

		function removeSpace(string){
			string = string.split(" ").join("_")
			return string
		}
	}

	static async acceptSongs(req, res){
		res.render('acceptsongs.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,
		
		 });
	}

	static async addNewSongReview(req, res){
		var songname = req.body.namesong
		var singger = req.body.singgername
		var linkyoutube = req.body.linkyoutube
		var flag = ""
		var songid
		if(extractVideoID(linkyoutube)){
			songid = extractVideoID(linkyoutube)
			var respone = await got("https://www.googleapis.com/youtube/v3/videos?id="+ songid +"&part=status&key=AIzaSyClczvGfPuaOcbR5exPpI2QDEqXkwIgyFo")
			respone = JSON.parse(respone.body)
			if(respone.items[0].status.embeddable == false){
				flag = "Không thể thêm video này vì tác giả không cho phép"
			}
			
		}else{
			flag = "Link Youtube không chính xác"
		}
		if(flag != ""){
			res.send(flag)
			return	
		}

		if(songname.indexOf("9done") != -1){
			songname = songname.replace("9done", "")
			flag = "success"
			var found = await Songs.findOne({songid: songid})
			if(found){
				found.reviewed = 1
				await found.save()
			}else{
				await AddSong(1)
			}
			console.log("doneeeeeeeeeeeeeeeeeeeeeee")
		}else{ 
			flag = await AddSong(0)
			console.log("done")
		}
		res.send(flag)

		function checkYtURLandDBexist(url){
			return new Promise(function(ok, notok){
				youtubedl.getInfo(url, [],  function(err, info) {
					if(err || info == undefined){ok(false);return}
					Songs.findOne({songid: info.id}, (err2, found)=>{
						if(err2) ok(false)
						if(found) ok(false)
						ok(true)
					})
				})
			})
		}

		function extractVideoID(url){
		  var regExp = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/;
		  var match = url.match(regExp);
		  if(match){
		    return match[1]
		  }
		}

		function removeAccents(str) {
		return str.normalize('NFD')
		          .replace(/[\u0300-\u036f]/g, '')
		          .replace(/đ/g, 'd').replace(/Đ/g, 'D');
		}

		function AddSong(reviewed){
			return new Promise(async(ok, notok) =>{
				var getall = new DownloadYTMp3AndThumbnail()
				let flag = "Đã thêm vào danh sách xét duyệt"
				var check = await checkYtURLandDBexist(linkyoutube)
				if(!check){
					flag = "Link Youtube không chính xác hoặc bài hát đã tồn tại"
					ok(flag)
					return
				}
				if(extractVideoID(linkyoutube)){
					let songid = extractVideoID(linkyoutube)
					let infor = await getall.downloadMp3AndThumnailAndGetID(linkyoutube, "public/allsongs/", "public/thumbnails/")
					let songsave = Songs({
						songname: songname,
						songnameremoveaccent: removeAccents(songname),
						singger: singger,
						yttitle: infor.title,
						songid: infor.id,
						lengthsong: infor.duration,
						datecreated: new Date(),
						reviewed: reviewed
					})
					await songsave.save()
				}else{
					flag = "Link Youtube không chính xác"
				}
				ok(flag)
			})

		}
	}

	static async uploadToRank(req, res){
		var filepath = req.body.filenamesave
		var n = filepath.lastIndexOf("_");
		n = filepath.lastIndexOf("_", n-1)
		var songid = filepath.slice(0, n)
		var filesinger = filepath.slice(n+1, filepath.length)
		filesinger = filesinger.split(".")[0]

		var pathsong = "public/allsongs/" + songid + ".mp3"
    	var pathsinger = "public/uploads/" + filesinger + ".wav"
		pathsinger = removeSpace(pathsinger)
		var despath = "/songuploaded/" + songid + "_" + filesinger + ".mp3"
		despath = removeSpace(despath)
		var pathmergerfile = "public" + despath

		exec(`python public/pydub/mergemp3.py ${pathsong} ${pathsinger} ${pathmergerfile}`, async (error, stdout, stderr) => {
		  if (error) {
		    console.error(`exec error: ${error}`);
		    return;
		  }
		  	var thissong = await Songs.findOne({songid: songid})
		  	var ranksong = RankSong({
		  		songname: thissong.songname,
		  		singername: thissong.singger,
		  		lengthsong: thissong.lengthsong,
		  		songid: songid,
		  		pathsong: despath,
		  		countlisten: 0
		  	})
		  	await ranksong.save()
		  	return res.json({"status": "success"})
		});

		function removeSpace(string){
			string = string.split(" ").join("_")
			return string
		}
	}

	static async getAllSongsReview(req, res){
		Songs.find({reviewed: 0}, null, {sort: {datecreated: -1}}, (err, found)=>{
			res.send(found)
		})
	}
}

module.exports = Home




    
