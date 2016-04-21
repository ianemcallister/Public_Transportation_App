'use strict';

/**
 * @ngdoc directive
 * @name transitApp.directive:trainScheduleResult
 * @description
 * # trainScheduleResult
 */
angular.module('transitApp')
  .directive('trainScheduleResult', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the trainScheduleResult directive');
      }
    };
  });
