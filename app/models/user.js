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
		maxLength: 100,
		validate: [validator.isEmail, 'Email is invalid.']
	},
	facebook: { id: { type: String, unique: true } },
	google: { id: { type: String, unique: true } },
	hashedPassword: { type: String },
	salt: { type: String },
	createdDate: { type: Date, default: Date.now }
});

schema.method.checkPassword = (password) => {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

schema.virtual('password').set(function(password) {
	this.salt = Math.random() + '';
	this.hashedPassword = encryptPassword(password, this.salt);
});

schema.virtual('name').set(function(fullName) {
	var nameParts = fullName.split(' ');
	
	this.firstName = nameParts[0];
	this.lastName = nameParts[1];
});


module.exports = mongoose.model('User', schema);


function encryptPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}
