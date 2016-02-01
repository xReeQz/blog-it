var crypto = require('crypto');
var validator = require('validator');
var util = require('util');
var mongoose = require('../../modules/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		maxLength: 100,
		validate: [validator.isEmail, 'Email is invalid.']
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	}
});

schema.method.checkPassword = (password) => {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

schema.virtual('password').set(function(password) {
	this.salt = Math.random() + '';
	this.hashedPassword = encryptPassword(password, this.salt);
});

schema.static.authorize = (email, password) => {
	var User = this;

	return User.findOneAsync({ email: email })
		.then(user => {
			if (user) {
				if (user.checkPassword(password)) {
					return user;
				} else {
					var err = new Error('Password is wrong.');
					err.name = 'AuthError';
					throw err;
				}
			}

			return null;
		})
};


module.exports = mongoose.model('User', schema);


function encryptPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}
