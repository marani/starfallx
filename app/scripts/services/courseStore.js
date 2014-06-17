angular.module('starfallxApp')
    .factory('courseStore', function ($http, $timeout){
        return {
            getAcadTime: function() {
                return {
                    year: 2014,
                    sem: 1
                }
            },
            getByCode: function(code, successHandler, errorHandler) {
                //if not in localStore -> check remote store
                //remote store 
                //  -> exist -> store in exist dict
                //  -> not exist -> store not exist dict
                var acadTime = this.getAcadTime();
                $http({
                    method: 'GET',
                    url: '/api/course/' + acadTime.year + '/' + acadTime.sem + '/' + code,
                }).success(function(data, status, headers, config) {
                    // console.log('Data arrived');
                    // console.log('Timing out...');
                    // $timeout(function() {
                    //     console.log('Handle data...'); 
                    //     successHandler(data);}, 
                    //     2000);
                    successHandler(data); 
                }).error(function(data, status, headers, config) {
                    errorHandler(status);
                });
            },
            searchCourse: function(timeSlotArray) {

            }
        }
    })