'use strict';

angular.module('starfallxApp')
    .controller('BuildCtrl', function($scope, $http) {
        // $http.get('/api/awesomeThings').success(function(awesomeThings) {
        //     $scope.awesomeThings = awesomeThings;
        // });
    })
    .controller('PrefCtrl', function($scope, NTUScraper){
        $scope.courses = ['IM4791', 'CE4015'];
        $scope.autypes = ['Core', 'UE'];
        $scope.autypes = {
            'CORE': true,
            'UE': false,
            'PE': true
        }
        $scope.newCourse = {
            name: '',
            autypes: {
            'CORE': false,
            'UE': false,
            'PE': false
            }
        }
        $scope.toggleAUType = function(course, autype) {
            if (course.autypes) {
                course.autypes[autype] = !course.autypes[autype];
            } else 
                $scope.autypes[autype] = !$scope.autypes[autype];
        }
        $scope.addCourse = function() {
            console.log('adding new course...');
        }
        // $scope.indexes = ['36788', '36789', '36790', 'Any Index'];
        // $scope.chosenIndex = $scope.indexes[0];
        // $scope.pickIndex = function(index) {
        //     $scope.chosenIndex = index;
        //     $scope.status.isopen = false;
        // }
        // $scope.status = {
        //     isopen: false
        // }
        $scope.pull = function () {
            console.log('pulling data...');
            NTUScraper.pull()
                .success(function(data, status, headers, config) {
                    console.log('data arrived');
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('error', status, headers, config);
                });
        }
    });
