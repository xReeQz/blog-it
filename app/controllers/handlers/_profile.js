var User = require('../../models/user');
var httpError = require('http-errors');


exports.deleteProfile = deleteProfile;


function deleteProfile(req, res, next) {
	if (!req.user) {
		return next(new httpError.BadRequest('User not found.'));
	}

	User.findOneAsync({ id: req.user.id })
		.then(updateIsActiveFlag)
		.then(logoutAndRedirect)
		.catch(err => next(err));
		
	function updateIsActiveFlag(user) {
		if (!user) {
			throw new httpError.BadRequest('User not found.');
		}
		
		return user.updateAsync({ isActive: false });
	}
	
	function logoutAndRedirect() {
		req.logout();
		res.redirect('/');
	}
}
