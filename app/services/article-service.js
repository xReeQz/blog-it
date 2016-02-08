var _ = require('lodash');
var Promise = require('bluebird');
var Article = require('../models/article');
var User = require('../models/user');


exports.getBySlug = getBySlug;
exports.getAll = getAll;


function getBySlug(slug) {
	return new Promise((resolve, reject) => {
		if (!slug) {
			return resolve(null);
		}

		Article.findOne({ slug: slug })
			.populate('author')
			.execAsync()
			.then(article => resolve(article))
			.catch(err => reject(err));
	});
}

function getByAuthor(authorId) {
	return new Promise((resolve, reject) => {
		if (!authorId) {
			return resolve([]);
		}

		Article.find({ author: authorId })
			.populate('author')
			.execAsync()
			.then(articles => resolve(articles))
			.catch(err => reject(err));
	});
}

function getAll(searchTerm) {
	var regExp = new RegExp(searchTerm || '.', 'i');

	return User.find({})
		.or([{ firstName: regExp }, { lastName: regExp }])
		.execAsync()
		.then(findArticles);

	function findArticles(authors) {
		var authorIds = _.map(authors, '_id');

		return Article.find({})
			.or([{ title: regExp }, { author: { $in: authorIds } }])
			.populate('author')
			.execAsync();
	}
}