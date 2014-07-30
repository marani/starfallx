/* 
    mixins for course model to support selection/hidden index functions
    
    course.selectedIndexes
    course.selected.all
    course.selected.none
    course.hiddenIndexCount
    course.visibleIndexCount
    course.showHiddenIndex
    course.indexes[i].selected
    course.indexes[i].visible
    
*/
angular.module('starfallxApp')
    .factory('CourseStore', function ($http, $timeout, pouchdb, md5, $rootScope, $location){
        var acadTime = {
            year: 2014,
            sem: 1
        }
        var courseList = [];
        var courseDict = {}; // in-memory course dictionary
        var courseFilter = {}; // user-specific filter
        var filterLen = 0;
        var validCourseDict = {}; // all courses that != "null"
        var db = pouchdb.create('c' + acadTime.year + acadTime.sem);
        var initDone = false;

        // watch location, if location change because of <- -> btns, fresh load 
        // -> courseStore.loadFilter($location.search().q)

        // where to register this watcher?
        // app scope
        // CourseStore watches to $location

        // if location change because of courseStore (raised by BuildCtrl.js)-> this watcher does nothing
        // courseStore.loadFilter
        var encodedFilter = null;

        var CourseStore = {
            getAcadTime: function() {
                return acadTime;
            },
            getByCodeSync: function(code) {
                return courseDict[code];
            },
            getByCode: function(code, successHandler, errorHandler) {
                //if not in memory -> check remote store
                //remote store 
                //  -> exist -> store in exist dict
                //  -> not exist -> store not exist dict
                var acadTime = this.getAcadTime();
                if (courseDict[code]) {
                    // console.log('retrieved from in-mem cache');
                    if (code, successHandler) successHandler(code, courseDict[code]);
                }
                else
                    $http({
                        method: 'GET',
                        url: '/api/course/' + acadTime.year + '/' + acadTime.sem + '/' + code,
                    }).success(function(courseData, status, headers, config) {
                        db.put({
                            _id: code,
                            content: courseData
                        }).then(function(err, result) {
                            // console.log('db save successfully');
                            // console.log('retrieved from remote db: ', code);
                            // to avoid courseData manipulation 
                            courseDict[code] = courseData;
                            if (courseData != "null")
                                validCourseDict[code] = courseData;
                            if (successHandler) successHandler(code, courseData);
                        });
                    }).error(function(data, status, headers, config) {
                        if (errorHandler) errorHandler(status);
                    });
            },

            validate: function(encodedData) {
                try { 
                    var data = JSON.parse(atob(encodedData));
                } catch (e) {
                    return 'failed - internal error';
                }
                var hash = data.h;
                var jsonStr = data.d;
                if ((hash) && (jsonStr)) {
                    // var jsonStr = jsonStr.replace(/\\/g, ' ');
                    // console.log(jsonStr);
                    // console.log(hash);
                    // console.log(md5.createHash(jsonStr));
                    if (hash == md5.createHash(jsonStr)) {
                    } else 
                        return 'failed';
                } else
                    return 'failed';
                return 'success';
            },
            paramsToFilter: function(encodedData) {
                encodedFilter = encodedData;
                var start = + new Date();
                var rawFilter = JSON.parse(JSON.parse(atob(encodedData)).d);
                // console.log('parsing result:', rawFilter);
                filterLen = 0;
                for (var code in rawFilter) {
                    filterLen++;
                    courseFilter[code] = {
                        indexDict: {},
                        // sfSelectedDict: {},
                        selected: rawFilter[code].selected.length > 0 ?
                            [rawFilter[code].selected] :
                            [],
                        examDate: rawFilter[code].examDate.length > 0 ?
                            rawFilter[code].examDate :
                            "None"
                    };
                    if (rawFilter[code].indexes && rawFilter[code].indexes[0].length > 0)
                        rawFilter[code].indexes.forEach(function(indexCode) {
                            courseFilter[code].indexDict[indexCode] = true;
                        });

                    if (!rawFilter[code].sfSelected)
                        // if browser loads from STARS
                        courseFilter[code].sfSelectedDict = null;
                    else {
                        // if not from a fresh load from STARS (load from bookmark, back/forward btn)
                        courseFilter[code].sfSelectedDict = {};
                        if (rawFilter[code].sfSelected && rawFilter[code].sfSelected[0].length > 0)
                            rawFilter[code].sfSelected.forEach(function(indexCode) {
                                courseFilter[code].sfSelectedDict[indexCode] = true;
                            });
                    }

                }
                // console.log('url parsed done in:', + new Date() - start + 'ms');
            },

            initialize: function(callback) {
                // console.log('getAll() ...');
                var count = 0;
                db.allDocs({ include_docs: true })
                    .then((function(collection) {
                        // console.log('loaded collection')
                        // row in rows: 
                        //   row.doc <- content
                        collection.rows.forEach(function(row) {
                            courseDict[row.doc._id] = row.doc.content;
                        });
                        for (var code in courseFilter) {
                            this.getByCode(code,
                                function success(code) {
                                    // console.log('successfully loaded course: ', code);
                                    count++;
                                    if (count == filterLen)  {
                                        // console.log('getAll() done'); 
                                        // console.log('updateAll - mixin course & filter')
                                        callback();
                                        initDone = true;
                                        // console.log(courseDict); 
                                    }
                                });
                        }
                    }).bind(this))
                    .catch(function(error) {
                        // console.log(error);
                    })
                    .finally(function() {
                        // console.log('finally');
                    });
            },
            isInitialized: function() {
                return initDone;
            },

            // helper function used by multiple update functions below
            countSelected: function(course) {
                var selectedCount = 0;
                course.selectedIndexes = [];
                var all = course.showHiddenIndex ? course.indexes.length : course.visibleIndexCount;
                course.indexes.forEach(function(index) {
                    if (index.selected && (index.visible || course.showHiddenIndex)) {
                        selectedCount++;
                        course.selectedIndexes.push(index);
                    }
                });
                course.selected = {
                    count: selectedCount,
                    all: ((selectedCount == all) && (selectedCount > 0)),
                    none: selectedCount == 0
                }
            },
            // update by user change filter controls
            toggleHiddenIndex: function(course) {
                var prevCount = course.selected.count;
                course.showHiddenIndex = !course.showHiddenIndex;
                this.countSelected(course);
                return course.selected.count != prevCount;
            },
            selectGroup: function(groupSelectObj) {
                var course = groupSelectObj.course;
                for (var i in groupSelectObj.preview)
                    course.indexes[i].selected = groupSelectObj.selectType;
                this.countSelected(course);
                return true;
            },
            toggleSelectAll: function(course) {
                if (!course.selected.all)
                // show all index, change disabled state
                    course.indexes.forEach(function(idx) {
                    if (idx.visible || course.showHiddenIndex) idx.selected = true;
                });
                else
                // hide all index
                    course.indexes.forEach(function(idx) {
                    if (idx.visible || course.showHiddenIndex) idx.selected = false;
                });
                this.countSelected(course);
                return true;
            },
            update: function(method, params) {
                // this should be changed to a mapper 
                // that maps from actions in filterCtrl to 
                // currently this means all maps are 1-1 exact, highly coupled.
                // However, they are meant to be coupled.
                return this[method].apply(this, params);
            },

            // update by mixing in with courseFilter
            updateAll: function(courseFilter) {
                // mixin filter and coursedict
                for (var code in courseFilter) {
                    // console.log(courseDict[code]);
                    courseDict[code].examDate = courseFilter[code].examDate;
                    // console.log(code);
                    // update examDate
                    var course = this.getByCodeSync(code);

                    if (!this.isInitialized())
                        courseList.push(course);

                    // mark course as hidden 
                    course.hiddenIndexCount = 0;
                    course.visibleIndexCount = 0;

                    course.indexes.forEach(function(index) {
                        if (index.code in courseFilter[code].indexDict) {
                            index.visible = true;
                            index.selected = true;
                            course.visibleIndexCount++;
                        } else {
                            index.visible = false;
                            index.selected = false;
                            course.hiddenIndexCount++;
                        }
                    });

                    if (courseFilter[code].sfSelectedDict) {
                        course.indexes.forEach(function (index) {
                            if (index.code in courseFilter[code].sfSelectedDict) {
                                index.selected = true;
                            } else 
                                index.selected = false;
                        });
                    }
                     

                    // sort index by visible > hidden, for styling purpose
                    course.indexes.sort(function lt(a, b) {
                        if (b.visible && !a.visible) return 1;
                        else if (!b.visible && a.visible) return -1;
                        else {
                            if (b.code < a.code) return 1;
                            else return -1;
                        }
                    });

                    // trim timeSlot data
                    course.indexes.forEach(function(index) {
                        index.timeSlots.forEach(function(timeSlot) {
                            if (timeSlot.slotType)
                                timeSlot.slotType = timeSlot.slotType[0] + timeSlot.slotType[1] + timeSlot.slotType[2];
                        });
                    });
                    this.countSelected(course);
                }
            },

            // accessing courseList for view, used by filterCtrl, resultCtrl
            getCourseList: function() { 
                return courseList; 
            },

            getEncodedFilter: function() {
                return encodedFilter;
            },
            filterToParams: function(courseDict, courseFilter) {
                // console.log('course selection changed, encoding needed');

                /*
                    1. load filter lite for back forth btn
                    2. encodeFilter: 
                        extract filter from mixed in object, merge into original filter
                        encode with md5 + atob/btoa
                */
                // if an array is empty, array must be translated into a 1-element array, 
                // with the first element equals empty string ""
                // due to atob parsing mechanism
                var rawFilter = {};
                for (var code in courseFilter) {
                    rawFilter[code] = {
                        examDate: courseFilter[code].examDate != "None"?
                            courseFilter[code].examDate:
                            "",
                        indexes: [],
                        sfSelected: [], // Starfall selected
                        selected: "" //STARS Planner selected
                    }
                    courseDict[code].indexes.forEach(function(index) {
                        if (index.visible)
                            rawFilter[code].indexes.push(index.code);
                        if (index.selected)
                            rawFilter[code].sfSelected.push(index.code);
                    });
                    if (rawFilter[code].indexes.length == 0)
                        rawFilter[code].indexes = [""];
                    if (rawFilter[code].sfSelected.length == 0)
                        rawFilter[code].sfSelected = [""];
                }
                var str = JSON.stringify(rawFilter);
                encodedFilter = btoa(JSON.stringify({
                    d: str,
                    h: md5.createHash(str)
                }));
                // console.log('filterToParams', base64log(encodedFilter));
            }
        }
        // 2-way binding between FilterCtrl and CourseStore is different,
        // because they are bound on different properties,
        // income: controller -> model
        $rootScope.$on('FilterCtrl.filterChange', function(event, eventData) {
            // update selection status + encode data
            // filterChange event is ensured to be 
            var changed = CourseStore.update(eventData.method, eventData.params);
            // CourseStore.update(eventData.code, eventData.changes);
            if (changed)
                CourseStore.filterToParams(courseDict, courseFilter);
            // no need to emit, location is watching this property with $watch
        });
        // income: location -> model
        // $rootScope.$on('$location.qChange',...) is equivalent to this:
        // $rootScope.$on('$routeChangeSuccess', function(event, current) {
        //     // console.log(current);
        //     console.log('Route handler from CourseStore:', base64log($location.search().q));
        //     console.log("CourseStore's url listener");
        //     if (($location.path() == '/build') && ($location.search().q != CourseStore.getEncodedFilter())) {
        //         // CourseStore.setEncodedFilter($location.search().q);
        //         CourseStore.paramsToFilter($location.search().q);

        //         if (!CourseStore.isInitialized()) 
        //             CourseStore.initialize(function callback() { 
        //                 CourseStore.updateAll(courseFilter); 
        //                 $rootScope.$emit('CourseStore.filterChange', { courseList: courseList });
        //             });
        //         else {
        //             CourseStore.updateAll(courseFilter);
        //             $rootScope.$emit('CourseStore.filterChange', { courseList: courseList });
        //         }
        //         // no need to emit, filterCtrl is watching this property with $watch. NO. IT DOESN'T.
        //     }
        // });
        $rootScope.$watch(function() { 
            // console.log('store-watch-location executed', base64log($location.search().q)); 
            return $location.search().q; 
        }, function() {
            // console.log('CourseStore observed a route change,',
            //     'route:', base64log($location.search().q), 
            //     'current param:', base64log(CourseStore.getEncodedFilter()), 
            //     $location.search().q == CourseStore.getEncodedFilter(),
            //     $location.path() == '');
            if (($location.path() != '/build') || 
                ($location.search().q == CourseStore.getEncodedFilter()) || 
                (!CourseStore.isInitialized())) return;
            // console.log('CourseStore observed a valid route change:', base64log($location.search().q));

            CourseStore.paramsToFilter($location.search().q);

            // if (!CourseStore.isInitialized()) 
            //     CourseStore.initialize(function callback() { 
            //         CourseStore.updateAll(); 
            //         $rootScope.$emit('CourseStore.filterChange', { courseList: courseList });
            //     });
            // else {
            CourseStore.updateAll(courseFilter);
            $rootScope.$emit('CourseStore.filterChange', { courseList: courseList });
            // }
        });
        $rootScope.$on('$routeChangeStart', function(event, next, prev) {
            // console.log('change start');
            // console.log('checking on build & build params ... require init? ...', ($location.path().indexOf('/build') === 0) && (!dataRetrieved));
            if (($location.path() == '/build') && (!CourseStore.isInitialized()))  {
                //fresh load -> init
                var status = CourseStore.validate($location.search().q);
                // console.log('url validation:', status);
                // console.log(event);
                // event.preventDefault();
                if (status != "success")
                    $location.path('/');
                else {
                    CourseStore.paramsToFilter($location.search().q);
                    CourseStore.initialize(function callback() { 
                        // console.log(courseFilter);
                        CourseStore.updateAll(courseFilter); 
                        $rootScope.$emit('CourseStore.filterChange', { courseList: courseList });
                    });
                }
            }
        });
        return CourseStore;
    })

/*
TODO:
    separate url undo stack from filter undo stack

                    3. complete 2-way binding pairs' interaction:
                        CourseStore.getEncodedFilter() <-> $location.search().q
                        FilterCtrl & View <-> CourseStore.filter
    init function
    'update' problem?

    CourseStore.update to be called from controller
    CourseStore.update to be called when back/forward btn clicked

    CourseStore.update 
    what should updateFunction do?
        receives a change vector, apply it to the model

    what is it doing?
        partially update after another partial update is done in the model
        it is actually a method to update number of selected index
        -> change it to countSelection
        
        controller can access courseObject directly
        controller should have accessed courseObject from CourseStore's methods


    principles:
        law of diameter






*/

// setFilter: function() {

// },

// getValidCourseDict: function() {
//     return validCourseDict;
// },

// searchCourse: function(timeSlotArray) {

// },