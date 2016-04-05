'use strict';

angular.module('transitAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('trainschedules', {
        url: '/trainschedules',
        template: '<trainschedules></trainschedules>'
      });
  });
