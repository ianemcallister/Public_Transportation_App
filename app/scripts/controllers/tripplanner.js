'use strict';

/**
 * @ngdoc function
 * @name transitApp.controller:TripplannerCtrl
 * @description
 * # TripplannerCtrl
 * Controller of the transitApp
 */
angular.module('transitApp')
  .controller('TripplannerCtrl', ['$stateParams', function ($stateParams) {
    
  	//declare local variables
    var vm = this;

    //log the params for reference
    console.log($stateParams);
  }]);
