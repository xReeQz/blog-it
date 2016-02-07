var User = require('../../models/user');


exports.deletePost = deletePost;


function deletePost(req, res, next) {
	if (!req.user) {
		return next();
	}

	User.removeAsync(req.user)
		.then(() => {
			req.logout();
			res.redirect('/');
		})
		.catch(err => next(err));
}
