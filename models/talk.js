var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TalkSchema = new Schema({
  ted_talk_id: Number,
  title: String,
  subtitles: {
    en: {
      captions: Schema.Types.Mixed,
      text: Schema.Types.Mixed,
      count: Number
    },
    zh: {
      captions: Schema.Types.Mixed,
      text: Schema.Types.Mixed,
      html: Schema.Types.Mixed,
      vocab: Schema.Types.Mixed,
      count: Number
    }
  }
});

TalkSchema.pre('save', function(next) {
  if(this.subtitles.zh.count != undefined && this.subtitles.en.count != undefined && this.subtitles.zh.count != this.subtitles.en.count) {
    console.warn('Subtitles zh count != en count for talk ' + this.id);
  }

  next();
});

var Talk = mongoose.model('Talk', TalkSchema);

module.exports = {
  Talk: Talk
};
