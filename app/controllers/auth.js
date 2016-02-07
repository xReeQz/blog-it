var express = require('express');
var passport = require('passport');
var handlers = require('./handlers/_auth');
var router = express.Router();

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/return', passport.authenticate('facebook'), handlers.socialLoginReturn);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/return', passport.authenticate('google'), handlers.socialLoginReturn);

router.get('/logout', handlers.logout);
router.route('/login').get(handlers.loginGet).post(handlers.loginPost());
router.route('/signup').get(handlers.signupGet).post(handlers.signupPost);


module.exports = app => app.use('/auth', router);
