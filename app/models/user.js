var crypto = require('crypto');
var mongoose = require('../../modules/mongoose');
var helper = require('./_helper');
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
		sparse: true,
		maxLength: 100
	},
	facebook: { id: { type: String, unique: true, sparse: true } },
	google: { id: { type: String, unique: true, sparse: true } },
	hashedPassword: { type: String },
	salt: { type: String },
	isActive: { type: Boolean, required: true, default: true }
});

schema.methods.checkPassword = function (password) {
	return encryptPassword(password, this.salt) === this.hashedPassword;
};

schema.virtual('password').set(function (password) {
	this.salt = Math.random() + '';
	this.hashedPassword = encryptPassword(password, this.salt);
});

schema.virtual('createdAt').get(helper.createdAt);

schema.virtual('name')
	.set(function (fullName) {
		var nameParts = fullName.split(' ');

		this.firstName = nameParts[0];
		this.lastName = nameParts[1];
	})
	.get(function() {
		return `${this.firstName} ${this.lastName}`;
	});


module.exports = mongoose.model('User', schema);


function encryptPassword(password, salt) {
	return crypto.createHmac('sha1', salt).update(password).digest('hex');
}
