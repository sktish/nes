app.controller('ScreenCtrl', ['$scope', '$http', '$interval', '$rootScope', 'games',
    function ($scope, $http, $interval, $rootScope, games) {

        $rootScope.title = 'A bit of nostalgia.';
        $scope.screenNumber = 0;
        $scope.games = games.getList();

        $scope.gameNumber = function (index) {
            var string = index.toString();
            var nullCount = new Array(5 - string.length);
            return nullCount.join('0') + string;
        };

    }
])
;

app.controller('GamesCtrl', ['$scope', '$routeParams', 'emubox', '$rootScope', 'games',
    function ($scope, $routeParams, emubox, $rootScope, games) {

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
                '$(".game-extended").removeClass("loading")';

            emubox.loadGame($scope.alias, onResume, onPause, onAfterLoad);
            $scope.setGameData();
        };


        $scope.setGameData = function () {
            $scope.gameData = games.find($scope.alias);
            $rootScope.title = $scope.gameData.name;
        }

    }
]);

