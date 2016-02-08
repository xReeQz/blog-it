var express = require('express');
var handlers = require('./handlers/_home');
var router = express.Router();

router.get('/', handlers.get);


module.exports = app => app.use('/', router);
