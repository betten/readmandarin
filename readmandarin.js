var request = require('request'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    fs = require('fs');

var Talk = require('./app/models/talk');

ReadMandarin = RM = {};

RM.mongoose = {};
RM.mongoose.db = 'readmandarin';
RM.mongoose.uri = 'mongodb://localhost/' + RM.mongoose.db;

RM.TED = {
  API_KEY: 'thbn678cjn86b5jtunacgque',
  ENGLISH_CODE: 'en',
  MANDARIN_CODE: 'zh-cn'
};

RM.subtitleUrl = function(ted_talk_id, language) {
  return 'https://api.ted.com/v1/talks/' + ted_talk_id + '/subtitles.json?api-key=' + RM.TED.API_KEY + '&language=' + language;
};

RM.mandarinspot = RM.ms = {};
RM.ms.URL = 'http://mandarinspot.com/annotate';
RM.ms.defaultFormData = function() {
  return {
    e: 'utf-8',
    phs: 'pinyin',
    spaces: 'on',
    pr: 'on',
    vocab: 1,
    sort: 'ord'
  };
};

RM.english = RM.en = {};
RM.en.getAndSave = function(talk, callback) {
  var url = RM.subtitleUrl(talk.ted_talk_id, RM.TED.ENGLISH_CODE);

  // request.get(url, function(error, response, body) {
  fs.readFile('json/66.en.json', 'utf8', function(error, body) {
    var json = JSON.parse(body);

    var text = {},
        i = 0;
    
    while(json[i]) {
      text[i] = json[i]['caption']['content'];
      i = i + 1;
    }

    talk.subtitles.en.count = i;
    talk.subtitles.en.captions = json;
    talk.subtitles.en.text = text;
    talk.markModified('subtitles.en');
    talk.save(function(error) {
      if(error) { console.log('Failed to save talk: ' + error); return false; }
      if(callback) { callback(talk); }
    });
  });
};

RM.mandarin = RM.zh = {};
RM.zh.getAndSaveMandarinSpot = function(talk, callback) {
  var zh = [];
  for(var i = 0, n = talk.subtitles.zh.count; i < n; i++) {
    zh.push(talk.subtitles.zh.text[i]);
  }
  var zh_blob = zh.join('\n\n');

  var formData = RM.ms.defaultFormData();
  formData.text = zh_blob;
  
  // request.post({ url: RM.ms.URL, formData: formData }, function(error, response, body) {
  fs.readFile('html/66.mandarinspot.html', 'utf8', function(error, body) {
    var $ = cheerio.load(body);

    var vocab = JSON.parse($($('script').get(1)).html().match(/vocab = (.*?});/)[1]);

    var $content = $('#content');
    $content.find('table').remove(); // removing vocab table
    $content.find(':empty[style]').remove(); // removing empty divs with style attrs
    $content.find('[onclick]').each(function() { $(this).removeAttr('onclick'); }); // removing onclick attrs

    var html = $content.html();
    var delimeter = '<br><br>';
    var lines = html.split(delimeter);
    for(var i = 1, n = lines.length - 1; i < n; i++) {
      lines[i] = '</span>' + lines[i] + '<span class="nann">';
    }

    var html = {};
    for(var i = 0, n = lines.length; i < n; i++) {
      $ = cheerio.load(lines[i]);
      $(':empty').remove();
      html[i] = $.html();
    }

    talk.subtitles.zh.html = html;
    talk.subtitles.zh.vocab = vocab;
    talk.markModified('subtitles.zh');
    talk.save(function(error) {
      if(error) { console.log('Failed to save talk: ' + error); return false; }
      if(callback) callback(talk);
    });
  });

};
RM.zh.getAndSave = function(talk, callback) {
  // request.get(mandarin_url, function(error, response, body) {
  fs.readFile('json/66.zh.json', 'utf8', function(error, body) {
    // for each mandarin, mandarinspot and save
    var json = JSON.parse(body);

    var text = {},
        i = 0;

    while(json[i]) {
      text[i] = json[i]['caption']['content'];
      i = i + 1;
    }

    talk.subtitles.zh.count = i;
    talk.subtitles.zh.captions = json;
    talk.subtitles.zh.text = text;
    talk.markModified('subtitles.zh');
    talk.save(function(error) {
      if(error) { console.log('Failed to save talk: ' + error); return false; }
      
      RM.zh.getAndSaveMandarinSpot(talk, callback);
    });
  });
};

RM.getAndSave = function(ted_talk_id) {
  Talk.remove({ ted_talk_id: ted_talk_id }, function(error) {
    Talk.create({ ted_talk_id: ted_talk_id }, function(error, talk) {
      RM.en.getAndSave(talk);
      RM.zh.getAndSave(talk, function(talk) { console.log('talk id: ' + talk.id); mongoose.disconnect(); });
    });
  });
};

module.exports = ReadMandarin;
