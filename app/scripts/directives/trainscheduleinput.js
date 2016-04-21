'use strict';

/**
 * @ngdoc directive
 * @name transitApp.directive:trainScheduleInput
 * @description
 * # trainScheduleInput
 */
angular.module('transitApp')
  .directive('trainScheduleInput', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the trainScheduleInput directive');
      }
    };
  });
