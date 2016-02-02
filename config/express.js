var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var compress = require('compression');
var methodOverride = require('method-override');
var httpError = require('http-errors');
var path = require('path');

var sessionStore = require('../modules/sessionStore');


module.exports = (app, config) => {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', path.join(config('root'), '/app/views'));
  app.set('view engine', 'jade');

  // app.use(favicon(paht.join(config('root'), '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
	app.use(session({
		secret: config('session:secret'),
		name: config('session:name'),	
    resave: true,
    saveUninitialized: true,
    store: sessionStore
	}));
  app.use(compress());
  app.use(express.static(path.join(config('root'), '/public')));
  app.use(methodOverride());

  var controllers = glob.sync(path.join(config('root'), '/app/controllers/*.js'));
  controllers.forEach((controller) => {
    require(controller)(app);
  });

  app.use((req, res, next) => {
    next(new httpError.NotFound('Page not found'));
  });

  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      err.status = err.status || 500;		
			res.status(err.status);
      res.render('error', {
        error: err
      });
    });
  }

  app.use((err, req, res, next) => {
		err.status = err.status || 500;		
    res.status(err.status);
		res.render('error', {
			error: { 
				status: err.status,
				message: err.message
			}
		});
  });
};
