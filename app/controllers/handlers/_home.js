var articleService = require('../../services/article-service');


exports.get = get;


function get(req, res, next) {
	articleService.getAll(req.query.searchTerm)
		.then(articles => res.render('index', { 
			articles: articles,
			searchTerm: req.query.searchTerm
		}))
		.catch(err => next(err));
}