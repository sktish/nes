app.service('games', ['$http',
    function ($http) {


        var games = [];
        var promise = $http.get('/data/games.json').success(function (data) {
            games = data;
            return data;
        });

        var getPromise = function () {
            return promise;
        };

        var getGames = function () {
            return games;
        };

        var find = function (game) {
            var gameData = '';
            games.forEach(function (value, key) {
                if (value.alias == game) {
                    gameData = value;
                }
            });
            return gameData;
        };

        var init = function () {
            getPromise();
        };

        return {
            init: init,
            getList: getGames,
            getAsyncList: getPromise,
            find: find
        };

    }
]);

app.service('emubox', ['$window', function ($window) {

    var resizeElements = function () {

        var emulator = $('#emulator');
        var wrapper = $('.emulator-wrapper');

        var emulatorWidth = parseInt(512) * ($window.innerWidth / 1440) + 'px';
        var emulatorHeight = parseInt(480) * ($window.innerWidth / 1440) + 'px';

        emulator.css({'width': emulatorWidth, 'height': emulatorHeight});
        wrapper.css({'width': emulatorWidth, 'height': emulatorHeight});

        localStorage.setItem('emulatorWidth', emulatorWidth);
        localStorage.setItem('emulatorHeight', emulatorHeight);
    };


    var loadGame = function (alias, onResume, onPause, onAfterLoad) {

        var flashvars = {
            system: 'nes',
            url: 'data/roms/' + alias + '.nes',
            onResume: onResume,
            onPause: onPause,
            onLoadComplete: onAfterLoad
        };
        var params = {};
        var attributes = {};

        params.allowFullScreen = 'true';
        params.allowFullScreenInteractive = 'true';

        swfobject.embedSWF('flash/Nesbox.swf', 'emulator', '426', '400', '11.2.0', '/flash/expressInstall.swf', flashvars, params, attributes);

    }
    angular.element($window).bind('resize', resizeElements);
    return {loadGame: loadGame};

}
]);

