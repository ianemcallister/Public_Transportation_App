'use strict';

angular.module('transitApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tripplanner', {
        url: '/tripplanner',
        template: '<tripplanner></tripplanner>'
      });
  });
