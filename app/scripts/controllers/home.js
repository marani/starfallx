'use strict';

angular.module('starfallxApp')
    .controller('HomeCtrl', function($scope, $http) {
        var urlPartials = window.location.href.split('/');
        var base = urlPartials[0] + urlPartials[2];
        $scope.base = urlPartials[0] + '//' + urlPartials[2];
        /* 
        bmlbuild:begin
        $scope.bookmarklet = bookmarklets/planFinder.js;
        bmlbuild:end
        */
        $scope.hint = [undefined, false, false, false, false, false];
        $scope.toggleHint = function(index) {
            $scope.hint[index] = !$scope.hint[index];
        }
        if (!$scope.bookmarklet) {
            $http.get('/bookmarklets/planFinder.js')
                .success(function (data, status, headers, config) {
                    data = data.replace(/%(\d)/g, '% $1');
                    var lastBracket = data.lastIndexOf('()');
                    // console.log(data);
                    $scope.bookmarklet = 'javascript:' + 
                        [data.slice(0, lastBracket + 1), '"' + urlPartials[0] + '//' + urlPartials[2] + '"', data.slice(lastBracket + 1)].join('');
                })
                .error(function (data, status, headers, config) {
                });
        }
    });