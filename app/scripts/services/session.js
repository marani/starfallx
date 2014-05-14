'use strict';

angular.module('starfallxApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
