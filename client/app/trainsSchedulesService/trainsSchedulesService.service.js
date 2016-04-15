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
		getARidePlan: getARidePlan,
														//setters

		download: download,								//external
		//downloadJSON: downloadJSON
	};

	function _get(url) { return fetch(url); }

	function _getJSON(url) {
	    return _get(url).then(function(response) {
	      return response.json();
	    });
	}

	function _getATrainSchedule(url) {

		_getJSON(url)
	    .then(function(response) {
	      
	    })
	    .catch(function(error) {
	      console.log(error);
	    });	

	}

	function getAllTrainSchedules() {
		//declare local variable
		var listofTrains = {};

		//wrap all trains in a promise
		var schedulePromise = new Promise(function(resolve, reject) {
			
			_getJSON('../../assets/JSON/max-train-lines.json')
			.then(function(response) {
				//fetch all the train lines in parallel
				return Promise.all(response.results.map(_getJSON));
			})
			.then(function(arrayOfTrainLines) {

				arrayOfTrainLines.forEach(function(trainLine) {
					
					var lineShortName = trainLine.route_id;
					listofTrains[lineShortName] = trainLine;
				});

				resolve(listofTrains);

			})
			.catch(function(error) {
				console.log('Error: ' + error);
			})

		});
		
		return schedulePromise;
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

	function getARidePlan(startingStation, endingStation, type) {
		
		//declare and define local variable
		var rideOptions = {};
		var method = 'GET';
		var rootUrl = '/api/rides/';
		var type = type || 'fewestStops';		//default the method to fewest stops

		//construct the url
		var url = rootUrl + type + '/' +  startingStation + '/' + endingStation;

		//build and return the promise
		return new Promise(function(resolve, reject) { 
			fetch(url)
			.then(function(responseObj) {
				//return the response
				resolve(responseObj.json());
			})
			.catch(function(error) {
				console.log('An Error Occured: ' + error);
			});
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

	return allTrainScheduleServices;
}
