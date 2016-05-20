'use strict';

var calculator = require('./routeCalculator');
var stopsModel = require('./assets/gtfs/stopsModel');
var systemGraph = require('./assets/JSON/systemGraph');
//var cursorGenerator = require('./cursorModel');
var stnAdjacencies = require('./assets/models/stnAgacencies');
var allStns = require('./assets/models/allStns');
var stopsByTrain = require('./assets/JSON/stopsByTrain');
var allTrains = require('./assets/JSON/allTrains.json');
var readline = require('readline');

var RouteCalculator = {
  _getCurrentTime:_getCurrentTime,
  _formatTime: _formatTime,
  _formatDuration: _formatDuration,
  _buildStationInfo: _buildStationInfo,
  _objectLength: _objectLength,
  _formatSummary: _formatSummary,
  _formatSteps:_formatSteps,
  _stationsPath: _stationsPath,
  _linesForStations:_linesForStations,
  _selectFastestRoute:_selectFastestRoute,
  _buildAJourney: _buildAJourney,
  _calcRoute: _calcRoute,
  getNewRoute: getNewRoute
}

function _getCurrentTime() {
  var newTime = new Date();
  var hours = newTime.getHours();
  var mins = newTime.getMinutes();
  var minsOnly = ((hours * 60) + mins);

  return minsOnly;
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

function _buildAJourney(depart, arrive) {

  return new Promise(function(resolve, reject) {
    resolve('worked');
  });

}

function _formatSteps(journeyObject) {
  var calc = this;

  return [
          {departure: {time: "3:13 PM", station:"Beaverton"}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:13 PM", station: "Pioneer Courthouse"}},
          {departure: false, ride:false, transfeer: {desc: "Change to the Yellow line"}, arrival: false},
          {departure: {time: "5:23 PM", station:"Galleria/SW 10th Ave "}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Yellow Line", eol:"Hillsboro", duration:"23 min", stops:"8 stops" }, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:46 PM", station:"Millikan Way MAX Station"}}
        ];
}

function _formatSummary(rawJourney) {
  var calc = this;
  var thisRouteObject = {};

  //TODO: convert all of these to formatting functions
  thisRouteObject['deprtTime'] = "3:13 PM";
  thisRouteObject['arrvTime'] = "3:28 PM";

  //build the duration
  thisRouteObject['tripDuration'] = "17min";

  //build the # of stops
  thisRouteObject['totalStops'] = 6;

  //build the departure station
  thisRouteObject['departureStn'] = calc._buildStationInfo('7774');

  //build the arrival station
  thisRouteObject['arrivalStn'] = calc._buildStationInfo('7606');

  return thisRouteObject;
}

function _stationsPath(start, end) {
  var calc = this;

  //declare local Object
  var route = {
    queue: [],
    vertex: [],
    endpoint: [],
    action: [],
    //distance: [],
    path: []
  };

  //declare loop variables
  var found = false;
  var vertCount = 0;
  var endPntCnt = 0;

  //add the starting station to the queue
  route.queue.push(start);

  //track which stations have been visited already
  allStns[start] = 0;

  //loop through stations by next station until route is found
  while(!found) {
    //get the first value from the queue
    route.vertex[endPntCnt] = route.queue[0];

    //save this vertex for later
    var thisVertex = route.vertex[endPntCnt];

    //delete the value from the queue
    route.queue.splice(0, 1);

    //if it is the end point...
    if(!(route.vertex[endPntCnt] == end)) {
      //if it's not the value we're looking for get it's adjacent agencies
      stnAdjacencies[route.vertex[endPntCnt]].forEach(function(stn) {

        //set the endpoint
        route.endpoint[endPntCnt] = stn;

        //set the vertex value
        route.vertex[endPntCnt] = thisVertex;

        //if we havn't visited this station before
        if(allStns[stn] == null) {
          //calcuate the distance
          allStns[stn] = allStns[route.vertex[endPntCnt]] + 1;

          //add the station to the queue
          route.queue.push(stn);
        }

        //incriment the endpoint counter
        endPntCnt++;
      });

    } else {
      found = true;
    }

    //incriment the coutner
    vertCount++; if(vertCount == 200) found = true;

  }

  //only pass back the required values
  var rawPathObject = {
    start: route.vertex,
    end: route.endpoint
  };

  return rawPathObject;
}

function _linesForStations(allSteps) {}
function _selectFastestRoute(allOptions) {}

function _calcRoute(depart, arrive) {
  var calc = this;

  //return the promise
  return new Promise(function(resolve, reject) {
      var found = false;
      var i = 0;

      //1. find a path with specific steps between dep and arr
      var stepsBetweenStations = calc._stationsPath(depart, arrive);

      //see what I got back
      console.log(stepsBetweenStations);

      //2. reduce the steps to rides on train lines
      var lineOptionsRoute = calc._linesForStations(stepsBetweenStations);

      //3. find best arrival and departure times on those lines
      var routeObject = calc._selectFastestRoute(lineOptionsRoute);

      //4. return the fastest route to the user
      resolve(routeObject);

    }).catch(function(e) {
      console.log('Error: ' + e);
    });
    
}

/*  getNewRoute
*   This function interacts with the Server to provide a journey object
*   Input: 
*     1. Departure Station: An Integer
*     2. Arrival Station: an Integer
*   Output:
*     1. journeyObject: An Object
*         this object contains all aspects of the requested route 
*/
function getNewRoute(depart, arrive) {
  var calc = this;
  var journeyObject = {};

  console.log(depart, arrive);

  //return as a promise to the server
  return new Promise(function(resolve, reject) {

    //pass values to the calculator and get them back 
    calc._calcRoute(depart, arrive).then(function(rawJourney) {
      
      //console.log(rawJourney);
      
      //first build the summary
      journeyObject = calc._formatSummary(rawJourney);

      //then overwrite the steps object
      journeyObject['steps'] = calc._formatSteps(rawJourney);

      //read the object out before returning
      //console.log(journeyObject);

      //return the journeyObject;
      resolve(journeyObject);

    }).catch(function(e) {
      console.log('Error:' + e);
    });

  });

}

module.exports = RouteCalculator;



