var mongoose = require('mongoose'),
    RM = require('./lib/readmandarin');

var ted_talk_id = process.argv[2];

mongoose.connect(RM.mongoose.uri);

var db = mongoose.connection;
db.once('open', function() {
  RM.getAndSave(ted_talk_id, function(error, talk) {
    if(error) {
      console.log(error);
    }
    else {
      console.log('talk id: ' + talk.id); 
    }
    mongoose.disconnect(); 
  });
});
