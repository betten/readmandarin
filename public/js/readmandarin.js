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
    $http.get('/api/talks/' + $routeParams.ted_talk_id).success(function(data) {
      var talk = data,
          captions = [];

      for(var i = 0, n = talk.subtitles.zh.count; i < n; i++) {
        captions.push({ 
          en: talk.subtitles.en.text[i],
          zh: talk.subtitles.zh.text[i] //talk.subtitles.zh.html[i]
        });
      }

      $scope.captions = captions;
      $scope.vocab = talk.subtitles.zh.vocab;
    });
  })
  .controller('Add', function($scope, $http, $location) {
    $scope.save = function() {
      $scope.loading = true;
      $http.post('/api/talks/add', $scope.talk).success(function(data) {
        console.log(data);
        $location.path('/talks/' + data.ted_talk_id);
      });
    };
  });
