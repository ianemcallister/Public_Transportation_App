'use strict';

angular
	.module('transitApp')
  	.component('trainschedules', {
	    templateUrl: 'app/trainschedules/trainschedules.html',
	    controller: TrainschedulesComponent
	  });

TrainschedulesComponent.$injector = ['$scope', 'trainsSchedulesService'];

function TrainschedulesComponent($scope, trainsSchedulesService) {

	//declare local variables
	$scope.trainLineNames;
	$scope.selectedLine;
	$scope.activeTrainSchedule;

	//view model variables
	trainsSchedulesService.getTrainLineNames()
	.then(function(response) {
		$scope.trainLineNames = response;
		$scope.$apply();
	})
	.catch(function(error) {
		console.log(error);
	});

	//local methods
	//view model methods
	$scope.validLineSelected = function() {
		$scope.selectedLine = $scope.tempLine;
		getTrainSchedule();
	}
	
	//ACTIONS
	//When the page loads, download all the train schedules
	trainsSchedulesService.getAllTrainSchedules();

}

