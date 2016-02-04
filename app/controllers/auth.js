var express = require('express');
var httpError = require('http-errors');
var validator = require('validator');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/return', passport.authenticate('facebook'), (req, res) => {
	res.redirect('/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/return', passport.authenticate('google'), (req, res) => {
	res.redirect('/');
});


router.route('/login')
	.get((req, res) => {
		res.render('login', { errorMessage: req.session.messages.pop() });
	})
	.post(passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/auth/login',
		failureMessage: 'Provided credentials are invalid.'
	}));

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


module.exports = (app) => {
	app.use('/auth', router);
}
