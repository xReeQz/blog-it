var express = require('express');
var config = require('./config/config');
var port = process.env.PORT || config('port');

var app = express();

require('./config/express')(app, config);

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
