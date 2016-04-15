/* CALCULATEJOURNEY.JS
This module is used to accept a starting and ending point from the user and returns a path between the two points.
It accepts the following as input:
	1. a starting station
	2. an ending station
	(optional) Arrival or Departure time
	(optional) Method (Fastest Time, Least Stops, Least Transfeers)
It returns the following:
	1. a prescription of the best way to travel between the two points
*/
//declare dependencies
var fs = require('fs');
var path = require('path');
var Queue = require('../lib/queue');
var LinkedList = require('../lib/linkedlist');

//declare and initialize local variables
var systemMapJSON = fs.readFileSync(path.join(__dirname, '../assets/JSON/systemMap.json'));
var rawSystemMap = JSON.parse(systemMapJSON);

//processing methods
var findFewestStops = function(start, end) {
	//local variables
	var toCheckQueue = new Queue;
	var LLSystemMap = new LinkedList(rawSystemMap);

	console.log(' logging from the journey calculator. ' + start + ' ' + end);

	//add stations connected to the first station to the que
	toCheckQueue.addStations(LLSystemMap.getConnectedStations(start))

};

var findShortestTime = function() {}
var findFewestTransfeeres = function() {}

//exportable object
var JourneyCalculator = {
	findFewestStops: findFewestStops,
	findShortestTime: findShortestTime,
	findFewestTransfeeres: findFewestTransfeeres
}

//return the object
module.exports = JourneyCalculator;