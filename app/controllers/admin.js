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

	static editSong(req, res){
		var songid = req.body.songid
		var songname = req.body.songname
		var singger = req.body.singger
		Songs.updateOne({songid: songid}, {$set: {songname: songname, singger: singger}}, (err) => {
			if(err) throw err
			res.send("success")
		})
	}

	static manage9Done(req, res){
		res.render('manage.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: req.session.user,
		});
	}

	static checkAdmin(req, res, next){
		if (req.session.user) {
			if(req.session.user.role == "admin"){
				next();
			}else{
				res.redirect('/duylogin');
			}
		} else {
			res.redirect('/duylogin');
		}
	}

	static logout(req, res) {
		req.session.destroy();
		res.send("success");
	}

	static deleteSong(req, res){
		let songid = req.body.songid
		Songs.deleteOne({songid: songid}, (err) => {
			if(err){
				console.log(err)
				return
			}
			if (fs.existsSync(`./public/allsongs/${songid}.mp3`)) {
				fs.unlinkSync(`./public/allsongs/${songid}.mp3`)
			}
			if (fs.existsSync(`./public/thumbnails/${songid}.jpg`)) {
				fs.unlinkSync(`./public/thumbnails/${songid}.jpg`)
			}
			if (fs.existsSync(`./public/videos/${songid}.mp4`)) {
				fs.unlinkSync(`./public/videos/${songid}.mp4`)
			}
			if (fs.existsSync(`./public/videos/${songid}480.mp4`)) {
				fs.unlinkSync(`./public/videos/${songid}480.mp4`)
			}
			res.send("success")
		})
	}

	static adminLogin(req, res){
		res.render('adminlogin.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: null,
		});
	}

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
		var checkwebm = false
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
		if(found && found.reviewed == 1){
			res.send("Hệ thống đã có bài hát này rồi")
			return
		}
		res.send("Hệ thống đã nhận lát anh check lại nha anh admin")

		if(found){
			found.reviewed = 1
			found.songtags = songtags
			found.songname = songname
			found.singger = singger
			found.datecreated = new Date()
			await downloadVideoAndMix(`https://www.youtube.com/watch?v=${found.songid}`, found.songid)
			fs.unlinkSync(`./${found.songid}.mp4`)
			if (fs.existsSync(`./${found.songid}480.mp4`)) {
				fs.unlinkSync(`./${found.songid}480.mp4`)
			}
			if(checkwebm){
				await convertwebmtomp4(songid, "cham")
				await ffmpegmix(found.songid)
				fs.unlinkSync(`./${songid}.webm`)
				if (fs.unlinkSync(`./${songid}480.webm`)) {
					fs.unlinkSync(`./${songid}480.webm`)
				}
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
					await downloadVideoAndMix(linkyoutube, songid)

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
				fs.unlinkSync(`./${songid}.mp4`)
				if (fs.existsSync(`./${songid}480.mp4`)) {
					fs.unlinkSync(`./${songid}480.mp4`)
				}
				if(checkwebm){
					await convertwebmtomp4(songid, "cham")
					await ffmpegmix(found.songid)
					fs.unlinkSync(`./${songid}.webm`)
					if (fs.unlinkSync(`./${songid}480.webm`)) {
						fs.unlinkSync(`./${songid}480.webm`)
					}
				}
				ok(flag)
			})
		}

		function downloadVideoAndMix(linkyoutube, songid){
			console.log("linkyoutube" + songid)
			return new Promise((ok, notok) => {
				ytdl.getInfo(linkyoutube, {downloadURL: true}, async (err, info) => {
					var arrwebm = []
					var arrmp4 = []
					var arrwebm480 = []
					var arrmp4480 = []
					var listformat = info.player_response.streamingData.adaptiveFormats
					for(var i=0; i<listformat.length; i++){
						if(listformat[i].mimeType.indexOf("webm") != -1){
							arrwebm.push(listformat[i])
							if(listformat[i].qualityLabel == "480p"){
								arrwebm480.push(listformat[i])
							}
						}else{
							arrmp4.push(listformat[i])
							if(listformat[i].qualityLabel == "480p"){
								arrmp4480.push(listformat[i])
							}
						}
					}

					while(arrwebm[0].height > 1080){
						arrwebm.shift()
					}

					while(arrmp4[0].height > 1080){
						arrmp4.shift()
					}

					if(arrwebm[0].qualityLabel == arrmp4[0].qualityLabel){
						try{
							fs.writeFileSync(`./${songid}.mp4`, await download(arrmp4[0].url))
						}catch (e) {
							try{
								fs.writeFileSync(`./${songid}.webm`, await download(arrwebm[0].url))
								checkwebm = true
								await convertwebmtomp4(songid)
							}catch (e) {
								console.log("Khong tai duoc luon a")
							}
						}

						if(arrmp4[0].qualityLabel != "480p"){
							try{
								fs.writeFileSync(`./${songid}480.mp4`, await download(arrmp4480[0].url))
							}catch (e) {
								try{
									fs.writeFileSync(`./${songid}480.webm`, await download(arrwebm480[0].url))
									checkwebm = true
									await convertwebmtomp4(songid)
								}catch (e) {
									console.log("Khong tai duoc luon a")
								}
							}
						}
					}else{
						var biloitaiwebm = false
						try{
							fs.writeFileSync(`./${songid}.webm`, await download(arrwebm[0].url))
							checkwebm = true
							await convertwebmtomp4(songid)
						}catch (e) {
							biloitaiwebm = true
							fs.writeFileSync(`./${songid}.mp4`, await download(arrmp4[0].url))
						}

						if(!biloitaiwebm){
							if(arrwebm[0].qualityLabel != "480p"){
								try{
									fs.writeFileSync(`./${songid}480.mp4`, await download(arrmp4480[0].url))
								}catch (e) {
									try{
										fs.writeFileSync(`./${songid}480.webm`, await download(arrwebm480[0].url))
										checkwebm = true
										await convertwebmtomp4(songid)
									}catch (e) {
										console.log("Khong tai duoc luon a")
									}
								}
							}
						}else{
							if(arrmp4[0].qualityLabel != "480p"){
								try{
									fs.writeFileSync(`./${songid}480.mp4`, await download(arrmp4480[0].url))
								}catch (e) {
									try{
										fs.writeFileSync(`./${songid}480.webm`, await download(arrwebm480[0].url))
										checkwebm = true
										await convertwebmtomp4(songid)
									}catch (e) {
										console.log("Khong tai duoc luon a")
									}
								}
							}
						}
					}
					await ffmpegmix(songid)
					ok(true)
				})
			})
		}

		async function ffmpegmix(songid){
			console.log("ffmpegmix" + songid)
			return new Promise((ok, notok) => {
				if(fs.existsSync(`./${songid}_verzip.mp4`)){
					new ffmpeg()
						.addInput(`./${songid}_verzip.mp4`)
						.addInput(`./public/allsongs/${songid}.mp3`)
						.addOption('-c:v', 'copy')
						.output(`./public/videos/${songid}_verzip.mp4`)
						.on('progress', function(progress) {
							console.log('Processing: ' + progress.percent + '% done')
						})
						.on('end', function(stdout, stderr) {
							if (fs.existsSync(`./${songid}480_verzip.mp4`)) {
								new ffmpeg()
									.addInput(`./${songid}480.mp4`)
									.addInput(`./public/allsongs/${songid}.mp3`)
									.addOption('-c:v', 'copy')
									.output(`./public/videos/${songid}480_verzip.mp4`)
									.on('progress', function(progress) {
										console.log('Processing: ' + progress.percent + '% done')
									})
									.on('end', function(stdout, stderr) {
										ok('Transcoding succeeded!')
									})
									.run()
							}else{
								ok('Transcoding succeeded!')
							}
						})
						.run()
				}else{
					new ffmpeg()
						.addInput(`./${songid}.mp4`)
						.addInput(`./public/allsongs/${songid}.mp3`)
						.addOption('-c:v', 'copy')
						.output(`./public/videos/${songid}.mp4`)
						.on('progress', function(progress) {
							console.log('Processing: ' + progress.percent + '% done')
						})
						.on('end', function(stdout, stderr) {
							if (fs.existsSync("./"+ songid +"480.mp4")) {
								new ffmpeg()
									.addInput(`./${songid}480.mp4`)
									.addInput(`./public/allsongs/${songid}.mp3`)
									.addOption('-c:v', 'copy')
									.output(`./public/videos/${songid}480.mp4`)
									.on('progress', function(progress) {
										console.log('Processing: ' + progress.percent + '% done')
									})
									.on('end', function(stdout, stderr) {
										ok('Transcoding succeeded!')
									})
									.run()
							}else{
								ok('Transcoding succeeded!')
							}
						})
						.run()
				}

			})
		}

		async function convertwebmtomp4(songid, type){
			console.log("convertwebmtomp4" + songid)
			return new Promise((ok, notok) => {
				let ffmpegcmd
				let ffmpegcmd480
				if(type){
					ffmpegcmd = "ffmpeg -i ./"+ songid +".webm -preset veryslow ./"+ songid +"_verzip.mp4"
					if (fs.existsSync("./"+ songid +"480.webm")) {
						ffmpegcmd480 = "ffmpeg -i ./"+ songid +"480.webm -preset veryslow ./"+ songid +"480_verzip.mp4"
					}
				}else{
					ffmpegcmd = "ffmpeg -i ./"+ songid +".webm -preset ultrafast ./"+ songid +".mp4"
					if (fs.existsSync("./"+ songid +"480.webm")) {
						ffmpegcmd480 = "ffmpeg -i ./"+ songid +"480.webm -preset ultrafast ./"+ songid +"480.mp4"
					}
				}
				if(type){
					exec(ffmpegcmd, (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`);
							return;
						}
						if (fs.existsSync("./"+ songid +"480.webm") && fs.existsSync("./"+ songid +"480.mp4")) {
							exec(ffmpegcmd480, (error, stdout, stderr) => {
								if (error) {
									console.error(`exec error: ${error}`)
									return;
								}
								ok(true)
							})
						}
						ok(true)
					})
				}
				if(fs.existsSync("./"+ songid +".webm") && !fs.existsSync("./"+ songid +".mp4") && !type){
					console.log("done")
					exec(ffmpegcmd, (error, stdout, stderr) => {
						if (error) {
							console.error(`exec error: ${error}`);
							return;
						}
						if (fs.existsSync("./"+ songid +"480.webm") && fs.existsSync("./"+ songid +"480.mp4")) {
							exec(ffmpegcmd480, (error, stdout, stderr) => {
								if (error) {
									console.error(`exec error: ${error}`)
									return;
								}
								ok(true)
							})
						}
						ok(true)
					})
				}else{
					if (fs.existsSync("./"+ songid +"480.webm") && !fs.existsSync("./"+ songid +"480.mp4")  && !type) {
						exec(ffmpegcmd480, (error, stdout, stderr) => {
							if (error) {
								console.error(`exec error: ${error}`)
								return;
							}
							ok(true)
						})
					}
					ok(true)
				}

			})
		}
	}
}

module.exports = AdminPage
