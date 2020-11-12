var mongoose = require('mongoose');

//define schema
var Posts = mongoose.Schema({
    datatype: { type : String , "default" : "post" },
    title: String,
    slug: String,
    content: String,
    thumbnail: String,
    showpost: { type : Number , "default" : 0},
    datecreated: Date
});

//create model
module.exports = mongoose.model('posts', Posts, 'posts');