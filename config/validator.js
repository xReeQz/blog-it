var User = require('../app/models/user');


module.exports = {
	customValidators: {
		isEmailUnique: function (value) {
			return User.findOneAsync({ email: value })
				.then(user => {
					if (user) {
						throw new Error('This email is already in use.');
					}
					
					return true;
				});
		}
	}
}
