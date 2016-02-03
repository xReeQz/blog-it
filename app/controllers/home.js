var express = require('express');
var httpError = require('http-errors');
var router = express.Router();

router.get('/', (req, res, next) => {
	res.render('index', {
		title: 'Blog-IT',
		subheading: 'What is IT up to? Find here!'
	});
});


module.exports = app => {
	app.use('/', router);
};
