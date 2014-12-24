var Talk = require('../models/talk');

exports.index = function(req, res) {
  Talk.find({}, 'id ted_talk_id title', function(error, talks) {
    if(error) res.send(error);
    res.json(talks);
  });
};

exports.show = function(req, res) {
  Talk.findOne({ ted_talk_id: req.params.id }, function(error, talk) {
    if(error) res.send(error);
    res.json(talk);
  });
};
