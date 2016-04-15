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
	$scope.tripOptions = 'test';

	//watchers
	$scope.$watch('endpointsDefined', function(newVal, oldVal) {
		if(typeof newVal !== 'undefined') console.log('Endpoints Defined from tripplanner:' + newVal);
	});

	$scope.$watch('tripOptions', function(newVal, oldVal) {
		if(typeof newVal !== 'undefined') console.log('Trip Options from tripplanner:' + newVal);
	});
}

