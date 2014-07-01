'use strict';

angular.module('starfallxApp')
    .controller('BuildCtrl', function($scope, $http) {
    })
    .controller('FilterCtrl', function($scope, $timeout, $routeParams, courseStore, planBuilder, $rootScope) {
        var acadTime = courseStore.getAcadTime();
        $scope.year = acadTime.year;
        $scope.sem = acadTime.sem;
        $scope.courseList = [];
        $scope.buildingStarted = false;

        $scope.toggleHiddenIndex = function(course) {
            course.showHiddenIndex = !course.showHiddenIndex;
            $scope.$emit('layoutChange');
        }
        
        $scope.toggleSelected = function(course, index) {
            course.indexes[index].selected = !course.indexes[index].selected;
        }

        $scope.search = function () {
            //can click search
            if ($scope.courseList.length == 0) {
                $scope.error.needFixEmptyCourse = true;
                return;
            }

            $scope.buildingStarted = true;
            var startTime = + new Date();
            console.log('start building...');
            // $scope.result = ;
            // var result = planBuilder.solveSync({
                //     courseList: $scope.courseList,
                //     type: "default"
                // });
            // BuildCtrl.$broadcast('searchCompleted', result);
            planBuilder.solveSync({
                courseList: $scope.courseList,
                type: "default"
            });
            console.log('finished in', + new Date() - startTime);
            $scope.buildingStarted = false;
        }

        $scope.$watch(courseStore.initDone, function(value) {
            if (value == true) {
                var courseFilter = courseStore.getFilter();
                // console.log(courseFilter);
                $scope.courseList = [];
                for (var courseCode in courseFilter) {
                    var course = courseStore.getByCodeSync(courseCode);
                    $scope.courseList.push(course);

                    course.hiddenIndexCount = 0;
                    course.indexes.forEach(function(index) {
                        if (index.code in courseFilter[courseCode].indexDict) {
                            index.visible = true;
                            index.selected = true;
                        }
                        else {
                            index.visible = false;
                            course.hiddenIndexCount += 1;
                        }
                    });
                }
                // console.log($scope.courseList);
            }
        })
    })
    .controller('ResultCtrl', function($scope, $rootScope) {
        $scope.result = {};

        $scope.$onRootScope('planBuilder.searchCompleted', function(event, result) {
            // console.log('from result planBuilder service', result);
            console.log('result:');
            console.log(result.courseOrder);
            console.log(result.list);
            console.log(result.dict);
            $scope.result = JSON.parse(JSON.stringify(result));
        });
    });
