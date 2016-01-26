var path = require('path');
var rootPath = path.join(__dirname, '..');
var env = process.env.NODE_ENV || 'development';

var config = {
	development: {
		root: rootPath,
		app: {
			name: 'blog-it'
		},
    mongoose: {
			uri: 'mongodb://localhost/blog-it-dev',
			options: {
				server: {
					socketOptions: {
						keepAlive: 1
					}
				}
			}
    },
    session: {
			secret: 'Let it be stunning!',
			key: 'sid'
    },
		port: 3000
	},

	production: {
		root: rootPath,
		app: {
			name: 'blog-it'
		},
    mongoose: {
			uri: 'mongodb://localhost/blog-it-prod',
			options: {
				server: {
					socketOptions: {
						keepAlive: 1
					}
				}
			}
    },
    session: {
			secret: 'Let it be stunning!',
			key: 'sid'
    },
		port: 8080
	}
};


module.exports = config[env];
