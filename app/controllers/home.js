var express = require('express');
var router = express.Router();


module.exports = addRouter;


router.get('/', (req, res, next) => {
	res.render('index', { title: 'Welcome to Blog-IT' });
});

function addRouter(app) {
	app.use('/', router);
}
