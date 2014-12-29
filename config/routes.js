var talks = require('../app/controllers/talks'),
    path = require('path');

module.exports = function(app) {
  app.get('/api/talks', talks.index);
  app.post('/api/talks/search', talks.search);
  app.post('/api/talks/add', talks.add);
  app.get('/api/talks/exists/:ted_talk_id', talks.add);
  app.get('/api/talks/:ted_talk_id', talks.show);

  app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
};
