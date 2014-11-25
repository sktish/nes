app.controller('ScreenCtrl', ['$scope', '$http', '$interval', '$rootScope', 'games',
    function ($scope, $http, $interval, $rootScope, games) {

        $rootScope.title = 'A bit of nostalgia.';
        $scope.screenNumber = 0;
        $scope.games = games.getList();

        var interval;

        $scope.init = function () {
            $scope.changeScreen();
            $scope.setTimer();
        };

        $scope.setTimer = function () {
            interval = $interval($scope.changeScreen, 5000);
        };

        $scope.changeScreen = function () {
            $.backstretch("/img/remastered/" + $scope.screenNumber + ".png", {speed: 500});
            $scope.screenNumber < 7
                ? $scope.screenNumber++
                : $scope.screenNumber = 0

        };
        $scope.gameNumber = function (index) {
            var string = index.toString();
            var nullCount = new Array(5 - string.length);
            return nullCount.join('0') + string;
        };

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
            $('.backstretch').remove();
        });
    }
])
;

app.controller('GamesCtrl', ['$scope', '$routeParams', 'emubox', '$rootScope', 'games', '$interval',
    function ($scope, $routeParams, emubox, $rootScope, games, $interval) {

        var view = $('[ng-view]');
        var textBlinking = null;

        $scope.gameData = null;
        $scope.alias = $routeParams.alias;


        $scope.init = function () {

            var onResume = '' +
                '$( ".emulator-wrapper, #emulator" ).css( {"width" : localStorage.getItem("emulatorWidth") , "height" : localStorage.getItem("emulatorHeight") });' +
                '$( ".game-extended" ).removeClass("pause").addClass("active");';

            var onPause = '' +
                '$( ".game-extended" ).removeClass("active").addClass("pause");' +
                '$( document ).on( "click" , function () {' +
                'document.getElementById( "emulator" ).resume(); ' +
                '$( "#emulator" ).focus();' +
                '$(this).unbind("click")' +
                '} )';

            var onAfterLoad = '' +
                '$(".loading-text").addClass("hidden");$(".press-start-text").removeClass("hidden");';

            emubox.loadGame($scope.alias, onResume, onPause, onAfterLoad);
            $scope.setGameData();
            $scope.setVisual();
        };

        $scope.setVisual = function () {
//            textBlinking = $interval( function () {
//                $( '.blinking-text' ).fadeToggle( 0 )
//            } , 750 );
        };

        $scope.setGameData = function () {
            $scope.gameData = games.find($scope.alias);
            $rootScope.title = $scope.gameData.name;
        }

    }
]);

