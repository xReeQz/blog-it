var mongoose = require('mongoose');
var config = require('../config/config');
var Promise = require('bluebird');

Promise.promisifyAll(mongoose);
mongoose.connect(config.mongoose.uri, config.mongoose.options);


module.exports = mongoose;
