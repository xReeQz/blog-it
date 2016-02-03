var express = require('express');
var httpError = require('http-errors');
var passport = require('passport');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/return', passport.authenticate('facebook'), (req, res, next) => {
	res.end(`Goddamn, ${req.user.firstName}, it works`);
});

router.get('/login', (req, res, next) => {
	res.render('login', {
		title: 'Log In',
		subheading: 'Please, log in using the way that suits you best'
	});	
});



module.exports = (app) => {
	app.use('/auth', router);
}
