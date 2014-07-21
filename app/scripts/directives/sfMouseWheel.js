angular.module('starfallxApp')
    .directive('sfWheel', function($parse) {
        return {
            restrict: 'A',
            link: function($scope, $elem, attr) {
                var expr = $parse(attr['sfWheel']);
                $elem.on('mousewheel', function(event) {
                    $scope.$apply(function() {
                        expr($scope, { $event: event });
                    });
                });
                // $elem.on('mousewheel wheel', function() {
                //     updateBorderGrad();
                // });
            }
        };
    });
