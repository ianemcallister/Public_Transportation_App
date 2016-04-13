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
	var lineNameHash = {};

	//view model variables
	$scope.trainLineNames;
	$scope.allTrainSchedules;
	$scope.selectedLine;
	$scope.activeTrainSchedule;
	$scope.tempLine;

	//local methods
	//view model methods
	$scope.selectingATrainLine = function() {
		
		//check if tempLine is a valid train line
		if(typeof lineNameHash[$scope.tempLine] !== 'undefined') {

			//if so set the selectedline
			$scope.selectedLine = $scope.tempLine
		}

	}
	
	//ACTIONS
	//get the list of trainlines
	trainsSchedulesService.getTrainLineNames()
	.then(function(response) {
		//save lines to local variable
		$scope.trainLineNames = response;

		//hash the values for quick reference later
		response.forEach(function(line) {
			
			var longName = line.long_name;
			lineNameHash[longName] = line.short_name;
		});

		//update the view model
		$scope.$apply();
	})
	.catch(function(error) {
		console.log(error);
	});

	//download all the train schedules
	trainsSchedulesService.getAllTrainSchedules()
	.then(function(allTrains) {

		$scope.allTrainSchedules = allTrains;
	})
	.catch(function(error) {
		console.log('Error fetching trainlines: ' + error);
	});

}

