'use strict'

var systemGraph = require('./assets/JSON/systemGraph');
var stnAdjacencies = require('./assets/models/stnAgacencies');
var cursorGenerator = require('./cursorModel');
var allStns = require('./assets/models/allStns');

//the variable itself
var API = {
	_calcRoute: _calcRoute,			//local methods
	_formatSummary: _formatSummary, 
	_formatSteps: _formatSteps,
	_markStationVisited: _markStationVisited,
	_visitedBefore: _visitedBefore,
	_searchStations: _searchStations,
	getNewRoute: getNewRoute,		//external methods
}

function _formatSummary(rawJourney) {
	return {};
}
function _formatSteps(rawJourney) {
	return '_formatSteps';
}
function _markStationVisited(stnId) {
	allStns[stnId] = true;
}
function _visitedBefore(stnId) {

	if(allStns[stnId]) return true;
	else return false;
}
function _searchStations(start, end) {
	var api = this;

	console.log(start, end);

	var route = {queue:[], vertex:[], endpoint:[], edge:[], path:[]};
	var found = false;

	//create a new cursor and add it to the queue
	route.queue.push(new cursorGenerator(start));

	//mark that station as visited
	api._markStationVisited(start);

	//console.log('the queue:', route.queue, ' length: ', route.queue.length);

	//as long as there are values in the queue and the end has not been found
	while(route.queue.length > 0 && !found) {
		//notify
		
		//get the first value from the queue
		var currentCursor = new cursorGenerator(route.queue[0].pos, route.queue[0].path);
		route.queue.splice(0, 1);

		//check if this is the station we're looking for
		if(currentCursor.pos == end) {
			//throw the flag
			console.log('found it', currentCursor.path.length, 'steps');
			found = true;

		} else {

			//get the adjacencies for this station
			var adjacencies = stnAdjacencies[currentCursor.pos];
			var adjCount = 0;

			//check each adjacency
			adjacencies.forEach(function(endpoint) {
				//incriment the counter
				adjCount++;

				//check if this station has been visited before
				if(!api._visitedBefore(endpoint)) {
					
					//if it has not, mark as explored
					api._markStationVisited(endpoint);
					
					//and add it to the que
					if(adjCount == 1) {
						currentCursor.advanceCursor(endpoint);

						//update the currrent cursor and return it to the que
						route.queue.push(currentCursor);

					} else {

						//if not, create a new cursor and add it to the queu
						route.queue.push(new cursorGenerator(endpoint, currentCursor.path));
					}

				}

			});

		}

	}
}
function _calcRoute(depart, arrive) {
	var api = this;

	return new Promise(function(resolve, reject) {
		var found = false;
		var i = 0;

		//1. search all stations until a route is found
		var searchGrid = api._searchStations(depart, arrive);
		//return the created object
		resolve({'testing':'again'});

	}).catch(function(e) {
      console.log('Error: ' + e);
    });
}
function getNewRoute(depart, arrive) {
	var api = this;
	var journeyObject = {};

	//return a promise
	return new Promise(function(resolve, reject) {

		//pass values to the calculator and get them back 
	    api._calcRoute(depart, arrive).then(function(rawJourney) {
	

		//first build the summary
		//journeyObject = api._formatSummary(rawJourney);

		//then overwrite the steps object
		//journeyObject['steps'] = api._formatSteps(rawJourney);

		//return the journeyObject
	    resolve(rawJourney);

		}).catch(function(e) {
			console.log('Error:' + e);
		});

	}).catch(function(e) {
		console.log('Error:' + e);
	});
}

module.exports = API;