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
var path = require('path');
var appDir = path.dirname(require.main.filename);
const ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
const download = require('download');


class AdminPage{
	static adminSongReview(req, res){
		res.render('adminsongreview.ejs', {
			error : req.flash("error"),
			success: req.flash("success")
		});
	}

	static async adminAdNewSong(req, res){
		var songname = req.body.namesong
		var singger = req.body.singgername
		var linkyoutube = req.body.linkyoutube
		var flag = ""
		var songid
		var songtags = req.body.songtags
		songtags = songtags.trim()
		songtags = songtags.split(",")
		flag = ""
		if(!extractVideoID(linkyoutube)){
			flag = "Link Youtube không chính xác"
		}
		if(flag != ""){
			res.send(flag)
			return
		}
		for(var i=0; i<songtags.length;i++){
			songtags[i] = songtags[i].trim()
		}
		songid = extractVideoID(linkyoutube)
		var found = await Songs.findOne({songid: songid})
		res.send("Hệ thống đã nhận lát anh check lại nha anh admin")
		if(found){
			found.reviewed = 1
			found.songtags = songtags
			found.songname = songname
			found.singger = singger
			await downloadVideoAndMix(`https://www.youtube.com/watch?v=${found.songid}`, found.songid)
			fs.unlinkSync(`./${found.songid}.webm`)
			await found.save()
		}else{
			await AddSong(1)
		}

		function checkYtURLandDBexist(url){
			return new Promise(function(ok, notok){
				youtubedl.getInfo(url, [],  function(err, info) {

					if(err || info == undefined){console.log("err" + err); ok(false);return}
					Songs.findOne({songid: info.id, reviewed: 1}, (err2, found)=>{
						if(err2) {console.log("err2" + err2); ok(false)}
						if(found) {console.log("found" + found); ok(false)}
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
				let flag = "OK gòi"
				var check = await checkYtURLandDBexist(linkyoutube)
				if(!check){
					flag = "Link Youtube không chính xác hoặc bài hát đã tồn tại"
					ok(flag)
					return
				}
				if(extractVideoID(linkyoutube)){
					let songid = extractVideoID(linkyoutube)
					let infor = await getall.downloadMp3AndThumnailAndGetID(linkyoutube, "public/allsongs/", "public/thumbnails/")
					await downloadVideoAndMix(linkyoutube, infor.id)
					fs.unlinkSync(`./${songid}.webm`)
					let songsave = Songs({
						songname: songname,
						songnameremoveaccent: removeAccents(songname),
						songtags: songtags,
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

		function downloadVideoAndMix(linkyoutube, songid){
			return new Promise((ok, notok) => {
				ytdl.getInfo(linkyoutube, {downloadURL: true}, async (err, info) => {
					var arrwebm = []
					for(var i=0; i<info.formats.length; i++){
						if(info.formats[i].container == "webm"){
							arrwebm.push(info.formats[i])
						}
					}
					
					fs.writeFileSync(`./${songid}.webm`, await download(arrwebm[0].url));
					new ffmpeg()
						.addInput(`./${songid}.webm`)
						.addInput(`./public/allsongs/${songid}.mp3`)
						.addOption('-codec', 'copy')
						.output(`./public/videos/${songid}.webm`)
						.on('progress', function(progress) {
							console.log('Processing: ' + progress.percent + '% done');
						})
						.on('end', function(stdout, stderr) {
							ok('Transcoding succeeded!');
						})
						.run()
				})
			})

		}
	}
}

module.exports = AdminPage