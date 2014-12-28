var mongoose = require('mongoose'),
    express = require('express'),
    RM = require('./lib/readmandarin'),
    app = express(),
    bodyParser = require('body-parser');

mongoose.connect(RM.mongoose.uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// http://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('./public'));

require('./config/routes')(app);


var server = app.listen(process.env.PORT || 3000, function() {
  console.log('listening: ' + server.address().port);
});
