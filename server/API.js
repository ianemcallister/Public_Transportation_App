'use strict'

var systemGraph = require('./assets/JSON/systemGraph');
var stnAdjacencies = require('./assets/models/stnAgacencies');
var cursorGenerator = require('./cursorModel');
var allStns = require('./assets/models/allStns');
var stopsByTrain = require('./assets/JSON/stopsByTrain');


//the variable itself
var API = {
	_calcRoute: _calcRoute,			//local methods
	_getCurrentTime:_getCurrentTime,
	_formatSummary: _formatSummary, 
	_formatSteps: _formatSteps,
	_markStationVisited: _markStationVisited,
	_visitedBefore: _visitedBefore,
	_pathToRides: _pathToRides,
	_searchStations: _searchStations,
	_getNextTrain: _getNextTrain,
	getNewRoute: getNewRoute,		//external methods
}
function _getCurrentTime() {
  var newTime = new Date();
  var hours = newTime.getHours();
  var mins = newTime.getMinutes();
  var minsOnly = ((hours * 60) + mins);

  return minsOnly;
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
			//console.log('found it', currentCursor.path.length, 'steps');
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

	if(found) {
		return currentCursor.path;
	} else {
		return {error: 'No path between these stations could be found' };
	}

}
function _getNextTrain(connections, startStn, nextStn) {
	var testTime = _getCurrentTime();
	var possibleTrain = null;

	//check each of the connections
	Object.keys(connections).forEach(function(line) {
		
		//if a connection is for the next station
		if(nextStn == connections[line]) {
			
			//find the next train from that station on that line
			var trinsOnLine = systemGraph[startStn].trains[line];
			
			var found = false;

			while(!found) {
				if(typeof trinsOnLine[testTime] !== 'undefined') {
					
					possibleTrain = trinsOnLine[testTime]; 
					
					if(typeof stopsByTrain[possibleTrain][startStn] !== 'undefined')
						var startStnSeqNo = stopsByTrain[possibleTrain][startStn];
					
					if(typeof stopsByTrain[possibleTrain][nextStn] !== 'undefined')
						var nextStnSeqNo = stopsByTrain[possibleTrain][nextStn];
					
					//console.log(startStnSeqNo, nextStnSeqNo, startStnSeqNo < nextStnSeqNo);
					if(startStnSeqNo < nextStnSeqNo) {
						found = true;
					}
					 
				}
				testTime++; if(testTime > 1600) throw 'too many tries';
			}

		}

	});

	//return the findings
	return possibleTrain;
}
function _pathToRides(stnsPath) {
	var api = this;
	var unusedStns = stnsPath;
	var usedStns = [];
	var ridesObject = {};
	var currentRide = 0;

	console.log(unusedStns.length, unusedStns.length > 0);

	//loop through stns until all have been used
	//while(unusedStns.length > 0) {

		//check for a connection object
		if(typeof systemGraph[unusedStns[0]].connections !== 'undefined') {
			
			//save the connections values
			var connections = systemGraph[unusedStns[0]].connections;

			var nextTrain = api._getNextTrain(connections, unusedStns[0], unusedStns[1]);

			console.log('the next train is ', nextTrain);
		}

	//}

	return ('test');
	//return connections;
}
function _calcRoute(depart, arrive) {
	var api = this;

	return new Promise(function(resolve, reject) {

		//1. search all stations until a route is found
		var stnsPath = api._searchStations(depart, arrive);
		
		//if a round was found explore the route more
		if(typeof stnsPath.error == 'undefined') {

			//2. break the path into rides
			var trainRides = api._pathToRides(stnsPath);

			//return the object when we're finished with it
			resolve(trainRides);

		} else {
			//but if no path was found, send back the error'
			resolve(stnsPath);
		}
		
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