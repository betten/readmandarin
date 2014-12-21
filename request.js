var request = require('request'),
    cheerio = require('cheerio');

// e=utf-8&text=%E9%9D%9E%E5%B8%B8%E6%84%9F%E8%B0%A2%E3%80%82%0D%0A&phs=pinyin&spaces=on&pr=on&vocab=1&sort=ord
var formData = {
  e: 'utf-8',
  phs: 'pinyin',
  spaces: 'on',
  pr: 'on',
  vocab: 1,
  sort: 'ord'
};

formData.text = '我想引用一个 名叫彼得·梅达沃的伟大科学家的话 来结束今天的演讲。 我引用的这句话是： 为人类而敲响的钟声 就像高山上的牛的钟声一样。 它们系在我们的脖子上， 如果它们不能发出和谐悦耳的声音， 那么一定是我们的错。';

request.post({ url: 'http://mandarinspot.com/annotate', formData: formData }, function(error, response, body) {
  var $ = cheerio.load(body);
  var vocab = JSON.parse($($('script').get(1)).html().match(/vocab = ({[^;]*);/)[1]);
  var $content = $('#content');
  $content.find('table').remove(); // removing vocab table
  $content.find(':empty[style]').remove(); // removing empty divs with style attrs
  $content.find('[onclick]').each(function() { $(this).removeAttr('onclick'); }); // removing onclick attrs
  console.log($content.html());
});
