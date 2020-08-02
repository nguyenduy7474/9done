var CronJob = require('cron').CronJob;

var job = new CronJob('00 59 * * * *', function() {
	const mongoose = require('mongoose');
	var Songs = require('./app/models/songs');
	var SongUserSing = require('./app/models/songusersing');
	const fs = require('fs');
	mongoose.connect('mongodb://127.0.0.1:27017/singwithyou', {useNewUrlParser: true});
	const db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', function() {
		SongUserSing.find({}, async (err, found) => {
			var now = new Date()
			for(var i=0; i<found.length; i++){
				if((now.getTime() - found[i].expiretime.getTime()) > 0){
					console.log(found[i])
					fs.unlinkSync(`./${found[i].uploadsname}`)
					fs.unlinkSync(`./${found[i].handledname}`)
					await SongUserSing.deleteOne({_id: found[i]._id})
				}
			}
		})
	})
}, null, true, 'America/Los_Angeles');
job.start();

