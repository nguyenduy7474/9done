const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
const { getAudioDurationInSeconds } = require('get-audio-duration');


ytdl('http://www.youtube.com/watch?v=A02s8omM_hI', {quality: 'highest'})
  .pipe(fs.createWriteStream('video.mp4'));	
