var talks = require('../app/controllers/talks'),
    path = require('path');

module.exports = function(app) {
  app.get('/api/talks', talks.index);
  app.post('/api/talks/add', talks.add);
  app.get('/api/talks/:id', talks.show);

  app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
};
