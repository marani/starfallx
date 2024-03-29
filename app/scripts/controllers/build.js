'use strict';

/* $watch monitoring */

angular.module('starfallxApp')
    .factory('WL', function() {
        return {
            log: function(scope, scopeHash) {
                if (scopeHash === undefined) {
                    scopeHash = {};
                }

                // make sure scope is defined and we haven't already processed this scope
                if (!scope || scopeHash[scope.$id] !== undefined) {
                    return 0;
                }

                var watchCount = 0;

                if (scope.$$watchers) {
                    watchCount = scope.$$watchers.length;
                }
                scopeHash[scope.$id] = watchCount;

                // get the counts of children and sibling scopes
                // we only need childHead and nextSibling (not childTail or prevSibling)
                watchCount+= this.log(scope.$$childHead, scopeHash);
                watchCount+= this.log(scope.$$nextSibling, scopeHash);

                return watchCount;                
            }
        }
    })
    .factory('UL', function() {
        return {
            log: function(str) {
                if (str)
                    console.log(str.slice(str.length - 10, str.length - 1));
                else 
                    console.log(undefined);
            }
        }
    });

// function base64log(str) {
//     if (str)
//         return (str.slice(str.length - 10, str.length - 1));
//     else 
//         return (undefined);
// }

angular.module('starfallxApp')
    .controller('BuildCtrl', function($scope, $rootScope, $http, $document, $window) {
        // $scope.leftPanel = 'ResultPlot';
        // $scope.leftPanel = 'Filter';
        // $scope.$onRootScope('ResultCtrl.showPlot', function() {
        //     $scope.leftPanel = 'ResultPlot';
        //     $scope.$broadcast('layoutChange');
        // });
        // $scope.$onRootScope('ResultCtrl.hidePlot', function() {
        //     $scope.leftPanel = 'Filter';
        //     $scope.$broadcast('layoutChange');
        // });
        // $scope.$onRootScope('ResultPlotCtrl.hidePlot', function() {
        //     $scope.leftPanel = 'Filter';
        //     $scope.$broadcast('layoutChange');
        // });
        $scope.globalKeydown = function($event) {
            console.log('down', $event);
            if ($event.ctrlKey && $event.keyCode == 90) 
                $window.history.back();
            else if ($event.ctrlKey && $event.keyCode == 89)
                $window.history.forward();
        }
    })
    .controller('ResultPlotCtrl', function($scope, $rootScope, CourseStore, WL) {
        // CONSTANTS
        $scope.days = [
            'MON',
            'TUE',
            'WED',
            'THU',
            'FRI',
            'SAT'
        ];

        $scope.normalizedDays = [0, 1, 2, 3, 4, 5];
        $scope.timeRow = [];

        var firstMark = 16, 
            lastMark = 47, 
            weekLen = 6,
            plan, courseList;

        function initPlot() {
            $scope.timeMarks = {};
            $scope.timeSlot = [];
            plan = null;
            courseList = []; 
            for (var t = firstMark; t <= lastMark; t++) {
                $scope.timeMarks[t] = { normalized: t };
                if (t % 2 == 1)
                    $scope.timeMarks[t].readable = (Math.floor(t / 2) * 100 + (t % 2) * 30);
                else
                    $scope.timeMarks[t].readable = '';

                $scope.timeRow[t] = [];
                for (var day = 0; day < weekLen; day++) 
                    $scope.timeRow[t][day] = day * 48 + t;
            }
        }
        initPlot();

        var updateTimeTable = function() {
            // console.log('Plotter watcher count:', WL.log($scope));
            var start = + new Date();
            for (var i = 0; i < 7 * 48; i++)
                $scope.timeSlot[i] = { 
                    rowspan: 1, 
                    startTime: null,
                    endTime: null,
                    classList: null
                };

            var starterSlots = [];
            for (var i = 0; i < courseList.length; i++)
                courseList[i].indexes.forEach(function(index) {
                    if (index.code == plan[i]) {
                        index.timeSlots.forEach(function(timeSlot) {
                            var tableSlot = $scope.timeSlot[timeSlot.startTime];
                            if (!tableSlot.classList) {
                                starterSlots.push(tableSlot);
                                tableSlot.startTime = timeSlot.startTime;
                                tableSlot.endTime = timeSlot.endTime;
                                tableSlot.classList = [{
                                        courseCode: courseList[i].code,
                                        slotType: timeSlot.slotType,
                                        startTime: timeSlot.startTime,
                                        endTime: timeSlot.endTime,
                                        sharedSlotIndex: 0
                                    }];
                            } else {
                                tableSlot.classList.push({
                                    courseCode: courseList[i].code,
                                    slotType: timeSlot.slotType,
                                    startTime: timeSlot.startTime,
                                    endTime: timeSlot.endTime,
                                    sharedSlotIndex: tableSlot.classList.length
                                });
                                tableSlot.endTime = Math.max(tableSlot.endTime, timeSlot.endTime);
                            }
                        });
                    }
                });
            starterSlots.forEach(function(slot) {
                slot.classList.forEach(function(cls) {
                    cls.sharedWith = slot.classList.length;
                })
            });
            // rowspan resolver - 3 cases: nested slot, overlap slot, equal slot 
            // -> generalized to: sort by startTime, then by length, then display
            $scope.timeSlot.forEach(function(slot) {
                if (slot.classList) spanFrom(slot);
            });
        }

        function spanFrom(slot) {
            var t = slot.startTime + 1, next;
            // console.log(slot.startTime);
            while (t < slot.endTime) {
                if ($scope.timeSlot[t].classList) {
                    next = spanFrom($scope.timeSlot[t]);
                    slot.classList = slot.classList.concat($scope.timeSlot[t].classList);
                    $scope.timeSlot[t].classList = null;
                } else
                    next = t + 1;
                $scope.timeSlot[t].rowspan = 0;
                t = next;
            }
            slot.rowspan = t - slot.startTime;
            return t;
        }

        // $scope.$onRootScope('ResultCtrl.showPlot', function(event, eventData) {
        //     for (var i = 0; i < eventData.courseOrder.length; i++)
        //         courseList[i] = CourseStore.getByCodeSync(eventData.courseOrder[i]);
        // });
        $scope.$on('ResultCtrl.resSetChange', function(event, eventData) {
            // console.log(eventData);
            for (var i = 0; i < eventData.courseOrder.length; i++)
                courseList[i] = CourseStore.getByCodeSync(eventData.courseOrder[i]);
        });
        $scope.$on('ResultCtrl.resRowChange', function(event, eventData) {
            plan = eventData.plan;
            updateTimeTable();
        });
        $scope.$on('ResultCtrl.resColChange', function(event, eventData) {
            $scope.course = eventData.courseIndex;
        });
        // $scope.close = function() {
        //     $rootScope.$emit('ResultPlotCtrl.hidePlot', {});
        // }
    })
    .controller('FilterCtrl', function($scope, $timeout, $routeParams, CourseStore, PlanBuilder, $rootScope, $document, WL, $window) {
        var acadTime = CourseStore.getAcadTime();
        $scope.year = acadTime.year;
        $scope.sem = acadTime.sem;
        $scope.courseList = [];
        $scope.buildingStarted = false;
        $scope.loadingFinished = false;

        // var countSelected = function(course) {
        //     // console.log('Filter watcher count:', WL.log($scope));
        //     var selectedCount = 0;
        //     course.selectedIndexes = [];
        //     var all = course.showHiddenIndex ? course.indexes.length : course.visibleIndexCount;
        //     course.indexes.forEach(function(index) {
        //         if (index.selected && (index.visible || course.showHiddenIndex)) {
        //             selectedCount++;
        //             course.selectedIndexes.push(index);
        //         }
        //     });
        //     course.selected = {
        //         all: ((selectedCount == all) && (selectedCount > 0)),
        //         none: selectedCount == 0
        //     }
        //     $scope.search();
        // }

        $scope.groupSelect = {
            started: false,
            course: null,
            $startIndex: null,
            selectType: null,
            preview: {},
        }

        $scope.handleMouseDownIndex = function(course, $index) {
            $scope.groupSelect.course = course;
            $scope.groupSelect.started = true;
            $scope.groupSelect.preview = {};
            $scope.groupSelect.preview[$index] = true;
            $scope.groupSelect.selectType = !course.indexes[$index].selected;
            $scope.groupSelect.$startIndex = $index;
        }

        $scope.handleMouseEnterIndex = function(course, $index) {
            if (!$scope.groupSelect.started || (course != $scope.groupSelect.course)) return;
            // console.log('enter', $index);
            var start = Math.min($index, $scope.groupSelect.$startIndex);
            var end = Math.max($index, $scope.groupSelect.$startIndex);
            $scope.groupSelect.preview = {};
            for (var i = start; i <= end; i++)
                $scope.groupSelect.preview[i] = true;
        }

        $document.on("mouseup", function() {
            if (!$scope.groupSelect.started) return;
            $rootScope.$emit('FilterCtrl.filterChange', {
                method: 'selectGroup',
                params: [$scope.groupSelect]
            });
            $scope.groupSelect.started = false;
            $scope.groupSelect.preview = {};
            // $scope.search();
            $scope.$apply();
        });


        $scope.undo = function() {
            $window.history.back();
        }
        $scope.redo = function() {
            $window.history.forward();
        }

        $scope.toggleHiddenIndex = function(course) {
            $rootScope.$emit('FilterCtrl.filterChange', {
                method: 'toggleHiddenIndex',
                params: [course]
            });
            // $scope.search();
            $scope.$emit('layoutChange'); // bad pattern
        }
        $scope.toggleAll = function(course) {
            $rootScope.$emit('FilterCtrl.filterChange', {
                method: 'toggleSelectAll',
                params: [course]
            });
            // $scope.search();
        }

        $scope.search = function() {
            // $scope.buildingStarted = true;
            // var startTime = +new Date();
            // console.log('start building...');
            PlanBuilder.solveSync({
                courseList: $scope.courseList,
                type: "default"
            });
            // console.log('finished in', +new Date() - startTime, 'ms');
            // $scope.buildingStarted = false;
        }
        $scope.$onRootScope('CourseStore.filterChange', function(event, eventData) {
            // console.log(eventData.courseList);
            $scope.courseList = eventData.courseList;
            // $scope.search();
            $scope.loadingFinished = true;
        });
    })
    .controller('ResultCtrl', function($scope, $rootScope, CourseStore, WL) {
        /*
        Event Interface:
            emit: 
                showPlot, hidePlot
                rowActiveChange, colActiveChange

            listen:
                PlanBuilder.searchCompleted
                ResultCtrlPlot.hidePlot
            
        */
        $scope.result = {};
        $scope.rowActive = null;
        $scope.colActive = null;
        $scope.courseList = [];

        $scope.newResultSet = function($index) {
            $scope.rowActive = $index;
            $scope.$broadcast('ResultCtrl.resSetChange', {
                courseOrder: $scope.result.courseOrder
            });
            $scope.$broadcast('ResultCtrl.resRowChange', {
                plan: $scope.result.list[$scope.rowActive]
            });
            // console.log('show plot', $index);
        }

        // $scope.highlightResult = function($index) {
        //     // console.log('Result list watcher count:', WL.log($scope));
        //     if ($scope.rowActive != null) {
        //         // console.log('highlight result', $index);
        //         $scope.rowActive = $index;
        //         $scope.$broadcast('ResultCtrl.resRowChange', {
        //             plan: $scope.result.list[$scope.rowActive]
        //         });
        //     }
        // }

        $scope.highlightCourse = function($index) {
            if ($scope.rowActive != null) {
                // console.log('highlight course', $scope.result.courseOrder[$index]);
                $scope.colActive = $index;
                $rootScope.$emit('ResultCtrl.resColChange', {
                    courseIndex: $scope.colActive
                });
            }
        }

        $scope.changeCurrentResult = function(delta) {
            $scope.rowActive = Math.min(Math.max(0, $scope.rowActive + delta), $scope.result.list.length - 1);
            $scope.$broadcast('ResultCtrl.resRowChange', {
                plan: $scope.result.list[$scope.rowActive]
            });
        }

        $scope.scrollResult = function($event) {
            if ($event.deltaY > 0)
                $scope.changeCurrentResult(1)
            else
                $scope.changeCurrentResult(-1);
        }

        $scope.$onRootScope('ResultPlotCtrl.hidePlot', function() {
            $scope.rowActive = null;
            $scope.colActive = null;
        });

        $scope.$onRootScope('PlanBuilder.searchCompleted', function(event, result) {
            // console.log('from result planBuilder service', result);
            // console.log('result:');
            // console.log(result.courseOrder);
            // console.log(result.list);
            // console.log(result.dict);
            $scope.result = result;
            for (var i = 0; i < result.courseOrder.length; i++) {
                // console.log(result.courseOrder[i]);
                $scope.courseList[i] = CourseStore.getByCodeSync(result.courseOrder[i]);
            }

            //init nav
            $scope.newResultSet(0);
        });
    });
