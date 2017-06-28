const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  config = require("./cnfg").server,
  app = express();



app.use('/image', express.static(__dirname + '/storage'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// var routes = require('./routes/')(app);

var server = app.listen(config.port, () => console.log(`server was started on port : ${config.port}`));

module.exports = app;
//////////////////////////////Registration///////////////////////////////////////// 
// require('../routes/registration')(app);
//////////////////////////////API//////////////////////////////////////////////////

require('./connections/db');
require('./routes/index')(app);
