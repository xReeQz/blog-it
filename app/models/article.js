var mongoose = require('../../modules/mongoose');
var helper = require('./_helper');
var slug = require('slug');
var User = require('./user');
var Comment = require('./comment');
var Schema = mongoose.Schema;

var schema = new Schema({
  author: {
		type: Schema.Types.ObjectId,
		//required: true,
		ref: 'User'
	},
	title: {
		type: String,
		required: true,
		trim: true,
		maxLength: 60
	},
	slug: {
		type: String,
		maxLength: 60
	},
  text: {
		type: String,
		required: true,
		trim: true
	},
	comments: [{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Comment'
	}]
});

schema.virtual('createdAt').get(helper.createdAt);

schema.pre('save', function(next) {
	this.slug = slug(this.title, { lower: true });
	next();
});

module.exports = mongoose.model('Article', schema);
