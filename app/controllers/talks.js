var Talk = require('../models/talk'),
    RM = require('../../lib/readmandarin');

exports.index = function(req, res) {
  Talk.find({}, 'id ted_talk_id title', function(error, talks) {
    if(error) return res.send(error);
    res.json(talks);
  });
};

exports.show = function(req, res) {
  Talk.findOne({ ted_talk_id: req.params.ted_talk_id }, function(error, talk) {
    if(error) return res.send(error);
    res.json(talk);
  });
};

exports.add = function(req, res) {
  RM.getAndSave(req.param('ted_talk_id'), function(error, talk) {
    if(error) return res.send(error);
    res.json({ id: talk.id, ted_talk_id: talk.ted_talk_id });
  });
};

exports.exists = function(req, res) {
  Talk.count({ ted_talk_id: req.params.ted_talk_id }, function(error, count) {
    if(error) return res.send(error);
    res.send({ ted_talk_id: req.params.ted_talk_id, exists: !!count });
  });
};
