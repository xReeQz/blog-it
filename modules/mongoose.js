﻿var mongoose = require('mongoose');
var config = require('../config/config');
var Promise = require('bluebird');
var messages = mongoose.Error.messages;

Promise.promisifyAll(mongoose);
mongoose.connect(config('mongoose:uri'), config('mongoose:options'));
messages.general.required = config('mongoose:messages:required');

module.exports = mongoose;
