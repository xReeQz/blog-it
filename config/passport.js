var passport = require('passport');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');

passport.use(new LocalStrategy({ usernameField: 'email' },
	(email, password, done) => {
		User.findOneAsync({email: email})
			.then(user => {
				if(!user) {
					return done(null, false);
				}
				
				if(!user.checkPassword(password)) {
					return done(null, false);
				}
				
				return done(null, user);
			})
			.catch(err => done(err));
	}));

passport.use(new FacebookStrategy(
	buildOauth2Config('facebook'),
	buildOauth2Verify('facebook')));

passport.use(new GoogleStrategy(
	buildOauth2Config('google'),
	buildOauth2Verify('google')));

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


function buildOauth2Config(provider) {
	return {
		clientID: config(`passport:${provider}:clientID`),
		clientSecret: config(`passport:${provider}:clientSecret`),
		callbackURL: config(`passport:${provider}:callbackURL`)
	};
}

function buildOauth2Verify(provider) {
	return (accessToken, refreshToken, profile, done) => {
		var filter = {};
		filter[provider] = {};
		filter[provider].id = profile.id;

		User.findOneAsync(filter)
			.then(user => {
				if (user) {
					return done(null, user);
				}

				filter.name = profile.displayName;

				var newUser = new User(filter);

				newUser.saveAsync()
					.then(user => done(null, user))
					.catch(err => done(err));
			})
			.catch(err => done(err));
	};
}