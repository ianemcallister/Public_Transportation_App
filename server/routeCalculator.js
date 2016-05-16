'use strict';

var calculator = require('./routeCalculator');
var stopsModel = require('./assets/gtfs/stopsModel');
//var systemGraph = require('./assets/JSON/systemGraph');
//var cursorGenerator = require('./cursorModel');
var stnAgacencies = require('./assets/models/stnAgacencies');
var allStns = require('./assets/models/allStns');
var readline = require('readline');

var RouteCalculator = {
  _queue: [],
  _vertex: [],
  _endpoint: [],
  _action: [],
  _distance: {},
  _formatTime: _formatTime,
  _formatDuration: _formatDuration,
  _buildStationInfo: _buildStationInfo,
  _objectLength: _objectLength,
  _buildPath: _buildPath,
  _findPath:_findPath,
  _findLines: _findLines,
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

function _objectLength(object) {
  var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

function _buildPath(start, end, path) {
  var calc = this;
  var found = false;
  var i = 0;

  //add the arrival station
  path.push(end);

  while(!found) {
    
    //log the state
    console.log(i + '. vertex: ' + calc._vertex[i] + ' endpoint: ' + calc._endpoint[i]);  

    if(calc._vertex[i] == start && calc._endpoint[i] == end) found = true;

    if(calc._endpoint[i] == end) {
      
      //add the value to the path
      path.push(calc._vertex[i]);

      //set end to the start value
      end = calc._vertex[i];

      //reset the counter
      i = 0;
    }

    //bail if it gets too high
    if(i==500) found = true;
    i++
  }

  return path;
}

function _findPath(depart, arrive) {
  var calc = this;
  var allStations = allStns;
  var found = false;
  var distanceTraveled = 0;
  var vertCount = 0;
  var endPntCnt = 0;

  //add the starting station to the queue
  calc._queue.push(depart);

  //set the distance of the start as 0;
  allStations[depart] = 0;

  while(!found) {
    //get the first value from the queue
    calc._vertex[endPntCnt] = calc._queue[0];

    //save for later
    var thisvertex = calc._vertex[endPntCnt];

    //delete the value from the queue
    calc._queue.splice(0,1);

    //update the distance traveled
    distanceTraveled++;

    //is it the end point?
    if(!(calc._vertex[endPntCnt] == arrive)) {
      //if it's not the value we're looking for evalute further
      //console.log(calc._vertex);
      //loop through all adjacent stations
      stnAgacencies[calc._vertex[endPntCnt]].forEach(function(stn) {

        //set the endpoint
        calc._endpoint[endPntCnt] = stn;

        //set the vertix value
        calc._vertex[endPntCnt] = thisvertex;

        //if we haven't visited this station before
        if(allStations[stn] == null) {
          //calculate the distance
          allStations[stn] = allStations[depart] + distanceTraveled;

          //add that station to the queue
          calc._queue.push(stn);
        }

        //log out the findings before moving on
        console.log(endPntCnt + ': vertex: ' + calc._vertex[endPntCnt] + ' endpoint: ' 
                + calc._endpoint[endPntCnt] + ' distance: ' + distanceTraveled + ' queue:' + calc._queue);

        endPntCnt++;
      });

    } else {
      found = true;

      //log out the findings before moving on
      console.log(endPntCnt + ': vertex: ' + calc._vertex[endPntCnt] + ' endpoint: ' 
                + calc._endpoint[endPntCnt] + ' distance: ' + distanceTraveled + ' queue:' + calc._queue);
    
    }

    //incriment the counter
    vertCount++; if(vertCount==200) found = true;

  }
  
  console.log('found the solution');
  
  //console.log(calc._vertex);
  //console.log(calc._endpoint);

  //now that the solution has been found, step back through it to find the route
  //var path = [];
  //var thePath = calc._recursivePlayback(depart, arrive, path, 0);
  //console.log(thePath);
} 

function _findLines(aPath) {
  
}

function _calcRoute(depart, arrive) {
  var calc = this;
  var routeObject = {};

  //calculate a path
  calc._findPath(depart, arrive);

  //distill the path
  var aPath = [];
  var distilledPath = calc._buildPath(depart, arrive, aPath);

  //find lines for that path
  calc._findLines(distilledPath);

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

