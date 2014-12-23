var talks = require('../app/controllers/talks');

module.exports = function(app) {
  app.get('/', talks.index);
};
