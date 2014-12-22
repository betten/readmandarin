var request = require('request'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose');

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

RM.parseAndSave = function(ted_talk_id) {
  var english_url = RM.subtitleUrl(ted_talk_id, RM.TED.ENGLISH_CODE),
      mandarin_url = RM.subtitleUrl(ted_talk_id, RM.TED.MANDARIN_CODE);

  request.get(english_url, function(error, response, body) {
    // save english
  });

  request.get(mandarin_url, function(error, response, body) {
    // for each mandarin, mandarinspot and save
  });
};

var ted_talk_id = process.argv[2];

RM.parseAndSave(ted_talk_id);

// get zh-cn
// how to save all async?
// get en

// request.get('https://api.ted.com/v1/talks/1/subtitles.json?api-key=thbn678cjn86b5jtunacgque&language=zh-cn', function(error, response, body) {
//   var resp = JSON.parse(body);
//   console.log(resp);
// });

// // e=utf-8&text=%E9%9D%9E%E5%B8%B8%E6%84%9F%E8%B0%A2%E3%80%82%0D%0A&phs=pinyin&spaces=on&pr=on&vocab=1&sort=ord
// var formData = {
//   e: 'utf-8',
//   phs: 'pinyin',
//   spaces: 'on',
//   pr: 'on',
//   vocab: 1,
//   sort: 'ord'
// };
// 
// formData.text = '我想引用一个 名叫彼得·梅达沃的伟大科学家的话 来结束今天的演讲。 我引用的这句话是： 为人类而敲响的钟声 就像高山上的牛的钟声一样。 它们系在我们的脖子上， 如果它们不能发出和谐悦耳的声音， 那么一定是我们的错。';
// 
// request.post({ url: 'http://mandarinspot.com/annotate', formData: formData }, function(error, response, body) {
//   var $ = cheerio.load(body);
//   var vocab = JSON.parse($($('script').get(1)).html().match(/vocab = ({[^;]*);/)[1]);
//   var $content = $('#content');
//   $content.find('table').remove(); // removing vocab table
//   $content.find(':empty[style]').remove(); // removing empty divs with style attrs
//   $content.find('[onclick]').each(function() { $(this).removeAttr('onclick'); }); // removing onclick attrs
//   console.log($content.html());
// });