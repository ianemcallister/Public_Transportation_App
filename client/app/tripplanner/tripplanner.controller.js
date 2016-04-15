'use strict';

angular
	.module('transitApp')
  	.component('tripplanner', {
	    templateUrl: 'app/tripplanner/tripplanner.html',
	    controller: TripplannerComponent
	  });

TripplannerComponent.$injector = ['$scope'];

function TripplannerComponent($scope) {

	//declare local variables
	$scope.endpointsDefined = false;
}

