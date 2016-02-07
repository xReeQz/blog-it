var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var _ = require('lodash');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/return', passport.authenticate('facebook'), socialLoginReturn);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/return', passport.authenticate('google'), socialLoginReturn);

router.get('/logout', logout);
router.route('/login').get(loginGet).post(loginPost());
router.route('/signup').get(signupGet).post(signupPost);


module.exports = app => app.use('/auth', router);


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
		var form = req.body;
		var newUser = new User(form);

		validateNewUser(newUser, form)
		.then(validationErrors => {
			if (_.keys(validationErrors).length ||
				_.keys(validationErrors.custom).length) {
				req.session.form = form;
				req.session.errorMessages = getErrorMessages(validationErrors);

				res.redirect('/auth/signup');
			} else {
				return newUser.saveAsync()
					.then(user => {
						return req.login(user, err => {
							if (err) {
								return next(err);
							}

							res.redirect('/');
						});
					});
			}
		})
		.catch(err => next(err));
}

function validateNewUser(user, form) {
	var validationErrors = user.validateSync();
	var isPasswordValid = !!form.password && form.password === form.passwordConfirm;
	var isEmailUnique = false;

	return User.findOne({ email: form.email }).then(user => {
		isEmailUnique = !user;
		validationErrors = validationErrors ? validationErrors.errors : {};
		Object.defineProperty(validationErrors, 'custom', { writable: true, value: {} });

		if (!isPasswordValid) {
			validationErrors.custom.password = { message: 'Password missing or doesn\'t match.' };
		}

		if (!isEmailUnique) {
			validationErrors.custom.email = { message: 'This email is already in use.' };
		}

		return validationErrors;
	});
}

function getErrorMessages(validationErrors) {
	var errorMessages = [];

	if (validationErrors) {
		_.forIn(validationErrors, (value, name) => {
			errorMessages.push(_.upperFirst(value.message));
		});

		_.forIn(validationErrors.custom, (value, name) => {
			errorMessages.push(_.upperFirst(value.message));
		});
	}

	return errorMessages;
}
