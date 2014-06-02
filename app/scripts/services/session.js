'use strict';

angular.module('starfallxApp')
    .factory('Session', function($resource) {
        return $resource('/api/auth/', {}, {
            login: {
                method: 'POST',
                url: '/api/auth/local/login'
            },
            logout: {
                method: 'POST',
                url: '/api/auth/logout'
            }
        });
    });
