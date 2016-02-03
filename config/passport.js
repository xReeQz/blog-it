var passport = require('passport');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');

passport.use(new FacebookStrategy({
	clientID: config('passport:facebook:clientID'),
	clientSecret: config('passport:facebook:clientSecret'),
	callbackURL: config('passport:facebook:callbackURL')
}, (accessToken, refreshToken, profile, done) => {
	User.findOneAsync({ facebook: { id: profile.id } })
		.then((user) => {
			if (user) {
				return done(null, user);
			}

			var newUser = new User({
				facebook: { id: profile.id },
				name: profile.displayName
			});

			newUser.saveAsync()
				.then(user => done(null, user))
				.catch(err => done(err));
		})
		.catch(err => done(err));
}));

passport.use(new GoogleStrategy({
	clientID: config('passport:google:clientID'),
	clientSecret: config('passport:google:clientSecret'),
	callbackURL: config('passport:google:callbackURL') 
}, (accessToken, refreshToken, profile, done) => {
	User.findOneAsync({ google: { id: profile.id } })
		.then((user) => {
			if (user) {
				return done(null, user);
			}

			var newUser = new User({
				google: { id: profile.id },
				name: profile.displayName
			});

			newUser.saveAsync()
				.then(user => done(null, user))
				.catch(err => done(err));
		})
		.catch(err => done(err));
}));

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findByIdAsync(id)
		.then(user => {
			if (user) {
				return done(null, user);
			}

			done(new Error('User not found.'));
		})
		.catch(err => done(err));
});


module.exports = passport;
