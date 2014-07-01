angular.module('starfallxApp')
    .factory('courseStore', function ($http, $timeout, pouchdb){
        var acadTime = {
            year: 2014,
            sem: 1
        }
        var courseDict = {}; // in-memory course dictionary
        var courseFilter = {}; // user-specific filter
        var validCourseDict = {}; // all courses that != "null"
        var db = pouchdb.create('c' + acadTime.year + acadTime.sem);
        var initDone = false;
        return {
            init: function(initData) {
                // sanitize data
                var filterLen = 0;
                for (var code in initData) {
                    filterLen++;
                    courseFilter[code] = {
                        indexDict: {},
                        selected: initData[code].selected.length > 0 ?
                            [initData[code].selected] :
                            [],
                        examDate: initData[code].examDate.length > 0 ?
                            initData[code].examDate :
                            "None"
                    };
                    if (initData[code].indexes[0].length > 0)
                        initData[code].indexes.forEach(function(indexCode) {
                            courseFilter[code].indexDict[indexCode] = true;
                        });
                }
                // memcache
                var count = 0;
                db.allDocs({ include_docs: true })
                    .then(function(collection) {
                        // row in rows: row.doc <- content
                        collection.rows.forEach(function(row) {
                            courseDict[row.doc._id] = row.doc.content;
                        });
                    })
                    .catch(function(error) {

                    })
                    .finally((function() {
                        for (var code in courseFilter) {
                            this.getByCode(code,
                                function success(courseData) {
                                    courseDict[code] = courseData;
                                    courseDict[code].examDate = courseFilter[code].examDate;
                                    
                                    count++;
                                    if (count == filterLen) initDone = true;
                                });
                        }
                        // console.log(courseDict);
                    }).bind(this));
            },
            initDone: function() {
                return initDone;
            },
            getFilter: function() {
                return courseFilter;
            },
            setFilter: function() {

            },
            getAcadTime: function() {
                return acadTime;
            },
            getValidCourseDict: function() {
                return validCourseDict;
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
                    if (successHandler) successHandler(courseDict[code]);
                    // console.log('retrieved from mem cache');
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
                            // console.log('retrieved from remote db');
                            // to avoid courseData manipulation 
                            courseDict[code] = courseData;
                            if (courseData != "null")
                                validCourseDict[code] = courseData;
                            if (successHandler) successHandler(courseData);
                        });
                    }).error(function(data, status, headers, config) {
                        if (errorHandler) errorHandler(status);
                    });
            },
            searchCourse: function(timeSlotArray) {

            }
        }
    })