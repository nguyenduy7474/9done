const fs = require('fs');
const ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
const { getAudioDurationInSeconds } = require('get-audio-duration');

var rawStr = "nguyễn '"
var encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
});

console.log(encodedStr)
