var mongoose = require('mongoose'),
    RM = require('./readmandarin');

var ted_talk_id = process.argv[2];

mongoose.connect(RM.mongoose.uri);

var db = mongoose.connection;
db.once('open', function() {
  RM.getAndSave(ted_talk_id);
});
