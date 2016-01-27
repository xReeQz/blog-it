var express = require('express');
var router = express.Router();


module.exports = addRouter;


router.get('/', (req, res, next) => {
	res.render('index', { title: 'Generator-Express MVC' });
});

function addRouter(app) {
	app.use('/', router);
}
