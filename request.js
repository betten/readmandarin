var request = require('request');

// e=utf-8&text=%E9%9D%9E%E5%B8%B8%E6%84%9F%E8%B0%A2%E3%80%82%0D%0A&phs=pinyin&spaces=on&pr=on&vocab=1&sort=ord
var formData = {
  e: 'utf-8',
  phs: 'pinyin',
  spaces: 'on',
  pr: 'on',
  vocab: 1,
  sort: 'ord'
};

formData.text = '非常感谢。';

request.post({ url: 'http://mandarinspot.com/annotate', formData: formData }, function(error, response, body) {
  console.log(body);
});
