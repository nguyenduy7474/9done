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
const downloadfromurl = require('image-downloader')
var Posts = require('../models/posts');

class AdminPage{

	static async deletePost(req, res){
		let postid = req.body.postid
		let thumbnail = req.body.thumbnail
		Posts.deleteOne({_id: postid}, (err) => {
			if(err){
				console.log(err)
				return
			}
			if (fs.existsSync(`./public${thumbnail}`)) {
				fs.unlinkSync(`./public${thumbnail}`)
			}
			res.send("success")
		})
	}

	static async editPost(req, res){
		var postid = req.body.postid
		var title = req.body.title
		var content = req.body.content
		var urlthumbnail = req.body.urlthumbnail

		if(req.body.urlthumbnail){
			let options = {
				url: urlthumbnail,
				dest: './public/thumbnails/' + postid + '.jpg'
			}
			await downloadimg(options)
			/*			console.log("ok")
                        fs.unlinkSync('./public/thumbnails/' + req.body.songid + '.jpg')
                        fs.renameSync('./public/' + req.file.filename,'./public/thumbnails/' + req.body.songid + '.jpg')
                        //fs.unlinkSync('./public/' + req.file.filename)*/
		}
		urlthumbnail = '/thumbnails/' + postid + '.jpg'
		Posts.updateOne({_id: postid}, {$set: {title: title, content: content, thumbnail: urlthumbnail}}, (err) => {
			if(err) throw err
			res.send("success")
		})

		function downloadimg(options){
			return new Promise((ok, notok) => {
				downloadfromurl.image(options)
					.then(({ filename }) => {
						ok()
					})
					.catch(ok())
			})
		}
	}

	static async editSong(req, res){
		var songid = req.body.songid
		var songname = req.body.songname
		var singger = req.body.singger
		var songtags = req.body.songtags
		var urlthumbnail = req.body.urlthumbnail
		var linkoriginsong = req.body.linkoriginsong

		if(req.body.urlthumbnail){
			let options = {
				url: urlthumbnail,
				dest: './public/thumbnails/' + songid + '.jpg'
			}
			await downloadimg(options)
/*			console.log("ok")
			fs.unlinkSync('./public/thumbnails/' + req.body.songid + '.jpg')
			fs.renameSync('./public/' + req.file.filename,'./public/thumbnails/' + req.body.songid + '.jpg')
			//fs.unlinkSync('./public/' + req.file.filename)*/
		}
		songtags = songtags.trim()
		songtags = songtags.split(",")
		for(var i=0; i<songtags.length;i++){
			songtags[i] = songtags[i].trim()
		}
		Songs.updateOne({songid: songid}, {$set: {songname: songname, singger: singger, songtags: songtags, linkoriginsong: linkoriginsong}}, (err) => {
			if(err) throw err
			res.send("success")
		})

		function downloadimg(options){
			return new Promise((ok, notok) => {
				downloadfromurl.image(options)
					.then(({ filename }) => {
						ok()
					})
					.catch(ok())
			})
		}
	}

	static async AddNewPost(req, res){
		let title = req.body.title
		let content = req.body.content
		let thumbnail = req.body.thumbnail
		let slug = ChangeToSlug(title)

		let newpost = Posts({
			title: title,
			slug: slug,
			content: content,
			datecreated: new Date()
		})

		let data = await newpost.save()
		let options = {
			url: thumbnail,
			dest: './public/thumbnails/' + data._id + '.jpg'
		}

		await downloadimg(options)
		thumbnail = '/thumbnails/' + data._id + '.jpg'
		data.thumbnail = thumbnail
		await data.save()
		res.send("success")

		function downloadimg(options){
			return new Promise((ok, notok) => {
				downloadfromurl.image(options)
					.then(({ filename }) => {
						ok()
					})
					.catch(ok())
			})
		}

		function ChangeToSlug(title)
		{
			var slug;

			//Đổi chữ hoa thành chữ thường
			slug = title.toLowerCase();

			//Đổi ký tự có dấu thành không dấu
			slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
			slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
			slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
			slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
			slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
			slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
			slug = slug.replace(/đ/gi, 'd');
			//Xóa các ký tự đặt biệt
			slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
			//Đổi khoảng trắng thành ký tự gạch ngang
			slug = slug.replace(/ /gi, "-");
			//Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
			//Phòng trường hợp người nhập vào quá nhiều ký tự trắng
			slug = slug.replace(/\-\-\-\-\-/gi, '-');
			slug = slug.replace(/\-\-\-\-/gi, '-');
			slug = slug.replace(/\-\-\-/gi, '-');
			slug = slug.replace(/\-\-/gi, '-');
			//Xóa các ký tự gạch ngang ở đầu và cuối
			slug = '@' + slug + '@';
			slug = slug.replace(/\@\-|\-\@|\@/gi, '');
			//In slug ra textbox có id “slug”
			return slug
		}
	}


	static async manageposts(req, res){


		res.render('managepost.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: req.session.user
		});
	}

	static AddNewPostPage(req, res){
		res.render('addnewpost.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: req.session.user,
		});
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
		var linkyoutubeoriginal = req.body.linkyoutubeoriginal
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
		if(found){
			found.reviewed = 1
			found.songtags = songtags
			found.songname = songname
			found.singger = singger
			found.datecreated = new Date()
			found.linkoriginsong = linkyoutubeoriginal
			try{
				await downloadVideoAndMix(`https://www.youtube.com/watch?v=${found.songid}`, found.songid)
			}catch(e){
				console.log(e)
				res.send("Lỗi downloadVideoAndMix")
			}
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
			res.send("ok gòi")
		}else{
			await AddSong(1)
		}

		function checkYtURLandDBexist(url){
			return new Promise(function(ok, notok){
				youtubedl.getInfo(url, [],  function(err, info) {
					if(err || info == undefined){console.log("err" + err); ok("falseww");return}
					Songs.findOne({songid: info.id, reviewed: 1}, (err2, found)=>{
						if(err2) {console.log("err2" + err2); ok("false2")}
						if(found) {console.log("found" + found); ok("false3")}
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
					let infor

					try{
						infor = await getall.downloadMp3AndThumnailAndGetID(linkyoutube, "public/allsongs/", "public/thumbnails/")
					}catch(e){
						console.log(e)
						res.send("Lỗi downloadMp3AndThumnailAndGetID")
					}

					try{
						await downloadVideoAndMix(linkyoutube, songid)
					}catch(e){
						console.log(e)
						res.send("Lỗi downloadVideoAndMix")
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
						linkoriginsong: linkyoutubeoriginal,
						reviewed: reviewed
					})
					await songsave.save()

				}else{
					flag = "Link Youtube không chính xác"
				}
				if (fs.existsSync(`./${songid}.mp4`)) {
					fs.unlinkSync(`./${songid}.mp4`)
				}

				if (fs.existsSync(`./${songid}480.mp4`)) {
					fs.unlinkSync(`./${songid}480.mp4`)
				}
				if(checkwebm){
					await convertwebmtomp4(songid, "cham")
				}
				ok(flag)
			})
		}

		function downloadVideoAndMix(linkyoutube, songid){
			return new Promise((ok, notok) => {
				youtubedl.getInfo(linkyoutube, [], async (err, info) => {
					if(err){
						notok("false")
						console.log(err)
						return
					}
					if(!info){
						notok("false")
						return
					}
					var arrwebm = []
					var arrmp4 = []
					var arrwebm480 = []
					var arrmp4480 = []
					/*var listformat = info.player_response.streamingData.adaptiveFormats*/
					var listformat = info.formats

					listformat.sort((a, b) => parseFloat(b.height) - parseFloat(a.height));
					for(var i=0; i<listformat.length; i++){
						if(listformat[i].height != null){
							listformat[i].url = listformat[i].url.replace("&ratebypass=yes", "")
							if(listformat[i].ext.indexOf("webm") != -1){
								arrwebm.push(listformat[i])
								if(listformat[i].format_note == "480p"){
									arrwebm480.push(listformat[i])
								}
							}else{
								arrmp4.push(listformat[i])
								if(listformat[i].format_note == "480p"){
									arrmp4480.push(listformat[i])
								}
							}
						}

					}

					while(arrwebm[0].height > 1080){
						arrwebm.shift()
					}

					while(arrmp4[0].height > 1080){
						arrmp4.shift()
					}
					if(arrwebm[0].format_note == arrmp4[0].format_note){
						try{
							fs.writeFileSync(`./${songid}.webm`, await download(arrwebm[0].url))
							checkwebm = true
							await convertwebmtomp4(songid)

						}catch (e) {
							try{
								fs.writeFileSync(`./${songid}.mp4`, await download(arrmp4[0].url))
							}catch (e) {
								console.log("Khong tai duoc luon a")
							}
						}

						if(arrmp4[0].format_note != "480p"){
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
							if(arrwebm[0].format_note != "480p"){
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
							if(arrmp4[0].format_note != "480p"){
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

		async function ffmpegmix(songid, type){
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
			return new Promise((ok, notok) => {
				let ffmpegcmd
				let ffmpegcmd480
				if(type){
					new ffmpeg()
						.input(`./${songid}.webm`)
						.addOption('-preset', 'veryslow')
						.output(`./${songid}_verzip.mp4`)
						.on('progress', function(progress) {
							console.log('Processing verzip: ' + progress.percent + '% done')
						})
						.on('end', async function(stdout, stderr) {
							if(fs.existsSync("./"+ songid +"480.webm")){
								new ffmpeg()
									.input(`./${songid}480.webm`)
									.addOption('-preset', 'veryslow')
									.output(`./${songid}480_verzip.mp4`)
									.on('progress', function(progress) {
										console.log('Processing verzip: ' + progress.percent + '% done')
									})
									.on('end', async function(stdout, stderr) {
										await ffmpegmix(songid, "zip")
										fs.unlinkSync(`./${songid}.webm`)
										if (fs.existsSync(`./${songid}480.webm`)) {
											fs.unlinkSync(`./${songid}480.webm`)
										}
										if (fs.existsSync(`./${songid}_verzip.mp4`)) {
											fs.unlinkSync(`./${songid}_verzip.mp4`)
											fs.unlinkSync(`./public/videos/${songid}.mp4`)
										}
										if (fs.existsSync(`./${songid}480_verzip.mp4`)) {
											fs.unlinkSync(`./${songid}480_verzip.mp4`)
											fs.unlinkSync(`./public/videos/${songid}480.mp4`)
										}
										ok("ok")
									})
									.run()
							}else{
								await ffmpegmix(songid, "zip")
								fs.unlinkSync(`./${songid}.webm`)
								if (fs.existsSync(`./${songid}_verzip.mp4`)) {
									fs.unlinkSync(`./${songid}_verzip.mp4`)
									fs.unlinkSync(`./public/videos/${songid}.mp4`)
								}
								ok("ok")
							}

						})
						.run()
/*					ffmpegcmd = "ffmpeg -i ./"+ songid +".webm -preset veryslow ./"+ songid +"_verzip.mp4"
					if (fs.existsSync("./"+ songid +"480.webm")) {
						ffmpegcmd480 = "ffmpeg -i ./"+ songid +"480.webm -preset veryslow ./"+ songid +"480_verzip.mp4"
					}*/
				}else{
					new ffmpeg()
						.input(`./${songid}.webm`)
						.addOption('-preset', 'ultrafast')
						.output(`./${songid}.mp4`)
						.on('progress', function(progress) {
							console.log('Processing verzip fast: ' + progress.percent + '% done')
						})
						.on('end', async function(stdout, stderr) {
							if (fs.existsSync("./"+ songid +"480.webm")) {
								new ffmpeg()
									.input(`./${songid}480.webm`)
									.addOption('-preset', 'ultrafast')
									.output(`./${songid}480.mp4`)
									.on('progress', function(progress) {
										console.log('Processing verzip fast 480: ' + progress.percent + '% done')
									})
									.on('end', async function(stdout, stderr) {
										//await ffmpegmix(songid, "zip")
										ok("ok")
									})
									.run()
							}else{
								//await ffmpegmix(songid, "zip")
								ok("ok")
							}

						})
						.run()
				}
/*				if(type){
					console.log()
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
						console.log("vao ne")
						ok(true)
					})
				}*/
/*				if(fs.existsSync("./"+ songid +".webm") && !fs.existsSync("./"+ songid +".mp4") && !type){
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
				}*/

			})
		}
	}
}

module.exports = AdminPage
