'use strict';

/**
 * @ngdoc function
 * @name transitApp.controller:TrainscheduleCtrl
 * @description
 * # TrainscheduleCtrl
 * Controller of the transitApp
 */
angular.module('transitApp')
  .controller('TrainscheduleCtrl', ['$stateParams', function ($stateParams) {
    
    //declare local variables
    var vm = this;

    //log the params for reference
    console.log($stateParams);

  }]);
