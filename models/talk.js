var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TalkSchema = new Schema({
  ted_talk_id: Number,
  title: String,
  subtitles: {
    en: {
      captions: Schema.Types.Mixed,
      text: Schema.Types.Mixed
    },
    zh: {
      captions: Schema.Types.Mixed,
      text: Schema.Types.Mixed,
      html: Schema.Types.Mixed,
      vocab: Schema.Types.Mixed
    },
    count: Number
  }
});

var Talk = mongoose.model('Talk', TalkSchema);

module.exports = {
  Talk: Talk
};
