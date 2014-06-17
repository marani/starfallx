'use strict';

angular.module('starfallxApp')
    .controller('NavbarCtrl', function($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Build',
            'link': '/',
            'icon': '"fa fa-cubes fa-fw"'
        }, {
            'title': 'Saved',
            'link': '/saved',
            'icon': '"fa fa-list fa-fw"'
        }, {
            'title': 'Tips',
            'link': '/tips', 
            'icon': '"fa fa-question-circle fa-fw"'
        }
        // , {
        //     'title': 'About',
        //     'link': '/about',
        //     'icon': '"fa fa-barcode fa-fw"'
        // }
        ];

        $scope.logout = function() {
            Auth.logout()
                .then(function() {
                    $location.path('/login');
                });
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });
