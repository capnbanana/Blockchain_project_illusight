var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var masterpieceSchema = new Schema({
    title: String,
    author: String,
    publishDate: String,
    fileAddr: String,
    price: String,
    txhash: String
});

module.exports = mongoose.model('masterpiece', masterpieceSchema);