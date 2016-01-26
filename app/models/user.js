﻿var Promise = require('bluebird');
var crypto = require('crypto');
var util = require('util');

var mongoose = require('../lib/mongoose');
Promise.promisifyAll(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    salt: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

schema.method('encryptPassword', function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
});

schema.method('checkPassword', function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
});

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    }).get(function () {
        return this._plainPassword;
    });

schema.static('authorize', function(username, password) {
    var User = this;

    return User.findOneAsync({ username: username })
        .then(user => {
            if (user) {
                if (user.checkPassword(password)) {
                    return user;
                } else {
                    throw new AuthError("Password is wrong");
                }
            } else {
                var newUser = new User({ username: username, password: password });
                return newUser.saveAsync().then(user => user);
            }
        })
});

module.exports = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message
}

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';