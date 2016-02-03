var express = require('express');
var httpError = require('http-errors');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/return', passport.authenticate('facebook'), (req, res, next) => {
	res.redirect('/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/google/return', passport.authenticate('google'), (req, res, next) => {
	res.redirect('/');
});


router.get('/login', (req, res, next) => {
	res.render('login', {
		title: 'Log In',
		subheading: 'Please, log in using the way that suits you best'
	});	
});

router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/');
});


module.exports = (app) => {
	app.use('/auth', router);
}
