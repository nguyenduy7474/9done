var mongoose = require('mongoose');

//define schema
var UserReact = mongoose.Schema({
    songusersingid: { type : String , "default" : "mp3" },
    userid: { type : String , "default" : "" },
    react: { type : String , "default" : "" },
    datecreate: Date
});
//create model
module.exports = mongoose.model('userreacts', UserReact, 'userreacts');