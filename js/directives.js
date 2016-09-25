/**
 * Created by User on 25.11.14.
 */
app.directive( 'audioplayer' , function () {
    return {
        template : '<audio id="audio" loop="loop" preload="auto"></audio>' ,
        restrict : 'E' ,
        replace  : true ,
        link     : function ( scope , element , attrs ) {
            var audio = document.getElementById( 'audio' );
            audio.play();
        }
    }
} );
app.directive( 'bird' , ['$window' , 'consts' , function ( $window , consts ) {
    return {
        template : '<div><img class="seagull"></div>' ,
        restrict : 'E' ,
        replace  : true ,
        link     : function ( scope , element , attrs ) {

            var img = element.find( 'img' );
            var waypoints = JSON.parse( attrs['waypoints'] );
            var path = [];
            var createAnimation = function () {
                waypoints.forEach( function ( position , i ) {

                    var nextPositionIndex = ((i + 1) % waypoints.length);
                    var nextPosition = waypoints[nextPositionIndex];
                    var prevPosition = (waypoints[i - 1])
                        ? (waypoints[i - 1])
                        : (waypoints[waypoints.length - 1]);

                    var onComplete = function () {
                        // Последний ли элемент.
                        if ( !waypoints[i + 1] )
                            applyAnimation();

                        var imgFile = calculateVDirection( nextPosition , position );
                        var direction = calculateHDirection( nextPosition , position )
                        var imgPath = 'img/remastered/' + direction + imgFile;
                        img.attr( 'src' , imgPath );
                    };

                    var animPos = {
                        coords     : position ,
                        duration   : calculateDistance( position , prevPosition ) * 175 ,
                        onComplete : onComplete ,
                        easing     : 'linear'
                    };
                    path.push( animPos );

                } );
            };

            var calculateDistance = function ( position , prevPosition ) {
                var y = parseFloat( position.top ) - parseFloat( prevPosition.top );
                var x = parseFloat( position.left ) - parseFloat( prevPosition.left );
                return Math.sqrt( x * x + y * y );
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

            var setVisual = function () {
                var startPosition = path[path.length - 1];
                var nextPositionIndex = ((path.length) % path.length);
                var nextPosition = path[nextPositionIndex];
                var imgType = calculateVDirection( nextPosition.coords , startPosition.coords );
                var direction = calculateHDirection( nextPosition.coords , startPosition.coords );
                var imgPath = 'img/remastered/' + direction + imgType;

                element.css( {
                    'left'     : startPosition.coords.left ,
                    'top'      : startPosition.coords.top ,
                    'position' : 'absolute' ,
                    'z-index'  : 999
                } );
                img.attr( 'src' , imgPath );
            };

            var applyAnimation = function () {
                var that = $( element );
                path.forEach( function ( animPos ) {
                    that.animate( animPos.coords , animPos.duration , animPos.easing , animPos.onComplete );
                } );
            };

            var resizeBird = function () {
                var newHeight = $window.innerHeight / 25;
                var newWidth = newHeight * consts.imgAspectCoeff;
                img.css( 'height' , newHeight ).css( 'width' , newWidth );
            };

            (function init() {
                createAnimation();
                setVisual();
                applyAnimation();
                resizeBird();

                angular.element( $window ).bind( 'resize' , resizeBird );
            })();
        }
    }
}] );

app.directive( 'gamelist' , ['$window' , function ( $window ) {
    return {
        template   : '<div class="select-menu" ng-transclude></div>' ,
        restrict   : 'E' ,
        replace    : true ,
        transclude : true ,
        link       : function ( scope , element , attrs ) {
            var resize = function () {
                element.css( {
                    'font-size'   : $window.innerWidth / 70 + 'px' ,
                    'margin-top'  : $window.innerHeight / 10 + 'px' ,
                    'margin-left' : ($window.innerWidth - parseInt( $( element ).css( 'width' ) )) / 2
                } );
            };
            angular.element( $window ).bind( 'resize' , resize );
            resize();
        }
    }
}] );

app.directive( 'blinkingText' , ['$interval' , function ( $interval ) {
    return function ( scope , element , attrs ) {
        $interval( function () {
            element.toggleClass( 'hidden' );
        } , 750 );
    }
}] );

app.directive( 'background' , ['$interval' , '$window' , function ( $interval , $window ) {
    return {
        scope : true ,
        link  : function ( scope , element , attrs ) {
            scope.screenNumber = attrs['startScreen'];
            var back = null;

            var setVisual = function () {
                back = element.clone();
                element.after( back );

                element.addClass( 'background' );
                element.css( {'zIndex' : -99998} );

                back.addClass( 'background' );
                back.css( {'zIndex' : -99999} );
            };

            var resize = function () {
                var newHeight = $window.innerHeight;
                var newWidth = $window.innerWidth;
                element.css( {'background-size' : newWidth + 'px ' + newHeight + 'px'} )
            };

            var nextScreen = function () {
                var backUrl = "url('/img/remastered/" + scope.screenNumber + "_BACK.png')";
                var imgUrl = "url('/img/remastered/" + scope.screenNumber + ".png')";

                $( element )
                    .animate( {'opacity' : 0} , 75 , function () {
                        element.css( {'background-image' : imgUrl} );
                    } )
                    .animate( {'opacity' : 1} , 500 , function () {
                        back.css( {'background-image' : backUrl} );
                    } );

                scope.screenNumber < 6
                    ? scope.screenNumber++
                    : scope.screenNumber = 0
            };

            var interval = $interval( nextScreen , attrs['interval'] * 1000 );
            angular.element( $window ).bind( 'resize' , resize );

            (function init() {
                setVisual();
                resize();
                nextScreen();
            })();

        }
    }
}] );

app.directive( 'emuboxScale' , ['$window' , function ( $window ) {
    return {
        link : function ( scope , element , attrs ) {

            var resize = function () {
                scope.emulatorWidth = parseInt( 512 ) * ($window.innerWidth / 1440) + 'px';
                scope.emulatorHeight = parseInt( 480 ) * ($window.innerWidth / 1440) + 'px';

                element.css( {'width' : scope.emulatorWidth , 'height' : scope.emulatorHeight} );

                localStorage.setItem( 'emulatorWidth' , scope.emulatorWidth );
                localStorage.setItem( 'emulatorHeight' , scope.emulatorHeight );
            };
            angular.element( $window ).bind( 'resize' , resize );
        }
    }
}] );