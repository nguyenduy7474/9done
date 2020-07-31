const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require("ffmpeg")
const request = require('request')
const youtubedl = require('youtube-dl')
const download = require('image-downloader')
 
class DownloadYTMp3AndThumbnail{

	async downloadMp3AndThumnailAndGetID(url, desmp3, desthumbnail){
		console.log("111")
		await this.getMp3(url, desmp3)
		console.log("mp3 done")
		await this.getThumbnail(url, desthumbnail)
		console.log("thumbnail done")
		var idvideo = await this.getInfoVideo(url)
		return idvideo
	}

	getMp3(url, desmp3){
		return new Promise(function(ok, notok){
			youtubedl.getInfo(url, [],  function(err, info) {
				console.log(desmp3)
				youtubedl.exec(url, ['-x', '--audio-format', 'mp3', "-o"+ desmp3 + info.id + ".mp3"], {}, function(err, output) {
					if(err) console.log(err)
					ok()
				})
			})

		})
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





