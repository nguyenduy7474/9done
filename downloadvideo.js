const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require("ffmpeg")
const request = require('request')
const youtubedl = require('youtube-dl')
const download = require('image-downloader')
 
class DownloadYTMp3AndThumbnail{

	async downloadMp3AndThumnailAndGetID(url, desmp3, desthumbnail){
		console.log("what")
		await this.getMp3(url, desmp3)
		console.log("mp3 done")
		await this.getThumbnail(url, desthumbnail)
		console.log("thumbnail done")
		var idvideo = await this.getInfoVideo(url)
		return idvideo
	}

	getMp3(url, desmp3){
		console.log(url)
		return new Promise(function(ok, notok){
			console.log("Sss")
			youtubedl.getInfo(url, [],  function(err, info) {
				let id = extractVideoID(url)
				youtubedl.exec(url, ['-x', '--audio-format', 'mp3', "-o"+ desmp3 + id + ".mp3"], {}, function(err, output) {
					console.log("---------------------")
					if(err) console.log(err)
					console.log("----------------------")
					ok()
				})
			})
		})

		function extractVideoID(url){
			var regExp = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/;
			var match = url.match(regExp);
			if(match){
				return match[1]
			}
		}
	}

	getThumbnail(url, desthumbnail){
		return new Promise(async function(ok, notok){
			youtubedl.getInfo(url, [],  function(err, info) {
				var linkdownload = info.thumbnail
				download.image({
				  url: linkdownload,
				  dest: desthumbnail + info.id + ".jpg"
				})
				.then(({ filename }) => {
					ok()
				})
				.catch((err) => console.error(err))
			})
		})
	}

	getInfoVideo(url){
		return new Promise(async function(ok, notok){
			youtubedl.getInfo(url, [],  function(err, info) {
				ok({title: info.title, id: info.id, duration: info._duration_raw})
			})
		})
	}
}

module.exports = DownloadYTMp3AndThumbnail





