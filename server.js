var mongoose = require('mongoose'),
    express = require('express'),
    RM = require('./readmandarin.js').RM,
    Talk = require('./models/talk').Talk,
    app = express();

mongoose.connect(RM.mongoose.uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.get('/', function(req, res) {
  Talk.findOne(function(error, talk) {
    if(error) {
      res.send(error, 500);
      return console.error(error);
    }
    if(talk) {
      res.send(talk); 
    }
    else {
      res.send('No talks found...');
    }
  });
});

var server = app.listen(3000, function() {
  console.log('listening: ' + server.address().port);
});
