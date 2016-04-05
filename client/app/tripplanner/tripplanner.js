'use strict';

angular.module('transitAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tripplanner', {
        url: '/tripplanner',
        template: '<tripplanner></tripplanner>'
      });
  });
