angular.module('ReadMandarin', ['ngRoute', 'ngSanitize'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'Talks',
        templateUrl: 'partials/talks.html'
      })
      .when('/talks', {
        controller: 'Talks',
        templateUrl: 'partials/talks.html'
      })
      .when('/talks/add', {
        controller: 'Add',
        templateUrl: 'partials/add.html'
      })
      .when('/talks/:ted_talk_id', {
        controller: 'Talk',
        templateUrl: 'partials/talk.html'
      })
      .otherwise({
        redirectTo: '/talks'
      });
  })
  .controller('Talks', function($scope, $http) {
    $http.get('/api/talks').success(function(data) {
      $scope.talks = data;
    });
  })
  .controller('Talk', function($scope, $http, $routeParams) {
    $scope.vocab = {};

    $scope.pinyin_visible = true;

    $scope.googleTranslate = function(e) {
      var $target = $(e.target);

      if(($target.hasClass('zh') && $target.parents('.ann').length) || $target.hasClass('zh-text')) { 
        window.open('https://translate.google.com/#zh-CN/en/' + $target.text(), '_blank');
      }
    };

    $scope.lookup = function(e) { 
      var $target = $(e.target);

      if($target.hasClass('zh') && $target.parents('.ann').length) { 
        var vocab = $scope.vocab[$target.text()];
        var $py = $target.siblings('.py');

        var html = '<strong>' + $target.text() + '</strong> (' + vocab[5] + ', <em>' + vocab[0].join(', ') + '</em>)<br />' + vocab[1].join(', ');

        $py.popover({
          content: html,
          html: true,
          placement: 'top',
          trigger: 'manual',
          viewport: 'body'
        }).popover('show');
      } 
    };

    $scope.closePopover = function(e) {
      $('.py').popover('destroy');
    };

    $http.get('/api/talks/' + $routeParams.ted_talk_id).success(function(talk) {
      var captions = [], zh = { html: [], text: [] }, en = [];

      for(var i = 0, n = talk.subtitles.zh.count; i < n; i++) {
        if(i > 0 && talk.subtitles.en.captions[i].caption.startOfParagraph) {
          captions.push({ en: en.join(' '), zh: { html: zh.html.join(' '), text: zh.text.join(' ') } });
          en = [];
          zh.html = [];
          zh.text = [];
        }

        en.push(talk.subtitles.en.text[i]);
        zh.html.push(talk.subtitles.zh.html[i]); 
        zh.text.push(talk.subtitles.zh.text[i]);
      }

      $scope.name = talk.name;
      $scope.captions = captions;
      $scope.vocab = talk.subtitles.zh.vocab;
    });

  })
  .controller('Add', function($scope, $http, $location) {
    $scope.search = function() {
      $http.post('/api/talks/search', { query: $scope.query }).success(function(results) {
        $scope.results = results;
      });
    };

    $scope.save = function(ted_talk_id) {
      $scope.loading = true;
      $http.post('/api/talks/add', { ted_talk_id: ted_talk_id }).success(function(data) {
        $location.path('/talks/' + data.ted_talk_id);
      });
    };
  });
