var express = require('express');
var handlers = require('./handlers/_article');
var router = express.Router();

router.get('/:slug', handlers.get);
//router.route('/create').get(handlers.createGet).post(handlers.createPost);


module.exports = app => app.use('/articles', router);