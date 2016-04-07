'use strict';

angular
	.module('transitApp')
  	.service('trainsSchedulesService', trainsSchedulesService);

trainsSchedulesService.$inject = [];

function trainsSchedulesService() {

	var allTrainScheduleServices = {
		getAllTrainSchedules:getAllTrainSchedules,
		alertMe:alertMe
	};

	function alertMe() {
		alert('testing');
	}

	function getAllTrainSchedules() {
		return ['Red Line',
		'Blue Line',
		'Yellow Line',
		'Green Line',
		'Orange Line'];
	}

	return allTrainScheduleServices;
}
