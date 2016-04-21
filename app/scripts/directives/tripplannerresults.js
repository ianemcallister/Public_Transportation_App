'use strict';

/**
 * @ngdoc directive
 * @name transitApp.directive:tripPlannerResults
 * @description
 * # tripPlannerResults
 */
angular.module('transitApp')
  .directive('tripPlannerResults', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the tripPlannerResults directive');
      }
    };
  });
