angular.module('starfallxApp')
    .config(function($httpProvider){
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('NTUScraper', function($http){
        return {
            pull: function (year, semester, courseCode) {
                return $http({   
                    method: 'GET', 
                    url: 'https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1',
                    params: {
                        'acadsem': year + ';' + semester,
                        'r_subj_code': courseCode,
                        'staff_access': 'false',
                        'boption': 'Search',
                        'r_search_type': 'F'
                    }
                });
            }
        }
    });