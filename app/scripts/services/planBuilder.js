angular.module('starfallxApp')
    .factory('PlanBuilder', function($rootScope) {
        var toNumber = {
            'MON': 0,
            'TUE': 1,
            'WED': 2,
            'THU': 3,
            'FRI': 4,
            'SAT': 5
        }
        var courseOrder = [];
        var courseList = [];
        var occupied = [];
        var resultDict = {};
        var resultList = [];

        var currentResult = {};
        var resultCount = 0;
        var result;

        var examClash = function(c1, c2) {
            if (arguments.length == 2) {
                if (c1.examDate == c2.examDate) {
                    if (c1.examDate == "None") return false;
                    else return true;
                }
                var data1 = c1.examDate.split(' ');
                var data2 = c2.examDate.split(' ');
                if (data1[0] == data2[0]) {
                    return (((data1[1] >= data2[1]) && (data1[1] < data2[2])) ||
                        ((data2[1] >= data1[1]) && (data2[1] < data1[2])));
                }
                else 
                    return false;
                // console.log('d1', 'd2', d1, d2);
            } else {
                for (var i = 0; i < courseList.length; i++)
                    for (var j = i + 1; j < courseList.length; j++) {
                        // console.log(courseList[i].code, courseList[i].examDate);
                        // console.log(courseList[j].code, courseList[j].examDate);
                        // console.log('->' , examClash(courseList[i], courseList[j]));
                        if (examClash(courseList[i], courseList[j])) {
                            return true;
                        }
                    }
                return false;
            }
        }
        var mark = function(index) {
            for (var i = 0; i < index.timeSlots.length; i++) {
                var slot = index.timeSlots[i];
                for (var j = 0; j < slot.weeks.length; j++) {
                    var w = slot.weeks[j];
                    for (var s = slot.startTime; s < slot.endTime; s++)
                        // if (resultCount == 0)
                        //     console.log(slot.startTime, slot.endTime, index.code);
                        if (occupied[w][s])
                            return false;
                        else
                            occupied[w][s] = index.code;
                }
            }
            return true;
        }
        var unmark = function(index) {
            for (var i = 0; i < index.timeSlots.length; i++) {
                var slot = index.timeSlots[i];
                for (var j = 0; j < slot.weeks.length; j++) {
                    var w = slot.weeks[j];
                    for (var s = slot.startTime; s < slot.endTime; s++)
                        if (occupied[w][s] == index.code)
                            occupied[w][s] = false;
                }
            }
        }
        var tryIndex = function(current) {
            if (current == courseList.length) {
                var indexList = [];
                for (var i = 0; i < courseList.length; i++) {
                    indexList.push(currentResult[courseList[i].code]);
                    resultDict[courseList[i].code].push(currentResult[courseList[i].code]);
                    resultCount +=1;
                }
                resultList.push(indexList);
            } else {
                for (var i = 0; i < courseList[current].selectedIndexes.length; i++) {
                    var index = courseList[current].selectedIndexes[i];
                    if (mark(index)) {
                        if (resultCount == 0) {
                            // console.log(occupied);
                        }
                        currentResult[courseList[current].code] = index.code;
                        tryIndex(current + 1);
                    }
                    unmark(index);
                }
            }
        }
        var normalized = function(timeMark, day) {
            var minute = (timeMark % 100 == 0) ? 0 : 50;
            var hour = Math.floor(timeMark / 100) * 100; 
            // console.log(timeMark, hour, minute, ((hour + minute) * 48) / 2400 + day * 48);
            // console.log(timeMark, day, (hour + minute) * 48 / 2400 + day * 48);
            return (hour + minute) * 48 / 2400 + day * 48;
        }
        var initialize = function(requirements) {
            courseOrder = [];
            courseList = [];

            resultDict = {};
            resultList = [];
            
            resultCount = 0;
            currentResult = {};
            courseList = requirements.courseList;
            console.log(courseList);

            var courseListTemp = [];
            courseList.forEach(function(course) {
                var indexes = [];
                // course.indexes.forEach(function(index) {
                //     if (index.selected && ((index.visible) || (!index.visible) && (course.showHiddenIndex)))
                //         indexes.push(index);
                // });
                // course.selectedIndexes = indexes;
                if (course.selectedIndexes.length > 0) {
                    courseListTemp.push(course);
                    resultDict[course.code] = [];
                    courseOrder.push(course.code);
                }
            });
            courseList = courseListTemp;
            // console.log(courseList);

            courseList.forEach(function(course) {
                course.selectedIndexes.forEach(function(index) {
                    if (!index.normalized) {
                        index.timeSlots.forEach(function(slot) {
                            slot.day = toNumber[slot.day];
                            slot.startTime = normalized(slot.startTime, slot.day);
                            slot.endTime = normalized(slot.endTime, slot.day);
                        });
                        index.normalized = true; 
                    };
                });
            });

            // for (var i = 0; i < courseList.length; i++) {
            //     var course = courseList[i];

            //     for (var j = 0; j < course.selectedIndexes.length; j++) {
            //         var index = course.selectedIndexes[j];
            //         for (var k = 0; k < index.timeSlots.length; k++) {
            //             var slot = index.timeSlots[k];
            //             slot.day = toNumber[slot.day];
            //             slot.startTime = normalized(slot.startTime, slot.day);
            //             slot.endTime = normalized(slot.endTime, slot.day);
            //         }
            //     }
            //     course.normalized = true;
            // }
            // console.log('normalized timeslot');
            for (var w = 0; w < 14; w++) {
                occupied[w] = [];
                for (var s = 0; s < 7 * 48; s++)
                    occupied[w][s] = false;
            }
            // console.log(courseList);
        }
        return {
            examClash: function(c1, c2) {

            },

            mark: function(index) {

            },

            unmark: function(index) {

            },

            tryIndex: function(current) {

            },

            normalized: function(timeMark, day) {

            },

            initialize: function(requirements) {

            },

            solveSync: function(requirements) {
                // console.log('initializing');
                // console.log('building');
                if (requirements.type == "default") {
                    initialize(requirements);
                    if (examClash()) 
                        result = {
                            list: [],
                            dict: {},
                            courseOrder: courseOrder
                        }
                    else {
                        tryIndex(0);
                        result = {
                            list: resultList,
                            dict: resultDict,
                            courseOrder: courseOrder
                        }
                    }
                    
                    $rootScope.$emit('PlanBuilder.searchCompleted', result);
                }
            },

            solveAsync: function(requirements, options) {
            }
        }
    });