'use strict';

/**
 * @ngdoc directive
 * @name transitApp.directive:tripPlannerInput
 * @description
 * # tripPlannerInput
 */
angular.module('transitApp')
  .directive('tripPlannerInput', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tripPlannerInput directive');
      }
    };
  });
