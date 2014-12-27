var request = require('request'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    fs = require('fs');

var Talk = require('../app/models/talk');

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
  callback = callback || function() {};

  var url = RM.subtitleUrl(talk.ted_talk_id, RM.TED.ENGLISH_CODE);
  console.log(url);

  request.get(url, function(error, response, body) {
  // fs.readFile('json/66.en.json', 'utf8', function(error, body) {
    if(error) return callback(error);

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
      if(error) { console.log('Failed to save talk: ' + error); return callback(error); }
      callback(null, talk);
    });
  });
};

RM.mandarin = RM.zh = {};
RM.zh.getAndSaveMandarinSpot = function(talk, callback) {
  callback = callback || function() {};

  var zh = [];
  for(var i = 0, n = talk.subtitles.zh.count; i < n; i++) {
    zh.push(talk.subtitles.zh.text[i]);
  }
  var zh_blob = zh.join('\n\n');

  var formData = RM.ms.defaultFormData();
  formData.text = zh_blob;
  
  console.log(RM.ms.URL);

  request.post({ url: RM.ms.URL, formData: formData }, function(error, response, body) {
  // fs.readFile('html/66.mandarinspot.html', 'utf8', function(error, body) {
    if(error) return callback(error);

    var $ = cheerio.load(body);

    var vocab = JSON.parse($($('script').get(1)).html().match(/vocab = (.*?});/)[1]);

    // div with title 'Click a word to add ...' contains the nodes we want
    var $content = $('#content').find('div[title]'); 
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
      if(error) { console.log('Failed to save talk: ' + error); return callback(error); }
      callback(null, talk);
    });
  });

};
RM.zh.getAndSave = function(talk, callback) {
  callback = callback || function() {};

  var url = RM.subtitleUrl(talk.ted_talk_id, RM.TED.MANDARIN_CODE);
  console.log(url);

  request.get(url, function(error, response, body) {
  // fs.readFile('json/66.zh.json', 'utf8', function(error, body) {
    // for each mandarin, mandarinspot and save
    if(error) return callback(error);

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
      if(error) { console.log('Failed to save talk: ' + error); return callback(error); }
      
      RM.zh.getAndSaveMandarinSpot(talk, callback);
    });
  });
};

RM.TED.talks = {};
RM.TED.talks.query = function(ted_talk_id, callback) {
  var url = 'https://api.ted.com/v1/talks/' + ted_talk_id + '.json?api-key=' + RM.TED.API_KEY;
  console.log(url);

  request.get(url, function(error, response, body) {
    callback.apply(this, arguments);
  });
};

RM.getAndSave = function(ted_talk_id, callback) {
  callback = callback || function() {};

  Talk.remove({ ted_talk_id: ted_talk_id }, function(error) {
    if(error) return callback(error);

    RM.TED.talks.query(ted_talk_id, function(error, response, body) {
      var json = JSON.parse(body);

      // TODO check json.languages for 'zh-cn' key

      var talk = {
        ted_talk_id:  json.talk.id,
        name:         json.talk.name,
        description:  json.talk.description,
        slug:         json.talk.slug,
        recorded_at:  json.talk.recorded_at,
        published_at: json.talk.published_at
      };

      Talk.create(talk, function(error, talk) {
        if(error) return callback(error);

        RM.zh.getAndSave(talk, function(error, talk) { 
          if(error) return callback(error);
          RM.en.getAndSave(talk, function(error, talk) {
            callback(error, talk);
          });
        });

      });
    });
  });
};

module.exports = ReadMandarin;
