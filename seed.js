var util = require('util');
var mongoose = require('./modules/mongoose');
var User = require('./app/models/user');

var user = new User({ email: 'a@a.com', password: '123' });

console.log(user);

user.validateAsync()
	.then(result => {
		console.log(result);
	})
	.catch(err => {
		console.log(err);
	});
