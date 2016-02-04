var util = require('util');
var mongoose = require('./modules/mongoose');
var User = require('./app/models/user');

var user = new User({
	firstName: 'Van',
	lastName: 'Gogh',
	email: 'aarg@a.com',
	password: '123'
});

var validationErr = user.validateSync();
if (validationErr) {
	console.log(`It seems that there're some troubles`);
	console.log(validationErr);
}

user.saveAsync().then(() => { console.log('Done')});