app.service( 'games' , ['$http',
    function ( $http ) {


        var games = [];
        var promise = $http.get( '/data/games.json' ).success( function ( data ) {
            games = data;
            return data;
        } );

        var getPromise = function () {
            return promise;
        };

        var getGames = function () {
            return games;
        };

        var find = function ( game ) {
            var gameData = '';
            games.forEach( function ( value , key ) {
                if ( value.alias == game ) {
                    gameData = value;
                }
            } );
            return gameData;
        };

        var init = function () {
            getPromise();
        };

        return {
            init : init ,
            getList : getGames ,
            getAsyncList : getPromise ,
            find : find
        };

    }
] );

app.service( 'emubox' , ['$window',
    function ( $window ) {

        var resizeElements = function () {


            console.log()
            var emulator = $( '#emulator' );
            var wrapper = $( '.emulator-wrapper' );

            var emulatorWidth = parseInt( 512 ) * ($window.innerWidth / 1440) + 'px';
            var emulatorHeight = parseInt( 480 ) * ($window.innerWidth / 1440) + 'px';

            emulator.css( {'width' : emulatorWidth , 'height' : emulatorHeight} );
            wrapper.css( {'width' : emulatorWidth , 'height' : emulatorHeight} );

            localStorage.setItem( 'emulatorWidth' , emulatorWidth );
            localStorage.setItem( 'emulatorHeight' , emulatorHeight );
        };


        var loadGame = function ( alias , onResume , onPause , onAfterLoad ) {

            var flashvars = {
                system : 'nes' ,
                url : 'data/roms/' + alias + '.nes' ,
                onResume : onResume ,
                onPause : onPause ,
                onLoadComplete : onAfterLoad
            };
            var params = {};
            var attributes = {};

            params.allowFullScreen = 'true';
            params.allowFullScreenInteractive = 'true';

            swfobject.embedSWF( 'flash/Nesbox.swf' , 'emulator' , '426' , '400' , '11.2.0' , '/flash/expressInstall.swf' , flashvars , params , attributes );
b
        }
        angular.element( $window ).bind( 'resize' , resizeElements );
        return {loadGame : loadGame};

    }
] );


/*app.service( 'animations' , ['$window',
    function ( $window ) {

        var selectMenu = null;
        var birds = [];
        var animations = [];
        var imgAspectCoeff = 3;

        var waypoints = [
            [
                {"left" : "49%" , "top" : "57%"},
                {"left" : "7%" , "top" : "46%"},
                {"left" : "44%", "top" : "9%"},
                {"left" : "7%" , "top" : "43%"},
                {"left" : "49%" , "top" : "57%"},
                {"left" : "70%" , "top" : "26%"},
                {"left" : "75%" , "top" : "32%"},
            ],
            [
                {left : '37%' , top : '9%'},
                {left : '86%' , top : '19%'},
                {left : '31%' , top : '20%'},
                {left : '5%' , top : '45%'},
                {left : '39%' , top : '55%'},
                {left : '80%' , top : '40%'},
                {left : '5%' , top : '45%'},

            ]
        ];


        var createBirds = function () {
            animations.forEach( function ( animSequence , k ) {
                var bird = createBird( animSequence , k );
                birds.push( bird );
            } );
        };

        var createBird = function ( path , k ) {

            var startPosition = path[path.length - 1]
            var view = $( '[ng-view]' );

            var nextPositionIndex = ((path.length) % path.length);
            var nextPosition = path[ nextPositionIndex ];

            var imgType = calculateVDirection( nextPosition.coords , startPosition.coords );
            var direction = calculateHDirection( nextPosition.coords , startPosition.coords );
            var imgPath = '/img/remastered/' + direction + imgType;

            var bird = $( '<img class="seagull" style="left:' + startPosition.coords.left + ';top:' + startPosition.coords.top + '" src="' + imgPath + '" id="bird-' + k + '">' );
            view.append( bird );
            return bird;

        };
        var deleteBirds = function () {
            birds.forEach( function ( elem ) {
                elem.remove();
            } );
            birds = [];
        };

        var refreshBird = function ( k ) {

        };

        var resizeElements = function () {


            birds.forEach( function ( elem ) {
                var newHeight = $window.innerHeight / 25;
                var newWidth = newHeight * imgAspectCoeff;
                elem.css( 'height' , newHeight )
                    .css( 'width' , newWidth );
            } )
        };

        var calculateVDirection = function ( nextPosition , position ) {
            return parseFloat( nextPosition.top ) > parseFloat( position.top )
                ? 'static.png'
                : 'dynamic.gif';
        };

        var calculateHDirection = function ( nextPosition , position ) {
            return parseFloat( nextPosition.left ) > parseFloat( position.left )
                ? 'right'
                : 'left';
        };

        var calculateDistance = function ( position , prevPosition ) {
            var y = parseFloat( position.top ) - parseFloat( prevPosition.top );
            var x = parseFloat( position.left ) - parseFloat( prevPosition.left );
            return Math.sqrt( x * x + y * y );
        };

        var createAnimations = function () {
            waypoints.forEach( function ( path , k ) {

                var animSequence = [];
                path.forEach( function ( position , i ) {

                    var nextPositionIndex = ((i + 1) % path.length);
                    var nextPosition = path[ nextPositionIndex ];
                    var prevPosition = (path[ i - 1 ])
                        ? (path[ i - 1 ])
                        : (path[path.length - 1 ]);

                    var onComplete = function () {
                        // Последний ли элемент.
                        if ( !path[i + 1] )
                            applyAnimation( animations[k] , k );

                        refreshBird( k );

                        var imgFile = calculateVDirection( nextPosition , position );
                        var direction = calculateHDirection( nextPosition , position )
                        var imgPath = '/img/remastered/' + direction + imgFile;
                        $( this ).attr( 'src' , imgPath );
                    };

                    var animPos = {
                        coords : position ,
                        duration : calculateDistance( position , prevPosition ) * 175 ,
                        onComplete : onComplete ,
                        easing : 'linear'
                    };
                    animSequence.push( animPos );
                } );
                animations.push( animSequence );
            } );
        };

        var init = function () {
            if ( animations.length == 0 )
                createAnimations();
            if ( birds.length == 0 )
                createBirds();

            selectMenu = $( '.select-menu' );
            animations.forEach( applyAnimation );
            resizeElements();
        };

        var applyAnimation = function ( animSequence , k ) {
            var that = birds[k];
            animSequence.forEach( function ( animPos ) {
                that.animate( animPos.coords , animPos.duration , animPos.easing , animPos.onComplete );
            } );
        };

        //angular.element( $window ).bind( 'resize' , resizeElements );

        return {
            init : init ,
            deleteBirds : deleteBirds
        };
    }
] );*/
