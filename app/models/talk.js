var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TalkSchema = new Schema({
  ted_talk_id: { type: Number, required: true },
  name: String,
  description: String,
  slug: String,
  recorded_at: Date,
  published_at: Date,
  title: String,
  subtitles: {
    en: {
      captions: {},
      text: {},
      count: Number
    },
    zh: {
      captions: {},
      text: {},
      html: {},
      vocab: {},
      count: Number
    }
  }
});

TalkSchema.pre('save', function(next) {
  if(
    this.subtitles.zh.count != undefined && 
    this.subtitles.en.count != undefined && 
    this.subtitles.zh.count != this.subtitles.en.count
  ) {
    console.warn('Subtitles zh count != en count for talk ' + this.id);
  }

  next();
});

module.exports = mongoose.model('Talk', TalkSchema);
