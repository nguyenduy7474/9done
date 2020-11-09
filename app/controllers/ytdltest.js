const download = require('image-downloader')
const fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

new ffmpeg()
    .addInput(`../../2lB9pOjwO9s.webm`)
    .addOption('-preset', 'veryslow')
    .output(`./2lB9pOjwO9s_verzip.mp4`)
    .on('progress', function(progress) {
        console.log('Processing: ' + progress.percent + '% done')
    })
    .on('end', async function(stdout, stderr) {
        console.log("ss")
        ok("ok")
    })
    .run()