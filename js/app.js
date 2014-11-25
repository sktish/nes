var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/main-screen.html',
            controller: 'ScreenCtrl',
            resolve: {
                gameData: function (games) {
                    return games.getAsyncList();
                }
            }
        }).
        when('/games/:alias', {
            templateUrl: 'partials/game.html',
            controller: 'GamesCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

app.constant('consts', {
    'imgAspectCoeff': 3
});