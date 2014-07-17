'use strict';

angular.module('starfallxApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.bootstrap',
        'ui.sortable',
        'pouchdb',
        'angular-md5'
    ])    
    .config(function($provide){
        $provide.decorator('$rootScope', ['$delegate', function($delegate){
            Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
                value: function(name, listener){
                    var unsubscribe = $delegate.$on(name, listener);
                    this.$on('$destroy', unsubscribe);

                    return unsubscribe;
                },
                enumerable: false
            });
            return $delegate;
        }]);
    })
    .config(function($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home',
                controller: 'HomeCtrl'
            })
            .when('/build', {
                templateUrl: 'partials/build',
                controller: 'BuildCtrl'
            })
            // .when('/saved', {
            //     templateUrl: 'partials/saved',
            //     controller: 'SavedCtrl',
            //     authenticate: true
            // })
            // .when('/login', {
            //     templateUrl: 'partials/login',
            //     controller: 'LoginCtrl'
            // })
            // .when('/signup', {
            //     templateUrl: 'partials/signup',
            //     controller: 'SignupCtrl'
            // })
            // .when('/profile', {
            //     templateUrl: 'partials/profile',
            //     controller: 'ProfileCtrl',
            //     authenticate: true
            // })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location',
            function($q, $location) {
                return {
                    'responseError': function(response) {
                        if (response.status === 401) {
                            $location.path('/login');
                            return $q.reject(response);
                        } else {
                            return $q.reject(response);
                        }
                    }
                };
            }
        ]);
    })
    .run(function($rootScope, $location, Auth, CourseStore, md5, $routeParams) {
        // Redirect to login if route requires auth and you're not logged in
        var dataRetrieved = false;
        $rootScope.$on('$routeChangeStart', function(event, next) {
            // console.log('route start');
            // console.log('checking on build & build params ... require init? ...', ($location.path().indexOf('/build') === 0) && (!dataRetrieved));
            if (($location.path() == '/build') && !dataRetrieved) {
                try { 
                    var data = JSON.parse(atob($location.search().q));
                } catch (e) {
                    console.log('parse error');
                    $location.path('/');
                    return;
                }
                // console.log(data);
                var hash = data.h;
                var jsonStr = data.d
                if ((hash) && (jsonStr)) {
                    // var jsonStr = jsonStr.replace(/\\/g, ' ');
                    // console.log(jsonStr);
                    // console.log(hash);
                    // console.log(md5.createHash(jsonStr));
                    if (hash == md5.createHash(jsonStr)) {
                        dataRetrieved = true;
                        CourseStore.init(JSON.parse(jsonStr));
                        // $location.search({});
                        // $location.path('/build');
                    } else 
                        $location.path('/');
                } else
                    $location.path('/');
            }
        });

        // var dataRetrieved = false;
        // $rootScope.$on('$routeChangeSuccess', function(evt, current) {
        //     console.log('-------------');
        //     console.log('route success');
        //     console.log(current);
        //     console.log('checking on build & build params ... require init? ...', ($location.path().indexOf('/build') === 0) && (!dataRetrieved));
        //     if (($location.path().indexOf('/build') === 0) && (!dataRetrieved)) {
        //         try { 
        //             var data = JSON.parse(atob($routeParams.data));
        //         } catch (e) {
        //             $location.path('/');
        //             return;
        //         }
        //         var jsonStr = data.d;
        //         var hash = data.h;
        //         // console.log(hash && jsonStr);
        //         if ((hash) && (jsonStr)) {
        //             var jsonStr = jsonStr.replace(/\\/g, ' ');
        //             // console.log(jsonStr);
        //             // console.log(hash);
        //             // console.log(md5.createHash(jsonStr));
        //             if (hash == md5.createHash(jsonStr)) {
        //                 courseStore.init(JSON.parse(jsonStr));
        //                 dataRetrieved = true;
        //                 console.log(dataRetrieved, 'change to build');
        //                 $location.path('/build/_');
        //                 evt.preventDefault();
        //             } else 
        //                 $location.path('/');
        //         } else
        //             $location.path('/');
        //     }
        // })
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });
