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
			found.datecreated = new Date()
			await downloadVideoAndMix(`https://www.youtube.com/watch?v=${found.songid}`, found.songid)
			fs.unlinkSync(`./${found.songid}.webm`)
			if (fs.existsSync(`./${found.songid}480.webm`)) {
				fs.unlinkSync(`./${found.songid}480.webm`)
			}
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
					if (fs.existsSync(`./${songid}480.webm`)) {
						fs.unlinkSync(`./${songid}480.webm`)
					}
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
					var arrmp4 = []
					var mp4file = false
					var position
					var listformat = info.player_response.streamingData.adaptiveFormats
					for(var i=0; i<listformat.length; i++){
						if(listformat[i].mimeType.indexOf("webm") != -1){
							arrwebm.push(listformat[i])
						}else{
							arrmp4.push(listformat[i])
						}
					}
					try{
						fs.writeFileSync(`./${songid}.webm`, await download(arrwebm[0].url));
						
						if(arrwebm[0].qualityLabel != "480p"){
							for(var i=0; i< arrwebm.length; i++){
								if(arrwebm[i].qualityLabel == "480p"){
									position = i
									break;
								}
							}
							if(position){
								fs.writeFileSync(`./${songid}480.webm`, await download(arrwebm[i].url));
							}
						}
					}catch(e){
						fs.writeFileSync(`./${songid}.mp4`, await download(arrmp4[0].url));
						if(arrmp4[0].qualityLabel != "480p"){
							for(var i=0; i< arrmp4.length; i++){
								if(arrwebm[i].qualityLabel == "480p"){
									position = i
									break;
								}
							}
							if(position){
								fs.writeFileSync(`./${songid}480.mp4`, await download(arrmp4[i].url));
							}
						}
						var ffmpegcmd = "ffmpeg -i ./" + songid + ".mp4 -c:v libvpx-vp9 -crf 4 -b:v 0 ./" + songid + ".webm"
						console.log("convert to webm")
						await convertmp4towebm(ffmpegcmd)
						fs.unlinkSync(`./${songid}.mp4`)
						if(position){
							var ffmpegcmd480 = "ffmpeg -i ./" + songid + "480.mp4 -c:v libvpx-vp9 -crf 4 -b:v 0 ./" + songid + "480.webm"
							await convertmp4towebm(ffmpegcmd480)
							fs.unlinkSync(`./${songid}480.mp4`)
						}
					}
					new ffmpeg()
						.addInput(`./${songid}.webm`)
						.addInput(`./public/allsongs/${songid}.mp3`)
						.addOption('-codec', 'copy')
						.output(`./public/videos/${songid}.webm`)
						.on('progress', function(progress) {
							console.log('Processing: ' + progress.percent + '% done');
						})
						.on('end', function(stdout, stderr) {
							if(position){
								new ffmpeg()
									.addInput(`./${songid}480.webm`)
									.addInput(`./public/allsongs/${songid}.mp3`)
									.addOption('-codec', 'copy')
									.output(`./public/videos/${songid}480.webm`)
									.on('progress', function(progress) {
										console.log('Processing: ' + progress.percent + '% done');
									})
									.on('end', function(stdout, stderr) {
										ok('Transcoding succeeded!');
									})
									.run()
							}else{
								ok('Transcoding succeeded!');
							}
						})
						.run()
				})
			})

		}

		async function convertmp4towebm(ffmpegcmd){
			return new Promise((ok, notok) => {
				exec(ffmpegcmd, (error, stdout, stderr) => {
					if (error) {
						console.error(`exec error: ${error}`);
						return;
					}
					ok(true)
				});
			})
		}
	}
}

module.exports = AdminPage
