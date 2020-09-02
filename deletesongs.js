var CronJob = require('cron').CronJob;

var job = new CronJob('0 0 */1 * * *', function() {
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
			console.log(now)
			for(var i=0; i<found.length; i++){
				if((now.getTime() - found[i].expiretime.getTime()) > 0){
					console.log(found[i])
					if(fs.existsSync(`./${found[i].uploadsname}`)){
						fs.unlinkSync(`./${found[i].uploadsname}`)
					}
					if(fs.existsSync(`./${found[i].handledname}`)){
						fs.unlinkSync(`./${found[i].handledname}`)
					}
					if(fs.existsSync(`./${found[i].handlednameweb}`)){
						fs.unlinkSync(`./${found[i].handlednameweb}`)
					}
					if(fs.existsSync(`./${found[i].imagename}`)){
						fs.unlinkSync(`./${found[i].imagename}`)
					}
					await SongUserSing.deleteOne({_id: found[i]._id})
				}
			}
		})
	})
}, null, true, 'America/Los_Angeles');
job.start();

