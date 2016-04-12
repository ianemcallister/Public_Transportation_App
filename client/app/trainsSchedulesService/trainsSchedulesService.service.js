'use strict';

angular
	.module('transitApp')
  	.service('trainsSchedulesService', trainsSchedulesService);

trainsSchedulesService.$inject = ['$http'];

function trainsSchedulesService($http) {

	var allTrainScheduleServices = {
		_get:_get,										//local methods
		_getJSON:_getJSON,
		_getATrainSchedule:_getATrainSchedule,

		getAllTrainSchedules: getAllTrainSchedules,		//getters
		getTrainLineNames: getTrainLineNames,
														//setters

		alertMe: alertMe,								//random

		download: download,								//external
		downloadJSON: downloadJSON
	};

	function _get(url) {
    	console.log(url);
    	return fetch(url);
  	}

	function _getJSON(url) {
	    return _get(url).then(function(response) {
	      return response.json();
	    });
	}

	function _getATrainSchedule(url) {

		_getJSON(url)
	    .then(function(response) {
	      console.log(response);
	    })
	    .catch(function(error) {
	      console.log(error);
	    });	

	}

	function alertMe() {
		alert('testing');
	}

	function getTrainLineNames() {
		//declare local variables
		var path = '../../assets/JSON/';
		var file = 'train_lines.JSON';

		return _getJSON(path + file)
		.then(function(response) {
			//return response;
			return response;
		})
		.catch(function(error) {
			console.log('Error: ' + error);
		});
	}

	function getAllTrainSchedules() {
		
		_getJSON('../../assets/JSON/max-train-lines.json')
		.then(function(response) {
			console.log(response.results);
			return Promise.all(response.results);//.map(_getJSON));
		})
		.then(function(arrayOfTrainLines) {

			arrayOfTrainLines.forEach(function(line) {
				console.log(line);
			});

		})
		.catch(function(error) {
			console.log('Error: ' + error);
		})
		
	}

	function download() {
		
		var method = 'GET';
		var url = '/api/things/getTrainTimeTables';

		$http({method: method, url: url})
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log(error);
		})

	}

	function downloadJSON() {
		return 
	}

	return allTrainScheduleServices;
}
