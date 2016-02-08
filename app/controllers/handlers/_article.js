var articleService = require('../../services/article-service');
var httpError = require('http-errors');


exports.get = get;


function get(req, res, next) {
	articleService.getBySlug(req.params.slug)
		.then(article => {
			if (!article) {
				return next(new httpError.NotFound('Article not found.'));
			}

			res.render('article', article);
		})
		.catch(err => next(err));
}