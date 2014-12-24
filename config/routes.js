var talks = require('../app/controllers/talks');

module.exports = function(app) {
  app.get('/', talks.index);
  app.get('/talks', talks.index);
  app.get('/talks/:id', talks.show);
};
