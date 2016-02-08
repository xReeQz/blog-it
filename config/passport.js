var _ = require('lodash');
var passport = require('passport');
var config = require('./config');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');

passport.use(new LocalStrategy({ usernameField: 'email' },
	(email, password, done) => {
		User.findOneAsync({ email: email })
			.then(user => {
				if (!user) {
					return done(null, false);
				}

				if (!user.checkPassword(password)) {
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
		callbackURL: config(`passport:${provider}:callbackURL`),
		profileFields: ['emails', 'displayName']
	};
}

function buildOauth2Verify(provider) {
	return (accessToken, refreshToken, profile, done) => {
		var filter = {};
		var email = _.map(profile.emails, 'value')[0];

		if (email) {
			filter.email = email;
		} else {
			filter[provider] = {};
			filter[provider].id = profile.id;
		}

		User.findOneAsync(filter)
			.then(user => {
				if (user) {
					if (!(user[provider].id && user.email)) {
						return updateAndProceed(user);
					}

					return user;
				}

				return createNewAndProceed();
			})
			.then(user => done(null, user))
			.catch(err => done(err))

		function createNewAndProceed() {
			var newUser = new User({
				email: email,
				name: profile.displayName,
			});

			newUser[provider].id = profile.id;

			return newUser.saveAsync();
		}

		function updateAndProceed(user) {
			var update = {};

			update.email = email;
			update[provider] = {};
			update[provider].id = profile.id
			
			return user.updateAsync(update)
				.then(() => user);
		}
	};
}

