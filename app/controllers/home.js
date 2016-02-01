var express = require('express');
var router = express.Router();


module.exports = addRouter;


router.get('/', (req, res, next) => {
	res.render('index', { title: 'Blog-IT', subheading: 'What is IT up to? Find here!' });
});

function addRouter(app) {
	app.use('/', router);
}
