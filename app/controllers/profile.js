var express = require('express');
var passport = require('passport');
var handlers = require('./handlers/_profile');
var router = express.Router();

router.post('/delete', handlers.deletePost);


module.exports = app => app.use('/profile', router);
