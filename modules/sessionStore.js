var Promise = require('bluebird');
var mongoose = require('./mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
Promise.promisifyAll(sessionStore);

module.exports = sessionStore;