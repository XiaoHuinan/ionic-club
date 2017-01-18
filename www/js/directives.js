// directives is return a fun
angular.module("directives",[])
    .directive("lazyScroll", ["$rootScope", function($rootScope) {
            return {
                restrict: "A",    // attributes
                link: function($scope, $elem) {
                    // scroll not srcoll
                    // hind scroll then every scroll
                    // jq dom bind jq method
                    $elem.bind("scroll", function() {
                        // console.log("scroll");
                        $rootScope.$broadcast("lazyScrollEvent");  
                    });
                } 
            };
    }])
     
     //A jQuery or jqLite wrapper for the browser's window.document object.    $document
    .directive("lazySrc", ["$timeout", function($timeout) {
            return {
                restrict: "A",
                link: function($scope, $elem, $attributes) {
                    console.log("lazySrc");
                    // $on
                    $scope.$on("lazyScrollEvent", function() {
                        if (isInView()) {
                            // elem[0] is the dom not jq elem，because src
                            $elem[0].src = $attributes.lazySrc;
                        }
                    });

                    function isInView() {
                        var clientHeight = document.documentElement.clientHeight;
                        var clientWidth = document.documentElement.clientWidth;
                        var imageRect = $elem[0].getBoundingClientRect();
                        return (imageRect.top >= 0) && (imageRect.bottom <= clientHeight) && (imageRect.left >= 0) && (imageRect.right <= clientWidth);
                    }

                    $timeout(function() {
                        console.log("timeout");
                        if (isInView()) {
                            $elem[0].src = $attributes.lazySrc;
                        }
                    }, 500);
                }
            };
    }]);
