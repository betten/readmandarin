var Talk = require('../models/talk'),
    RM = require('../../lib/readmandarin');

var exists = function(ted_talk_id, callback) {
  Talk.count({ ted_talk_id: ted_talk_id }, function(error, count) {
    if(error) return callback(error);
    callback(error, !!count);
  });
};

exports.index = function(req, res) {
  Talk.find({}, 'id ted_talk_id name', function(error, talks) {
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
  var ted_talk_id = req.param('ted_talk_id');

  exists(ted_talk_id, function(error, exists) {
    if(error) return res.send(error);

    if(exists) {
      res.json({ ted_talk_id: ted_talk_id });
    }
    else {
      RM.getAndSave(ted_talk_id, function(error, talk) {
        if(error) return res.send(error);
        res.json({ ted_talk_id: talk.ted_talk_id });
      });
    }
  });
};

exports.exists = function(req, res) {
  var ted_talk_id = req.params.ted_talk_id;

  exists(ted_talk_id, function(error, exists) {
    if(error) return res.send(error);
    res.json({ ted_talk_id: ted_talk_id, exists: exists });
  });
};
