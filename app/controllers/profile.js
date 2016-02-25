var express = require('express');
var passport = require('passport');
var handlers = require('./handlers/_profile');
var router = express.Router();

router.post('/delete', handlers.deleteProfile);


module.exports = app => app.use('/profile', router);
