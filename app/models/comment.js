var mongoose = require('mongoose');

//define schema
var Comment = mongoose.Schema({
    songusersingid: { type : String , "default" : "mp3" },
    userid: { type : String , "default" : "" },
    content:{ type : String , "default" : "" },
    datecreate: Date
});
//create model
module.exports = mongoose.model('comments', Comment, 'comments');