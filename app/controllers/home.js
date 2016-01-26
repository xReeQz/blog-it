var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');


module.exports = addRouter;


router.get('/', function (req, res, next) {
    Article.find(function (err, articles) {
        if (err) return next(err);
        res.render('index', {
            title: 'Generator-Express MVC',
            articles: articles
        });
    });
});

function addRouter(app) {
    app.use('/', router);
}
