'use strict';

angular.module('transitApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('trainschedules', {
        url: '/trainschedules',
        template: '<trainschedules></trainschedules>'
      });
  });
