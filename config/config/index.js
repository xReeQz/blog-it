var nconf = require('nconf');
var path = require('path');
var rootPath = path.resolve(__dirname, '../..');
var configPath = path.join(__dirname, 'config.json');

nconf.file({ file: configPath }).argv().env();


module.exports = (key, isEnv) => {
	var env = nconf.get('NODE_ENV');
	
	return isEnv
		? nconf.get(`${key}`)
		: !!key
			? key === 'root'
				? rootPath
				: nconf.get(`${env}:${key}`)
			: nconf.get(`${env}`);
};
