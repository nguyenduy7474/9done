var mongoose = require('mongoose');

//define schema
var Posts = mongoose.Schema({
    datatype: { type : String , "default" : "post" },
    title: String,
    content: String,
    thumbnail: String,
    datecreated: Date
});

//create model
module.exports = mongoose.model('posts', Posts, 'posts');