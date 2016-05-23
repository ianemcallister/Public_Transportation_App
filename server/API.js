'use strict'

var systemGraph = require('./assets/JSON/systemGraph');
var stnAdjacencies = require('./assets/models/stnAgacencies');
var cursorGenerator = require('./cursorModel');
var rideGenerator = require('./rideModel');
var allStns = require('./assets/models/allStns');
var stopsByTrain = require('./assets/JSON/stopsByTrain');
var allTrainData = require('./assets/JSON/allTrains.json');

//the variable itself
var API = {
	_calcRoute: _calcRoute,			//local methods
	_getCurrentTime:_getCurrentTime,
	_getReadableTime:_getReadableTime,
	_formatSummary: _formatSummary, 
	_formatSteps: _formatSteps,
	_markStationVisited: _markStationVisited,
	_visitedBefore: _visitedBefore,
	_pathToRides: _pathToRides,
	_searchStations: _searchStations,
	_getNextTrain: _getNextTrain,
	_onThisLine:_onThisLine,
	_compileStnData:_compileStnData,
	_getStnValue:_getStnValue,
	getNewRoute: getNewRoute,		//external methods
	getEndpointsData: getEndpointsData
}
function _getCurrentTime() {
  var newTime = new Date();
  var hours = newTime.getHours();
  var mins = newTime.getMinutes();
  var minsOnly = ((hours * 60) + mins);

  return minsOnly;
}
function _getReadableTime(minutes) {
  var hours = Math.floor(minutes / 60);
  var mins = minutes % 60;
  var A = '';

  if(minutes > 719 && minutes < 1440) {
  	A = " pm";
  } else {
  	A = " am";
  }

  if(minutes > 779) {
  	if(minutes < 1500) hours = hours - 12;
  	else hours = hours - 24;
  }

  var readableTime = hours + ":";

  if(mins < 10) readableTime = readableTime + "0" + mins + A; 
  else readableTime = readableTime + mins + A; 

  return readableTime;
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
	var possibleTrain = {line: null, num: null};

	//check each of the connections
	Object.keys(connections).forEach(function(line) {
		
		//if a connection is for the next station
		if(nextStn == connections[line]) {
			
			//find the next train from that station on that line
			var trainsOnLine = systemGraph[startStn].trains[line];
			
			var found = false;

			while(!found) {
				if(typeof trainsOnLine[testTime] !== 'undefined') {
					
					possibleTrain.num = trainsOnLine[testTime];
					possibleTrain.line = line; 
					
					if(typeof stopsByTrain[possibleTrain.num][startStn] !== 'undefined')
						var startStnSeqNo = stopsByTrain[possibleTrain.num][startStn];
					
					if(typeof stopsByTrain[possibleTrain.num][nextStn] !== 'undefined')
						var nextStnSeqNo = stopsByTrain[possibleTrain.num][nextStn];
					
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
function _onThisLine(currentRide, nextStn) {
	var api = this;
	var line = currentRide.line;
	var train = currentRide.train;
	var lastStnNum = currentRide.path.length - 1;
	var lastStn = currentRide.path[lastStnNum];

	console.log(lastStn, nextStn);
	console.log(typeof stopsByTrain[train][nextStn] !== 'undefined', stopsByTrain[train][nextStn] > stopsByTrain[train][lastStn]);
	//check if the next stn is on the line
	if(	typeof stopsByTrain[train][nextStn] !== 'undefined' && 
		stopsByTrain[train][nextStn] > stopsByTrain[train][lastStn])
		return true;
	else return false;
}
function _pathToRides(stnsPath) {
	var api = this;
	var unusedStns = stnsPath;
	//var usedStns = [];
	var ridesObject = {};
	var currentRide = 0;

	console.log(unusedStns.length, unusedStns.length > 0);

	//loop through stns until all have been used
	//while(unusedStns.length > 0) {
		console.log('unusedStns length: ', unusedStns.length);
		//check for a connection object
		if(typeof systemGraph[unusedStns[0]].connections !== 'undefined') {
			
			//save the connections values
			var connections = systemGraph[unusedStns[0]].connections;

			var nextTrain = api._getNextTrain(connections, unusedStns[0], unusedStns[1]);

			//console.log('the next train is ', nextTrain);
			if(typeof nextTrain !== 'undefined') {
				currentRide++;

				//start a new ride
				var aNewRide = new rideGenerator(nextTrain, unusedStns[0], unusedStns[1]);

				//remove the first two stations from the list
				unusedStns.splice(0,2);

				console.log(aNewRide);

				while(api._onThisLine(aNewRide, unusedStns[0])) {

					//add the stn to the list
					aNewRide.addStnToPath(unusedStns[0]);

					//remove it from the unused list
					unusedStns.split(0,1);
				}
				
				//add the newride to the ride object
				ridesObject[currentRide] = aNewRide;

			}

		}

	//}

	return (ridesObject);
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
function _getStnValue(stn, attribute) {
	var api = this;
	var soughtValue = {};
	var stnValues = {'name':0, 'heading':1, 'description':2, 'trains':3 };

	console.log('getting: ', stn, attribute);

	switch(stnValues[attribute]) {
		case 0:
			//get the name of the station
			soughtValue = systemGraph[stn].name;
			break;
		case 1:
			//get the heading of the station
			soughtValue = systemGraph[stn].dir;
			break;
		case 2:
			//get the description of the stn
			soughtValue = systemGraph[stn].desc;
			break;
		case 3:
			//get the trains that serve this stn, by line, and their next arrivals
			var allTrains = systemGraph[stn].trains;
			soughtValue = [];

			//drill through each train first
			Object.keys(allTrains).forEach(function(train) {
				var thisTrain = allTrains[train];
				var trainObject = {};

				trainObject['line'] = train;
				trainObject['times'] = [];

				allTrainData.data.forEach(function(trainLine) {
					if(trainLine.short_name == train) trainObject['name'] = trainLine.long_name;
				});

				//then add the departure times for the remainder of the day
				Object.keys(thisTrain).forEach(function(time) {
					var currentTime = api._getCurrentTime();

					if(time >= currentTime) {
						//convert the time to a readable format
						var readableTime = " " + api._getReadableTime(time);

						trainObject['times'].push(readableTime);
					}

				});

				//after the object is finished, add it to the soughtValue
				soughtValue.push(trainObject);

			});

			break;
		default:
			break;
	}

	return soughtValue;
}
function _compileStnData(stn) {
	var api = this;
	var returnObject = {};

	returnObject['name'] = api._getStnValue(stn, 'name');
	returnObject['heading'] = api._getStnValue(stn, 'heading');
	returnObject['description'] = api._getStnValue(stn, 'description');
	returnObject['trains'] = api._getStnValue(stn, 'trains');

	return returnObject;
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
function getEndpointsData(depart, arrive) {
	var api = this;
	var endpointsObject = {};

	return new Promise(function(resolve, reject) {

		endpointsObject['departure'] = api._compileStnData(depart);
		endpointsObject['arrival'] = api._compileStnData(arrive);
		
		resolve(endpointsObject);

	}).catch(function(e) {
		console.log('Error: '+ e);
	});
}

module.exports = API;