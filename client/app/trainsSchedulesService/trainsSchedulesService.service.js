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

														//setters

		alertMe: alertMe,								//random

		download: download,								//external
		downloadJSON: downloadJSON
	};

	function _get(url) {
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
	      //return Promise.all(response.results.map(getJSON));
	    })
	    .then(function(arrayOfPlanetData) {
	      //console.log(arrayOfPlanetData);
	      /*arrayOfPlanetData.forEach(function(planet) {
	        //console.log(planet);
	        createPlanetThumb(planet);
	      });*/
	    })
	    .catch(function(error) {
	      console.log(error);
	    });	

	}

	function alertMe() {
		alert('testing');
	}

	function getAllTrainSchedules() {
		
		var path = '../../assets/JSON/';
		var allFiles = [
			'90_Red_Line.JSON',
			'100_Blue_Line.JSON',
			'190_Yellow_Line.JSON',
			'200_Green_Line.JSON',
			'290_Orange_Line.JSON'	
		];

		allFiles.forEach(function(file) {
			_getATrainSchedule(path + file);
		});
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
