'use strict';

var calculator = require('./routeCalculator');
var stopsModel = require('./assets/gtfs/stopsModel');
var systemGraph = require('./assets/JSON/systemGraph');
var cursorGenerator = require('./cursorModel');

var RouteCalculator = {
  _formatTime: _formatTime,
  _formatDuration: _formatDuration,
  _objectLength: _objectLength,
  _buildStationInfo: _buildStationInfo,
  _getMoveOptions: _getMoveOptions,
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

function _objectLength(object) {
  var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

function _buildStationInfo(stnId) {
  return {
    name: stopsModel[stnId].name,
    id: ("Station " + stnId),
    desc: stopsModel[stnId].desc
  }
}

function _getMoveOptions(pos) {
  var calc = this;
  var holdingObj = {};
  var retObj = [];
  var consFound = false;

  //check for direct connections
  if(typeof systemGraph[pos].connections !== 'undefined') {
    var dirCons = systemGraph[pos].connections;
    var displayArray = [];

    //run through direct cons
    Object.keys(dirCons).forEach(function(con) {
      //add next station to the queue
      holdingObj[dirCons[con]] = true;
    });

    Object.keys(holdingObj).forEach(function(con) {
      displayArray.push(con);
    });

    //for show
    //console.log('dirct cons: ', displayArray);

    consFound = true;
  }

  //check for connectsion through parent station
  if(typeof systemGraph[pos].parent !== 'undefined') {
    var parStn = systemGraph[pos].parent;
    var parCons = systemGraph[parStn].childStns;
    var displayArray = [];


    //run through parent cons
    Object.keys(parCons).forEach(function(route) {
      
      Object.keys(parCons[route]).forEach(function(con) {
        
        //add next station to the queue
        holdingObj[con] = true;

      });
      
    });

    Object.keys(holdingObj).forEach(function(con) {
      displayArray.push(con);
    });

    //for show
    //console.log('parent cons: ', displayArray);
    
    consFound = true;
  }

  //convert the holding object to an array
  Object.keys(holdingObj).forEach(function(stn) {
    retObj.push(parseInt(stn));
  });

  if(consFound) {
   
    //if cons were found pass them back, or throw an error
    //console.log('cons found: ', retObj);
    return retObj;
  } else {
    console.log('no cons found');
    throw 'No connections found';
  }
}

function _calcRoute(depart, arrive) {
  var calc = this;
  var routeObject = {};

  //calc nodes
  var cursor = null;
  var queue = [];
  var toCheck = {};
  var found = false;
  var winning = {};
  var visited = {};
  var i = 0;
  var found = false;
  //set the inital cursor position
  queue[0] = depart;

  while(!(cursor == arrive) && !found) {  //check if the destination has been reached
    //get the first station in the queue
    if(typeof queue[0] !== 'undefined') {
      cursor = queue[0];
      //then remove record from the queue
      queue.splice(0,1);
    } else {
      found = true;
    }

    //add cursor to the visited queue
    if(typeof visited[cursor] == 'undefined') visited[cursor] = i;

    //get move options
    var moveOptions = [];
    moveOptions = calc._getMoveOptions(cursor);

    //add move options to the queue
    moveOptions.forEach(function(opt) {
      if(typeof visited[opt] == 'undefined') {
        queue.push(opt);  
      } else {
        //console.log('aready added this one');
      }

    });

    //print the queue
    console.log('LOOK HERE: the queue is: ', queue);
    //console.log('LOOK HERE: visited stations: ', visited);

    i++;
    if(i==200) found = true;
  }

  console.log('found the end! ', visited);

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

