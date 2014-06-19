'use strict';

angular.module('starfallxApp')
    .controller('BuildCtrl', function($scope, $http) {
    })
    .controller('PrefCtrl', function($scope, courseStore, $timeout) {
        /* V2-features
        function emptyNewCourse() {
            return {
                name: '',
                code: '',
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
                        if (course.auTypes.length == 0) {
                            course.auTypes = { 'CORE': true };
                            course.auTypesSelected = 1;
                        }
                        else {
                            var auTypes = { 'CORE': false };
                            for (var i = 0; i < course.auTypes.length; i++)
                                auTypes[course.auTypes[i]] = false;
                            course.auTypes = auTypes;
                            course.auTypesSelected = 0;
                        }
                        $scope.courseList.push(course);
                        $scope.newCourse = emptyNewCourse();
                        updateInvalidAUList();
                        // console.log($scope.newCourse, $scope.newCourse.status.submitted && !$scope.newCourse.status.invalid);
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
            course.auTypesSelected += course.auTypes[autype]?1:-1;
            updateInvalidAUList();
        }
        $scope.removeCourse = function(index) {
            $scope.courseList.splice(index, 1);
            updateInvalidAUList();
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
        $scope.onAUReqChange = function(autype) {

        }
        $scope.onAUReqWheel = function(autype) {

        }
        $scope.onAUReqBtnClick = function(autype) {

        }


        $scope.buildingStarted = false;
        $scope.invalidAUList = [];
        function updateInvalidAUList() {
            $scope.invalidAUList = [];
            for (var i = 0; i < $scope.courseList.length; i++)
                if ($scope.courseList[i].auTypesSelected == 0)
                    $scope.invalidAUList.push($scope.courseList[i]);
        }
        $scope.error = {
            needFixEmptyCourse: false,
            needFixAUType: false,
            emptyCourse: function() {
                if ($scope.courseList.length > 0) {
                    this.needFixEmptyCourse = false;
                    return false;
                } else if (this.needFixEmptyCourse)
                    return true;
                else 
                    return false;
            },
            auType: function() {
                if ($scope.invalidAUList.length == 0) {
                    this.needFixAUType = false;
                    return false;
                } else if (this.needFixAUType)
                    return true;
                else 
                    return false;
            }
        }
        $scope.search = function () {
            //can click search, 
            if ($scope.courseList.length == 0) {
                $scope.error.needFixEmptyCourse = true;
                return;
            }

            if ($scope.invalidAUList.length > 0) {
                $scope.error.needFixAUType = true;
                return;
            }
            $scope.buildingStarted = true;
            $timeout(function() {
                $scope.buildingStarted = false;
            }, 1500);
        }*/
        function emptyNewCourse() {
            return {
                name: '',
                code: '',
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
            // console.log('change!');
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
                        // if (course.auTypes.length == 0) {
                        //     course.auTypes = { 'CORE': true };
                        //     course.auTypesSelected = 1;
                        // }
                        // else {
                        //     var auTypes = { 'CORE': false };
                        //     for (var i = 0; i < course.auTypes.length; i++)
                        //         auTypes[course.auTypes[i]] = false;
                        //     course.auTypes = auTypes;
                        //     course.auTypesSelected = 0;
                        // }
                        $scope.courseList.push(course);
                        $scope.newCourse = emptyNewCourse();
                        // updateInvalidAUList();
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
            course.auTypesSelected += course.auTypes[autype]?1:-1;
            // updateInvalidAUList();
        }
        $scope.removeCourse = function(index) {
            $scope.courseList.splice(index, 1);
            $scope.newCourse.status.added = false;
            for (var i = 0; i < $scope.courseList.length; i++)
                if ($scope.courseList[i].code == $scope.newCourse.code)
                    $scope.newCourse.status.added = true;
            // updateInvalidAUList();
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
        $scope.onAUReqChange = function(autype) {

        }
        $scope.onAUReqWheel = function(autype) {

        }
        $scope.onAUReqBtnClick = function(autype) {

        }

        $scope.buildingStarted = false;
        // $scope.invalidAUList = [];
        // function updateInvalidAUList() {
        //     $scope.invalidAUList = [];
        //     for (var i = 0; i < $scope.courseList.length; i++)
        //         if ($scope.courseList[i].auTypesSelected == 0)
        //             $scope.invalidAUList.push($scope.courseList[i]);
        // }
        $scope.error = {
            needFixEmptyCourse: false,
            needFixAUType: false,
            emptyCourse: function() {
                if ($scope.courseList.length > 0) {
                    this.needFixEmptyCourse = false;
                    return false;
                } else if (this.needFixEmptyCourse)
                    return true;
                else 
                    return false;
            },
            auType: function() {
                if ($scope.invalidAUList.length == 0) {
                    this.needFixAUType = false;
                    return false;
                } else if (this.needFixAUType)
                    return true;
                else 
                    return false;
            }
        }
        $scope.search = function () {
            //can click search, 
            if ($scope.courseList.length == 0) {
                $scope.error.needFixEmptyCourse = true;
                return;
            }

            // if ($scope.invalidAUList.length > 0) {
            //     $scope.error.needFixAUType = true;
            //     return;
            // }
            $scope.buildingStarted = true;
            $timeout(function() {
                $scope.buildingStarted = false;
            }, 1500);
        }
    });
