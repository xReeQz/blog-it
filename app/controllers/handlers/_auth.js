var passport = require('passport');
var validator = require('../../../modules/validator');
var User = require('../../models/user');


exports.loginGet = loginGet;
exports.loginPost = loginPost;
exports.logout = logout;
exports.signupGet = signupGet;
exports.signupPost = signupPost;
exports.socialLoginReturn = socialLoginReturn;


function socialLoginReturn(req, res) {
	res.redirect('/');
}

function loginGet(req, res, next) {
	if (req.session.messages) {
		var errorMessage = req.session.messages.pop();
	}

	res.render('login', { errorMessage: errorMessage });
}

function loginPost() {
	return passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureMessage: 'Provided credentials are invalid.'
	});
}

function logout(req, res, next) {
	req.logout();
	res.redirect('/');
}

function signupGet(req, res, next) {
		var errorMessages = req.session.errorMessages || [];
		var form = req.session.form || {};

		delete req.session.errorMessages;
		delete req.session.form;

		res.render('signup', { form: form, errorMessages: errorMessages });
}

function signupPost(req, res, next) {
	req.checkBody(validator.schemas.user);
	req.assert('passwordConfirm', 'Password doesn\'t match.')
		.equals(req.body.password);

	req.asyncValidationErrors()
		.then(signupAndLogin)
		.catch(handleSignupErrors);

	function signupAndLogin() {
		var newUser = new User(req.body);

		return newUser.saveAsync().then(user => {
			req.login(user, err => {
				return err ? next(err) : res.redirect('/');
			});
		});
	}

	function handleSignupErrors(errors) {
		if (errors instanceof Error) {
			return next(errors);
		}

		req.session.form = req.body;
		req.session.errorMessages = validator.getErrorMessages(errors);
		res.redirect('/auth/signup');
	}
}
