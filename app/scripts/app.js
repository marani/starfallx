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
                controller: 'HomeCtrl',
                title: 'Starfall'
            })
            .when('/build', {
                templateUrl: 'partials/build',
                controller: 'BuildCtrl',
                reloadOnSearch: false,
                title: 'Starfall. Make a Plan.'
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
                redirectTo: '/',
                title: 'Starfall'
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
    .run(function($rootScope, $location, Auth, CourseStore, $routeParams) {
        // Redirect to login if route requires auth and you're not logged in
        // var dataRetrieved = false;


        // bind course store to location
        // $rootScope.$watch(function() { return $location.search().q}, function(newVal, oldVal) { 
        //     console.log(oldVal, newVal);
        //     // if q == encodedFilter -> do nothing
        //     // else try to change filterData
        // });
        $rootScope.$on('$routeChangeSuccess', function(event, current) {
            // $rootScope.sfPageTitle = current.title;
            // console.log($rootScope.sfPageTitle;
            document.title = current.title;
            // console.log('change title success');
        });
        // 2 way binding - $location.search() & CourseStore._encodedFilter
        // way 1: 
        // right case: user changes CourseStore._filter, CourseStore emit changes to $location
        // wrong case (dirty check to eliminate): user changes url, url changes filter, filter changes back url
        $rootScope.$watch(function() { return CourseStore.getEncodedFilter(); }, function(newVal, oldVal) {
            // console.log('encodedFilter:', newVal);
            // console.log('q:', $location.search().q);

            if (oldVal == newVal)
                return;
            // console.log("$location's filter change handler:", base64log(newVal));
            // if encodedFilter == current url -> do nothing
            // else change url.search
            if (newVal == $location.search().q) 
                return;
            $location.search({ q: newVal });
        });
        // way 2: 
        // right case: user changes $location, $location emit changes to CourseStore._filter
        // wrong case (dirty check to eliminate): user changes filter, filter changes url, url changes back filter

        // 2-way binding's cycle is blocked by a dirty check (disambiguous check)
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });
