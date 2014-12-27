var mongoose = require('mongoose'),
    RM = require('./readmandarin'),
    Talk = require('../app/models/talk');

mongoose.connect(RM.mongoose.uri);

module.exports = {
  mongoose: mongoose,
  RM: RM,
  Talk: Talk
};
