var mongoose = require('mongoose'),
    express = require('express'),
    RM = require('./readmandarin'),
    app = express();

mongoose.connect(RM.mongoose.uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

require('./config/routes')(app);

var server = app.listen(3000, function() {
  console.log('listening: ' + server.address().port);
});
