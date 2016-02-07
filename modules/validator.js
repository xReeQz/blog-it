var _ = require('lodash');


exports.getErrorMessages = getErrorMessages;
exports.schemas = {
	user: getUserSchema(),
	article: getArticleSchema()
};


function getErrorMessages(errors) {

	return _.map(errors, 'msg');
}

function getUserSchema() {
	return {
		firstName: {
			notEmpty: { errorMessage: 'First name is required.' },
			isLength: {
				options: [{ max: 50 }],
				errorMessage: 'First name must be 50 or less chars long.'
			}
		},
		lastName: {
			notEmpty: { errorMessage: 'Last name is required.' },
			isLength: {
				options: [{ max: 50 }],
				errorMessage: 'Last name must be 50 or less chars long.'
			}
		},
		email: {
			notEmpty: { errorMessage: 'Email is required.' },
			isEmail: { errorMessage: 'Email is invalid.' },
			isEmailUnique: { errorMessage: 'This email is already in use.' },
			isLength: {
				options: [{ max: 100 }],
				errorMessage: 'Email must be 100 or less chars long.'
			}
		},
		password: {
			notEmpty: { errorMessage: 'Password is required.' }
		},
		passwordConfirm: {
			notEmpty: { errorMessage: 'Password confirmation is required.' },
		}
	};
}

function getArticleSchema() {
	return {};
}
