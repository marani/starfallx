'use strict';

angular.module('starfallxApp')
    .controller('BuildCtrl', function($scope, $http) {
    })
    .controller('PrefCtrl', function($scope, courseStore) {
        function emptyNewCourse() {
            return {
                name: '',
                code: '',
                auTypes: {
                    'CORE': false,
                    'UE': false,
                    'PE': false
                },
                status: {
                    submitted: false,
                    added: false,
                    invalid: true
                }
            }
        }
        var acadTime = courseStore.getAcadTime();
        $scope.year = acadTime.year;
        $scope.sem = acadTime.sem;
        $scope.courseList = [];
        $scope.newCourse = emptyNewCourse();

        // sync check
        // $scope.$watch()
        $scope.onCourseCodeChange = function() {
            console.log('change!');
            if ($scope.newCourse.code) 
                $scope.newCourse.code = $scope.newCourse.code.trim().toUpperCase();

            $scope.newCourse.status.submitted = false;

            $scope.newCourse.status.added = false;
            for (var i = 0; i < $scope.courseList.length; i++)
                if ($scope.courseList[i].code == $scope.newCourse.code)
                    $scope.newCourse.status.added = true;

            $scope.newCourse.status.invalid = !($scope.newCourse.code) || 
                !(($scope.newCourse.code.length >=5 ) && ($scope.newCourse.code.length <= 6) && 
                /^[a-z]+[0-9]+[a-z]*$/i.test($scope.newCourse.code));
        }
        // async check
        $scope.addCourse = function() {
            $scope.newCourse.status.submitted = true;
            console.log('Searching for course...');

            courseStore.getByCode($scope.newCourse.code, 
                function success(course) {
                    if (course && (course != "null")) {
                        // console.log('table course', course.auTypes);
                        // console.log('adder course', $scope.newCourse.auTypes);
                        var auTypes = {
                            'CORE': $scope.newCourse.auTypes['CORE']
                        };
                        for (var t in $scope.newCourse.auTypes)
                            if ((t != 'CORE') && (course.auTypes.indexOf(t) > -1))
                                auTypes[t] = $scope.newCourse.auTypes[t];
                        // console.log('mixed', auTypes);
                        course.auTypes = auTypes;
                        $scope.courseList.push(course);
                        $scope.newCourse = emptyNewCourse();
                        console.log($scope.newCourse, $scope.newCourse.status.submitted && !$scope.newCourse.status.invalid);
                    } else {
                        $scope.newCourse.status.invalid = true;
                    }
                },
                function error(err) {

                }
            );
        }

        $scope.toggleAUType = function(course, autype) {
            course.auTypes[autype] = !course.auTypes[autype];
            console.log(course.auTypes);
        }
        $scope.removeCourse = function(index) {
            $scope.courseList.splice(index, 1);
        }
        $scope.auReq = [
            {
                reqType: "TOTAL",
                min: 18,
                max: 24
            },
            {
                reqType: "CORE",
                min: 12,
                max: 21
            },
            {
                reqType: "PE",
                min: 0,
                max: 9
            },
            {
                reqType: "UE",
                min: 0,
                max: 9
            },
        ];
    });
