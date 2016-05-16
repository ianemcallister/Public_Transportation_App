'use strict';

var calculator = require('./routeCalculator');
var stopsModel = require('./assets/gtfs/stopsModel');
var systemGraph = require('./assets/JSON/systemGraph');
var cursorGenerator = require('./cursorModel');

var RouteCalculator = {
  _formatTime: _formatTime,
  _formatDuration: _formatDuration,
  _buildStationInfo: _buildStationInfo,
  _linesObjToArray: _linesObjToArray,
  _getUnvisitedConnections: _getUnvisitedConnections,
  _calcRoute: _calcRoute,
  getNewRoute: getNewRoute
}

function _formatTime(mins) {
  var HH = Math.floor(mins / 60);
  var mm = mins % 60;
  var A = '';
  if(mins >= 720) HH -= 12;
  if(mins >= 720) A = 'PM';
  else A = "AM";
  return (HH + ":" + mm + " " + A);
}

function _formatDuration(mins) {
  return mins + "min";
}

function _buildStationInfo(stnId) {
  return {
    name: stopsModel[stnId].name,
    id: ("Station " + stnId),
    desc: stopsModel[stnId].desc
  }
}

function _linesObjToArray(obj) {
  let returnArray = [];

  Object.keys(obj).forEach(function(key) {
    returnArray.push(key);
  });

  return returnArray;
}

function _getUnvisitedConnections(currentNode, visitedStns) {
  var uc = this;
  var holdingObject = {};
  var returnArray = [];
  console.log('current node is: ', currentNode);
  //get connections
  var connections = systemGraph[currentNode].connections;
  
  //build as model first (to avoid collisions);
  Object.keys(connections).forEach(function(connection) {
    var station = connections[connection];
    holdingObject[station] = true;
  });
  
  //then transfeer the model to an array
  Object.keys(holdingObject).forEach(function(connection) {
    returnArray.push(connection);
  });

  //return the array
  return returnArray;
}

function _calcRoute(depart, arrive) {
  var calc = this;
  var routeObject = {};
  var dprtHeading = systemGraph[depart].dir;
  var linesObj = systemGraph[depart].lines;
  var dprtLines = calc._linesObjToArray(linesObj);

  //calc nodes
  var queue = [];
  var toCheck = {};
  var visitedStns = {};

  //1. set the cursor on the current node, and add to the path
  var cursor = new cursorGenerator;
  cursor.setPosition(depart);
  cursor.addPathStep({stn: depart, lineOptions: dprtLines, heading: dprtHeading});

  //2. add each unvisited connection to a que of nodes to check
  var cursorPosition = cursor.getPosition();
  
  toCheck = calc._getUnvisitedConnections(cursorPosition, visitedStns);
  //3. move cursor to the first qued node and save it's unique path

  //4. if this is the destination node throw the flag and, return the path

  //5. otherwise, add the unvisited connecting nodes to the que and return to #3
  console.log(toCheck);


  //add the values to the model
  routeObject['deprtTime'] = 913;
  routeObject['arrvTime'] = 928;
  routeObject['tripDuration'] = 17;
  routeObject['totalStops'] = 6;
  routeObject['steps'] = [
          {departure: {time: "3:13 PM", station:"Beaverton"}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:13 PM", station: "Pioneer Courthouse"}},
          {departure: false, ride:false, transfeer: {desc: "Change to the Yellow line"}, arrival: false},
          {departure: {time: "5:23 PM", station:"Galleria/SW 10th Ave "}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Yellow Line", eol:"Hillsboro", duration:"23 min", stops:"8 stops" }, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:46 PM", station:"Millikan Way MAX Station"}}
        ];

  return routeObject;
}

function getNewRoute(depart, arrive) {
	var rc = this;
  var journeyObject = {};

  console.log(depart, arrive);

  //find a route
  var newRoute = rc._calcRoute(depart, arrive);

  //build the times
  journeyObject['deprtTime'] = rc._formatTime(newRoute.deprtTime);
  journeyObject['arrvTime'] = rc._formatTime(newRoute.arrvTime);

  //build the duration
  journeyObject['tripDuration'] = rc._formatDuration(newRoute.tripDuration);

  //build the # of stops
  journeyObject['totalStops'] = newRoute.totalStops;

  //build the departure station
  journeyObject['departureStn'] = rc._buildStationInfo(depart);

  //build the arrival station
  journeyObject['arrivalStn'] = rc._buildStationInfo(arrive);

  //build the steps
  journeyObject['steps'] = newRoute.steps;

	return journeyObject;
}

module.exports = RouteCalculator;

