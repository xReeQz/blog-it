var mongoose = require('../../modules/mongoose');
var helper = require('./_helper');
var Schema = mongoose.Schema;

var schema = new Schema({
	text: String
});


module.exports = mongoose.model('Comment', schema);
