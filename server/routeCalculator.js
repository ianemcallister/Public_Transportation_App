'use strict';

var calculator = require('./routeCalculator');
var stopsModel = require('./assets/gtfs/stopsModel');
var systemGraph = require('./assets/JSON/systemGraph');
//var cursorGenerator = require('./cursorModel');
var stnAgacencies = require('./assets/models/stnAgacencies');
var allStns = require('./assets/models/allStns');
var stopsByTrain = require('./assets/JSON/stopsByTrain');
var allTrains = require('./assets/JSON/allTrains.json');
var readline = require('readline');

var RouteCalculator = {
  _queue: [],
  _vertex: [],
  _endpoint: [],
  _action: [],
  _distance: {},
  _getCurrentTime:_getCurrentTime,
  _formatTime: _formatTime,
  _formatDuration: _formatDuration,
  _buildStationInfo: _buildStationInfo,
  _objectLength: _objectLength,
  _buildPath: _buildPath,
  _findPath:_findPath,
  _findLines: _findLines,
  _proposeRoutes:_proposeRoutes,
  _getTimesAndTrains: _getTimesAndTrains,
  _pickTravelOption: _pickTravelOption,
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

function _buildPath(start, end, path) {
  var calc = this;
  var found = false;
  var i = 0;

  //add the arrival station
  path.push(end);

  while(!found) {
    
    //log the state
    //console.log(i + '. vertex: ' + calc._vertex[i] + ' endpoint: ' + calc._endpoint[i]);  

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
        /*console.log(endPntCnt + ': vertex: ' + calc._vertex[endPntCnt] + ' endpoint: ' 
                + calc._endpoint[endPntCnt] + ' distance: ' + distanceTraveled + ' queue:' + calc._queue);
        */
        endPntCnt++;
      });

    } else {
      found = true;

      //log out the findings before moving on
      /*console.log(endPntCnt + ': vertex: ' + calc._vertex[endPntCnt] + ' endpoint: ' 
                + calc._endpoint[endPntCnt] + ' distance: ' + distanceTraveled + ' queue:' + calc._queue);
      */
    }

    //incriment the counter
    vertCount++; if(vertCount==200) found = true;

  }
  
  //console.log('found the solution');
  
  //console.log(calc._vertex);
  //console.log(calc._endpoint);

  //now that the solution has been found, step back through it to find the route
  //var path = [];
  //var thePath = calc._recursivePlayback(depart, arrive, path, 0);
  //console.log(thePath);
} 

function _findLines(aPath) {
  
  //build a list of possible lines for each stop
  var travelPath = aPath.reverse();
  var possibleLines = {};
  var seqNum = 0;

  travelPath.forEach(function(stop) {
    var allLines = {};

    //get lines for this station
    if(typeof systemGraph[stop].lines !== 'undefined') {
      var dirlinesObject = systemGraph[stop].lines;

      Object.keys(dirlinesObject).forEach(function(line) {
        allLines[line] = true;
      });
    }

    if(typeof systemGraph[stop].parent !== 'undefined') {
      var prntStop = systemGraph[stop].parent;
      var prntLinesObject = systemGraph[prntStop].childStns;

      Object.keys(dirlinesObject).forEach(function(line) {
        allLines[line] = true;
      });
    }
    possibleLines[seqNum] = {};
    possibleLines[seqNum][stop] = allLines;
    seqNum++;
  });

  return possibleLines
} 

function _proposeRoutes(stopSqn) {
  var calc = this;

  //console.log('proposing a route');
  //console.log(stopSqn);
  var totalStops = calc._objectLength(stopSqn);
  var allLines = {90:0, 100:0, 190:0, 200:0, 290:0};
  var proposedRouteOptions = {};
  var totalOptions = 1;

  //look for transfeers
  //first does one line go all the way through?
  //unpack stops first
  Object.keys(stopSqn).forEach(function(stop) {
    var thisStop =stopSqn[stop];

    //then stations
    Object.keys(thisStop).forEach(function(stn) {
      var thisStn = thisStop[stn];

      //then lines
      Object.keys(thisStn).forEach(function(line) {
        
        allLines[line]++;

      });

    });

  });

  var dirctLines = {};

  Object.keys(allLines).forEach(function(line) {
    
    //if a line hits all the stops it is direct
    if(allLines[line] == totalStops) {
      //create a new option
      proposedRouteOptions[totalOptions] = {};
      var thisOption = proposedRouteOptions[totalOptions];
      var i = 0;
      var firstStation = null;
      var lastStation = null;

      Object.keys(stopSqn).forEach(function(stop) {
        var thisStop =stopSqn[stop];

        //then stations
        Object.keys(thisStop).forEach(function(stn) {
          

          if(i==0) firstStation = stn;
          if(i==(totalStops-1)) lastStation = stn;

          i++;
        });

      });

      thisOption[1] = {line: line, start: firstStation , end:lastStation,  stops:(totalStops-1), arrive:null, depart: null};

      //if it is direct save it as one step

      
    } else {
      //fringe cases//TRANSFEERS!!!!!
    }

    //incriment the options counter
    totalOptions++;
  });

  return proposedRouteOptions;
}

function _getTimesAndTrains(routes) {
  var calc = this;
  //notify the user
  //console.log('getting times and trains');
  //console.log(routes);
  //console.log(routes[1][1][90]);
  var travelPlan = {};

  return new Promise(function(resolve, reject) {
    //check all route options
    Object.keys(routes).forEach(function(option) {
      var thisOption = routes[option];

      Object.keys(thisOption).forEach(function(step) {
        var thisLine = thisOption[step].line;
        var startStation = thisOption[step].start;
        var endStation = thisOption[step].end;
        var time = calc._getCurrentTime();
        var found = false;
        var i = 0;
        
        //find a train on from the correct station, on the correct line leaving close to the current time
        var allTimes = systemGraph[startStation].trains[thisLine];

        while(!found) {
          var checker = time + i;
          if(typeof allTimes[checker] !== 'undefined') {
            var thisTrain = allTimes[checker];
            //make sure this train goes all the way
            if(typeof stopsByTrain[thisTrain][startStation] !== 'undefined' && 
               typeof stopsByTrain[thisTrain][endStation] !== 'undefined') {

              //set the departure time
              thisOption[step].depart = checker; 

              //get the arrival times
              var arrivalTimes = systemGraph[endStation].trains[thisLine];

              Object.keys(arrivalTimes).forEach(function(time) {
                
                if(arrivalTimes[time] == thisTrain) thisOption[step].arrive = time;
              });
             

              //throw the flag
              found=true;
            }

          }
          //incriment counter
          i++; if(i==1000) found = true;
        }


      });

    });

    resolve(routes);

    //pick the best time to return
    /*var completeOptions = calc._calcDurations(routes);
    var bestDuration = {time: null, option: null};

    Object.keys(completeOptions).forEach(function(option) {

      if(bestDuration.time == null) { 
        bestDuration.option = option;
        bestDuration.time = completeOptions[option].duration;
      } else if(bestDuration.time > completeOptions[option].duration) {
        bestDuration.option = option;
        bestDuration.time = completeOptions[option].duration
      }

    });

    return completeOptions[bestDuration.option];*/
    
  });
  
}

function _pickTravelOption(options) {
  var calc = this;

}

function _calcRoute(depart, arrive) {
  var calc = this;
  var routeObject = {};

  return new Promise(function(resolve, reject) {
    //calculate a path
    calc._findPath(depart, arrive);

    //distill the path
    var aPath = [];
    var distilledPath = calc._buildPath(depart, arrive, aPath);

    //find lines for that path
    var possibleLines = calc._findLines(distilledPath);

    //get a route options
    var routeProposal = calc._proposeRoutes(possibleLines);

    //get times and trains for that route
    calc._getTimesAndTrains(routeProposal).then(function(response) {
      //console.log(response[1]);
     
      var dprtStn = systemGraph[response[1].start].name;
      var arrvStn = systemGraph[response[1].end].name;
      var lineNme = null;

      //console.log(dprtStn, arrvStn);
      Object.keys(allTrains.data).forEach(function(line) {
        if(line.short_name = response[1].line) {
          lineNme = line.long_name;
        }
      });

      //only using the first option right now
      routeObject['deprtTime'] = response[1].depart;
      routeObject['arrvTime'] = response[1].arrive;
      routeObject['tripDuration'] = response[1].arrive - response[1].depart;
      routeObject['totalStops'] = response[1].stops;

      routeObject['steps'] = [
            {departure: {time: calc._formatTime(response[1].depart), station:dprtStn}, ride:false, transfeer: false, arrival: false},
            {departure: false, ride:{line:lineNme, eol:"Expo Center", duration:(response[1].arrive - response[1].depart +" min"), stops:(response[1].stops+" stops")}, transfeer: false, arrival: false},
            {departure: false, ride:false, transfeer: false, arrival: {time:calc._formatTime(response[1].arrive), station:arrvStn}}
          ];

      console.log(routeObject);
      
    });

    resolve(routeObject);
  });

}

function getNewRoute(depart, arrive) {
	var rc = this;
  var journeyObject = {};

  //find a route
  var newRoute = {};

  return new Promise(function(resolve, reject) {

    rc._calcRoute(depart, arrive).then(function(response) {
      newRoute = response;

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

    });

    resolve(journeyObject);

  });

}

module.exports = RouteCalculator;

