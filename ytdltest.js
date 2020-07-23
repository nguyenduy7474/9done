const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
const { getAudioDurationInSeconds } = require('get-audio-duration');


(async() =>{
	var duration = await getAudioDurationInSeconds('./public/uploads/1595417885259.wav')
	console.log(duration)
})()	
