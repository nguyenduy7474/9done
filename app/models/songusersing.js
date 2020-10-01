var mongoose = require('mongoose');

//define schema
var SongUserSing = mongoose.Schema({
    datatype: { type : String , "default" : "mp3" },
    userid: { type : String , "default" : "" },
    username: { type : String , "default" : "" },
    handledname: { type : String , "default" : "" },
    songid: { type : String , "default" : "" },
    view: { type : Number , "default" : 0 },
    timeupload: Date
});
//create model
module.exports = mongoose.model('songusersing', SongUserSing, 'songusersing');