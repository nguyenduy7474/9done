var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var Songs = require('../models/songs');
var SongUserSing = require('../models/songusersing');
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
var ffmpeg = require('fluent-ffmpeg');
const { getAudioDurationInSeconds } = require('get-audio-duration');
var { Readable } = require('stream') ;
const { spawn } = require('child_process');

class Home{
	static async home(req, res) {
		let userinfo
		if(req.session.user){
			userinfo = req.session.user
		}
		res.render('index.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: userinfo,
		});
	}

	static async searchSongs(req, res){
		var namesong = req.body.namesong.trim()
		var sizepageadmin = parseInt(req.body.pagesize)
		var singer
		if(req.body.singer){
			singer = req.body.singer.trim()
		}

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
			songtags: '$songtags',
			counttimesing: '$counttimesing',
			datecreated: '$datecreated'
		}
		let sort= {
			datecreated: -1
		}
		if(namesong){
			match.$and.push({$or: [
					{'songname': {$regex: namesong, $options:"i"}},
					{'songnameremoveaccent': {$regex: namesong, $options:"i"}}]})
		}
		if(singer){
			match.$and.push({'singger': {$regex: singer, $options:"i"}})
		}

		try{
			//set default variables
			let pageSize = 12
			if(sizepageadmin){
				pageSize = sizepageadmin
			}
			let currentPage = req.body.paging_num || 1

			// find total item
			let pages = await Songs.find(match).countDocuments()


			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Songs.aggregate([{$match:match},{$project:project},{$sort:sort},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			if(data.length < pageSize){
				if(data.length != 0){
					let arrtags = data[0].songtags
					let limitcount = pageSize - data.length
					let arraysongname = []
					for(var i=0; i<data.length; i++){
						arraysongname.push(data[i].songname)
					}
					let songadmore = await Songs.find({"datatype" : "mp3", "reviewed" : 1, "songtags": {$in: arrtags}, "songname": {$nin: arraysongname}}).limit(limitcount)
					data = data.concat(songadmore)
				}
			}
			res.send({data, pageSize, pageCount, currentPage});
		}catch(err) {
			console.log(err)
			res.send({"fail": "fail"});
		}
	}

	static async uploadSing(req, res){
		var songvolume = req.body.songvolume
		var typedevice = req.body.typedevice
		var typerecord = req.body.typerecord
		var checkvp8 = req.body.checkvp8
		var despathweb
		var despath
		var filesinger = Date.now()
		var pathsong = "public/allsongs/" + req.body.songid + ".mp3"
		var pathsinger = "public/uploads/" + filesinger + ".webm"
		pathsinger = removeSpace(pathsinger)

		await writeFile(pathsinger, Buffer.from(req.files[0].buffer))
		despathweb = "/songhandled/" + req.body.songid + "_" + filesinger + ".webm"
		despath = "/songhandled/" + req.body.songid + "_" + filesinger + ".mp4"

/*		if(typerecord == "withvideo"){
			despath = "/songhandled/" + req.body.songid + "_" + filesinger + ".mp4"
		}else{
			despath = "/songhandled/" + req.body.songid + "_" + filesinger + ".mp3"
		}*/
		despathweb = removeSpace(despathweb)
		despath = removeSpace(despath)
		var pathmergerfileweb = "public" + despathweb
		var pathmergerfile = "public" + despath
		var songchoose = await Songs.findOne({songid: req.body.songid})
		var filter
		var ffmpegcmd
		var duration = req.body.lengthaudio
		if(duration > 30){
			await Songs.updateOne({songid: req.body.songid}, {$inc: {"counttimesing": 1}})
		}
		if(typedevice == "computer"){
			if(typerecord == "withvideo"){
				if(checkvp8 == "true"){
					filter = '"[0:a]volume=' + songvolume/100 + ',adelay=110|110[s1]; [1:1]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest[output]"'
				}else{
					filter = '"[0:a]volume=' + songvolume/100 + ',adelay=110|110[s1]; [1:0]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest[output]"'
				}
			}else{
				filter = '"[0:a]volume=' + songvolume/100 + ',adelay=110|110[s1]; [1:0]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest"'
			}
		}else{
			if(typerecord == "withvideo"){
				if(checkvp8 == "true"){
					filter = '"[0:a]volume=' + songvolume/100 + ',adelay=340|340[s1]; [1:1]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest[output]"'
				}else{
					filter = '"[0:a]volume=' + songvolume/100 + ',adelay=340|340[s1]; [1:0]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest[output]"'
				}
			}else{
				filter = '"[0:a]volume=' + songvolume/100 + ',adelay=340|340[s1]; [1:0]volume=1[s2]; [s1][s2]amix=inputs=2:duration=shortest"'
			}
		}
		if(typerecord == "withvideo"){
			if(checkvp8 == "true"){
				ffmpegcmd = "ffmpeg -i ./" + pathsong + " -i ./" + pathsinger + " -filter_complex " + filter + " -map 1:0 -map [output] -c:v copy ./" + pathmergerfileweb
			}else{
				ffmpegcmd = "ffmpeg -i ./" + pathsong + " -i ./" + pathsinger + " -filter_complex " + filter + " -map 1:v -map [output] -c:v copy ./" + pathmergerfile
			}
		}else{
			ffmpegcmd = "ffmpeg -i ./" + pathsong + " -i ./" + pathsinger + " -i ./public/thumbnails/"+ req.body.songid +".jpg -filter_complex " + filter + " ./" + pathmergerfile
		}

		var check = await mixaudio(ffmpegcmd)
/*		if(typerecord != "withvideo" && check == true){
			let combineaudiowithimage = "ffmpeg -i ./thumnails/" + req.body.songid + ".jpg -i ./" + pathmergerfile + "-acodec copy " +
			await mixaudio(ffmpegcmd)
		}*/
		var plustime = new Date()
		plustime = plustime.getTime() + (3*60*60*1000)
		var savesong = SongUserSing({
			uploadsname: pathsinger,
			handledname: pathmergerfile,
			handlednameweb: pathmergerfileweb,
			expiretime: plustime
		})
		await savesong.save()
		if(check){
			let obj = {"status": "success", "filesinger": filesinger, "songid": req.body.songid, "namesong": songchoose.songname, "typerecord": typerecord}
			if(checkvp8 == "true"){
				obj.despath = despathweb
			}else{
				obj.despath = despath
			}
			return res.json(obj)
		}

		function removeSpace(string){
			string = string.split(" ").join("_")
			return string
		}

		async function mixaudio(ffmpegcmd){
			return new Promise((ok, notok) => {
				exec(ffmpegcmd, (error, stdout, stderr) => {
					if (error) {
						console.error(`exec error: ${error}`);
						return;
					}
					console.log("xong")
					ok(true)
				});
			})
		}

		function toArrayBuffer(blob, cb) {
			let fileReader = new FileReader();
			fileReader.onload = function() {
				let arrayBuffer = this.result;
				cb(arrayBuffer);
			};
			fileReader.readAsArrayBuffer(blob);
		}

		function toBuffer(ab) {
			let buffer = new Buffer(ab.byteLength);
			let arr = new Uint8Array(ab);
			for (let i = 0; i < arr.byteLength; i++) {
				buffer[i] = arr[i];
			}
			return buffer;
		}
	}

	static async acceptSongs(req, res){
		let userinfo
		if(req.session.user){
			userinfo = req.session.user
		}
		res.render('acceptsongs.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			userinfo: userinfo,

		});
	}

	static async addNewSongReview(req, res){
		var songname = req.body.namesong
		var singger = req.body.singgername
		var linkyoutube = req.body.linkyoutube
		var flag = ""
		var songid
		res.send("Hệ thống đã tiếp nhận hãy check lại danh sách chờ duyệt sau ít phút")
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
			console.log(flag)
		}

		flag = await AddSong(0)

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


		exec(`python public/pydub/mergemp3.py ${pathsong} ${pathsinger} ${pathmergerfile}`, async (error, stdout,
		) => {
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

	static async ImageForAudio(req, res){

		var songid
		var singer = req.body.singer
		var arrsplit = req.body.songid.split("_")
		if(arrsplit.length > 2){
			arrsplit.pop()
			songid = arrsplit.join("_")
		}else{
			songid = req.body.songid.split("_")[0]
		}
		var datesong = req.body.songid.split("_")[1]
		var pathimage = "public/uploads/" + req.file.filename
		pathimage = removeSpace(pathimage)
		//await writeFile(pathimage, Buffer.from(req.file))
		var imagename = req.file.filename.split('.')
		imagename = imagename[0]
		var videoname = imagename + "_" + songid
		let ffmpegcmd = "ffmpeg -i ./" + pathimage + " -i ./public/songhandled/" + songid + "_" + singer + ".mp4 -map 0:v -map 1:a -c:a copy ./public/uploads/" + videoname + ".mp4"
		var check = await mixaudio(ffmpegcmd)
		var plustime = new Date()
		plustime = plustime.getTime() + (60*60*1000)
		var savesong = SongUserSing({
			uploadsname: `public/uploads/${videoname}.mp4`,
			handledname: `public/songhandled/${songid}_${singer}.mp4`,
			imagename: pathimage,
			expiretime: plustime
		})
		await savesong.save()
		res.send({videoname: videoname, divid: req.body.songid})
		/*		new ffmpeg()
			.addInput(`./${pathimage}`)
			.addInput(`./public/songhandled/${songid}_${singer}.mp4`)
			.audioCodec('copy')
			.outputOptions([
				'-acodec copy',
			])
			.output(`./public/uploads/${videoname}.mp4`)
			.on('progress', function(progress) {
				console.log('Processing: ' + progress.percent + '% done')
			})
			.on('end', async function(stdout, stderr) {
				var plustime = new Date()
				plustime = plustime.getTime() + (60*60*1000)
				var savesong = SongUserSing({
					uploadsname: `public/uploads/${videoname}.mp4`,
					handledname: `public/songhandled/${songid}_${singer}.mp4`,
					imagename: pathimage,
					expiretime: plustime
				})
				await savesong.save()
				res.send({videoname: videoname, divid: req.body.songid})
			})
			.run()*/

		function removeSpace(string){
			string = string.split(" ").join("_")
			return string
		}

		async function mixaudio(ffmpegcmd){
			return new Promise((ok, notok) => {
				exec(ffmpegcmd, (error, stdout, stderr) => {
					if (error) {
						console.error(`exec error: ${error}`);
						return;
					}
					console.log("xong")
					ok(true)
				});
			})
		}
	}

	static checkLogin(req, res, next) {
		try {
			if(req.session.user){
				let data = req.session.user;
				data.user_public_folder = "/public/users/" + data._id;
				//Crate folder for temp
				if (!fs.existsSync(appDir + data.user_public_folder)) {
					fs.mkdirSync(appDir + data.user_public_folder);
				}
			}

		}catch(ex) {
			console.dir(ex);
			next()
			return;
		}
		next()
	}

	static checkToGetTypeVideo(req, res){

		if(fs.existsSync(`./public/videos/${req.body.idsong}_verzip.mp4`)){
			if(fs.existsSync(`./public/videos/${req.body.idsong}480_verzip.mp4`)){
				res.send({check480: true, verzip: true, link480: `${req.body.idsong}480_verzip.mp4`, link: `${req.body.idsong}_verzip.mp4`})
				return
			}
			res.send({check480: false, verzip: true, link: `${req.body.idsong}_verzip.mp4`})
			return
		}

		if (fs.existsSync(`./public/videos/${req.body.idsong}480.mp4`)) {
			res.send({check480: true, verzip: false, link480: `${req.body.idsong}480.mp4`, link: `${req.body.idsong}.mp4`})
			return
		}
		res.send({check480: false, verzip: false, link: `${req.body.idsong}.mp4`})
	}

}

module.exports = Home




