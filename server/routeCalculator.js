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
  _getAllTrains: _getAllTrains,
  _formatSummary: _formatSummary,
  _formatSteps:_formatSteps,
  _stationsPath: _stationsPath,
  _areSameLine: _areSameLine,
  _buildLinesScorecard: _buildLinesScorecard,
  _buildLinesPerStop: _buildLinesPerStop,
  _getStepsFromRide: _getStepsFromRide,
  _findSegments: _findSegments,
  _buildNewDeparture: _buildNewDeparture,
  _buildNewRide: _buildNewRide,
  _buildNewArrival: _buildNewArrival,
  _buildNewTransfeer: _buildNewTransfeer,
  _calculateRideTimes:_calculateRideTimes,
  _buildJourneyTree: _buildJourneyTree,
  _connectingTrains: _connectingTrains,
  _selectFastestRoute:_selectFastestRoute,
  _searchStations: _searchStations,
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

function _getAllTrains(format) {
  var blankTrainsObject = {};

  if(format == 'bool') {
    allTrains.data.forEach(function(line) {
      blankTrainsObject[line.short_name] = false;
    });
  } else {
    allTrains.data.forEach(function(line) {
      blankTrainsObject[line.short_name] = 0;
    });
  }

  return blankTrainsObject;
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

function _searchStations(start, end) {
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
    depart: start,
    arrive: end,
    start: route.vertex,
    end: route.endpoint
  };

  return rawPathObject;
}

function _stationsPath(allSteps) {
  var calc = this;

  //loop variables
  var found = false;
  var i = 0;
  var path = [];
  var thisEnd = allSteps.arrive;

  //add the arrival station 
  path.push(allSteps.arrive);

  //work backwards to find the appropriate connections

  while(!found) { 

    //if both values match we've found our path
    if( allSteps.start[i] == allSteps.depart && 
        allSteps.end[i] == thisEnd) {
          found = true;
        }

    //if we're not finished...
    if(allSteps.end[i] == thisEnd) {

      console.log('found ' + thisEnd + ' after ' + i + ' checks. Start: ' +  allSteps.start[i] + ' end: '+ allSteps.end[i]);

      //add the value to the path
      path.push(allSteps.start[i]);

      //set the end to the start value
      thisEnd = allSteps.start[i];

      //reset the counter
      i = 0;
    }

    //console.log('looking for ' + thisEnd + ' start: ' + allSteps.start[i] + ' end: '+ allSteps.end[i]);

    //if it's taking too long, bail
    i++; if(i == 500) found = true; 
  }

  return path.reverse();

}

function _buildLinesScorecard(allStops) {
  var calc = this;
  var linesScorecard = calc._getAllTrains();

  //determine which lines serve each station on the path
  allStops.forEach(function(stationId) {
    var thisStnTrains = systemGraph[stationId].trains;

    Object.keys(thisStnTrains).forEach(function(line) {

      //credit the line
      linesScorecard[line]++;

    });

  });

  return linesScorecard;
}

function _connectingTrains(start, end, line) {
  var calc = this;
  var departureOptions = systemGraph[start].trains[line];
  var trainsList = [];

  //find a train leaving this station on this line
  //var departureTrain = 
  //does it reach the ending station?
  Object.keys(departureOptions).forEach(function(key) {
    var thisTrain = departureOptions[key];
    //does that train connect to our ending stop?
    if(typeof stopsByTrain[thisTrain][end] == 'number') {
      trainsList.push(thisTrain)
    }

  });

  return trainsList;
}

function _buildLinesPerStop(allStops) {
  var calc = this;
  var stopsHaveLines = {};

  //determine which lines serve each station on the path
  allStops.forEach(function(stationId) {
    //get the trains for this station
    var thisStnTrains = systemGraph[stationId].trains;
    //add all trains to the holding object
    stopsHaveLines[stationId] = calc._getAllTrains('bool');

    Object.keys(thisStnTrains).forEach(function(line) {

      //add the line to the holding object
      stopsHaveLines[stationId][line] = true;

    });

  });

  return stopsHaveLines
}

function _areSameLine(start, end) {
  var calc = this;
  var sameLines = [];
  var allTrainLines = calc._getAllTrains();
  var connections = {
    start: {},
    end: {}
  };

  //check for direct connections
  if(typeof systemGraph[start].connections !== 'undefined') {

    //loop through them
    Object.keys(systemGraph[start].connections).forEach(function(key) {
      connections.start[key] = true;
    });

  }

  if(typeof systemGraph[end].connections !== 'undefined') {

    //loop through them
    Object.keys(systemGraph[end].connections).forEach(function(key) {
      connections.end[key] = true;
    });

  }

  //check for parent connections
  if(typeof systemGraph[start].parent !== 'undefined') {
    var parentStn = systemGraph[start].parent;
    
    Object.keys(systemGraph[parentStn].childStns).forEach(function(key) {
      connections.start[key] = true;
    });

  }

  if(typeof systemGraph[end].parent !== 'undefined') {
    var parentStn = systemGraph[end].parent;
    
    Object.keys(systemGraph[parentStn].childStns).forEach(function(key) {
      connections.end[key] = true;
    });

  }

  //post the objects to comare
  //console.log('comparing ', connections);

  //loop through all the lines
  Object.keys(allTrainLines).forEach(function(key) {

    //check for lines served
    if(connections.start[key] && connections.end[key])
      sameLines.push(key);
    
  });

  return sameLines;
}

function _findSegments(allRides, remainingStops) {
  var calc = this;

  //console.log('in _findSegments:', allRides, remainingStops);

  //check for remaining stops
  if(remainingStops.length > 0) {
    //if there are remaining stops...
    //local variables
    var found = false;
    var departure = parseInt(remainingStops[0]);
    var revsePath = remainingStops.reverse();
    var lastStation = parseInt(revsePath[0]);
    var newRemainingStops = [];

    //now that lastStaions is saved, update the reversePath
    revsePath.splice(0,1);

    //console.log('looking between ' + departure + ' and ' + lastStation);

    while(!found) {
      //calculate similar lines
      var similarLines = calc._areSameLine(departure, lastStation);

      //evaluate similar lines
      if(similarLines.length > 0) {
        
        //console.log('found similar lines ' + similarLines);
        //save route options for this ride
        var thisRide = {
          start: departure,
          end: lastStation,
          lines: similarLines
        };

        //push the route onto the object
        allRides.push(thisRide);

        //if there is a revi
        //console.log('# of reminaing stops', newRemainingStops.length );

        //call this function again with a revised object
        calc._findSegments(allRides, newRemainingStops.reverse());

        //throw the flag
        found = true;

      } else {
        //console.log('no similar line found');
        //if a similar route is not found
        //if the newRemainingStops object is empty push the last stop
        if(newRemainingStops.length == 0)
          newRemainingStops.push(lastStation);

        //push the second to last station on to the newRemainingStops object
        newRemainingStops.push(revsePath[0]);

      }

      //get a new ending point
      lastStation = revsePath[0];
      revsePath.splice(0,1);

    }

    return allRides;

  } else {
    //if there are no more remaining stops, return the rides object
    return allRides;
  }

}

function _buildNewDeparture(aRide, startTime) {
  var calc = this;

  //local variables
  var start = parseInt(aRide.start);
  var end = parseInt(aRide.end);
  var trainLines = aRide.lines;
  var bestDeparture = {time: 1000000, line:null};
  var departureTimes = {};
  var departureObject = {
    time: null,
    station: null,
    line: null
  };

  //loop through each train line option
  trainLines.forEach(function(line) {

    //local variables
    var trainTimes = systemGraph[start].trains[line];
    var testTime = startTime;
    var found = false;

    //console.log(trainTimes);

    while(!found) {

      //console.log(testTime, trainTimes[testTime]);
      if(typeof trainTimes[testTime] !== 'undefined') {
        var thisTrain = trainTimes[testTime];

        //console.log('looking for ', thisTrain);
        //as long as this train goes all the way through
        //console.log('found train', thisTrain, 'start', start, 'end', end, 'works', typeof stopsByTrain[thisTrain][start] !== 'undefined' && typeof stopsByTrain[thisTrain][end] !== 'undefined');

        if( typeof stopsByTrain[thisTrain][start] !== 'undefined' && 
            typeof stopsByTrain[thisTrain][end] !== 'undefined') {
          //console.log('it\'s valid');

          if(stopsByTrain[thisTrain][end] > stopsByTrain[thisTrain][start]) {
            departureTimes[line] = testTime;
            found = true;
          } else throw 'train goes wrong direction';

        }
      }

      //if nothing was found incriment time by 1 min
      testTime++; if(testTime > 1600) throw 'an error occured';
    }

  });

  //figure out which is the best departure time
  Object.keys(departureTimes).forEach(function(key) {
    if(departureTimes[key] < bestDeparture.time) {
      bestDeparture.time = departureTimes[key];
      bestDeparture.line = key;
    }
  });

  //get a departure time
  departureObject.time = bestDeparture.time;
  departureObject.line = bestDeparture.line;

  //get a departure station
  departureObject.station = systemGraph[start].name;
  
  //add the departure train for confirmation

  departureObject['train'] = systemGraph[start].trains[departureObject.line][departureObject.time];

  return departureObject;
}

function _buildNewRide(aRide, departureObject) {
  var calc = this;

  //declare local variables
  var start = parseInt(aRide.start);
  var end = parseInt(aRide.end);
  var startTime = departureObject.time;
  var train = departureObject.train;
  var thisLine = departureObject.line;
  var returnObject = {
    line: null, 
    eol:null, 
    duration: null, 
    stops: null
  };

  //get the train line name
  allTrains.data.forEach(function(trainLine) {

    if(trainLine.short_name == thisLine) {
      returnObject.line = trainLine.long_name;
    }

  });

  //get the eol name
  //get the duration
  //save the number of stops
  //console.log(train, start, end, '#ofStops:', stopsByTrain[train][start], stopsByTrain[train][end]);

  returnObject.stops = (stopsByTrain[train][end] - stopsByTrain[train][start]);

  return returnObject;
}

function _buildNewArrival(aRide) {
  return {time: null, station:null};
}

function _buildNewTransfeer(aRide) {
  return {desc: null};
}


function _getStepsFromRide(allRides) {
  var calc = this;

  //local variables
  var totalNoOfRides = calc._objectLength(allRides);
  var allSteps = [];
  var noOfRides = 0;
  var stnArrivalTime = calc._getCurrentTime();

  //departure e.g. {time: "3:13 PM", station:"Beaverton"}
  //ride e.g. {line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}
  //transfeer e.g. {desc: "Change to the Yellow line"}
  //arrive e.g. {time:"5:46 PM", station:"Millikan Way MAX Station"}

  //step through each step
  allRides.forEach(function(aRide) {
    //count this line
    noOfRides++;

    //build step objects, either departure, ride, transfeer, or arrive
    //build departure {time: null, station:null};
    var newDeparture = calc._buildNewDeparture(aRide, stnArrivalTime);
    allSteps.push(newDeparture);

    //build ride {line: null, eol:null, duration: null, stops: null};
    var newRide = calc._buildNewRide(aRide, newDeparture);
    allSteps.push(newRide);

    //build arrival {time: null, station:null};
    var newArrival = calc._buildNewArrival(aRide);
    allSteps.push(newArrival);

    //if this is not the last ride build a transfeer {desc: null};
    if(totalNoOfRides > noOfRides) {
      var newTransfeer = calc._buildNewTransfeer(aRide);
      allSteps.push(newTransfeer);
    }

    stnArrivalTime = newArrival.time;

  });

  return allSteps;
}

function _selectFastestRoute(journeyTree) {
  var calc = this;
  var currentRide = 1;
  var journeyOptions = {};
  var bestRoute = {
    summary: {
      deprtTime: null,
      arrvTime: null,
      tripDuration: null,
      totalStops: null,
      departureStn: '',
      arrivalStn: ''
    },
    steps: []
  }

  //departure e.g. {time: "3:13 PM", station:"Beaverton"}
  //ride e.g. {line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}
  //transfeer e.g. {desc: "Change to the Yellow line"}
  //arrive e.g. {time:"5:46 PM", station:"Millikan Way MAX Station"}

  //step through each step of the journey
  allRides.forEach(function(ride) {
    //each ride has a departure, a ride, and an arrival

    //turn each ride into steps
    var stepsForRide = calc._getStepsFromRide(ride);

    //add these steps to the whole ride
    stepsForRide.forEach(function(step) {
      bestRoute
    });
    
    //build departure first
    var departureStationId = ride.start;
    var departureStationName = systemGraph[departureStationId].name;
    var departureStationHeading = systemGraph[departureStationId].dir;
    var departureStationTrains = ride.lines;
    var arrivalStationId = ride.end;

    //get the current time
    var currentTime = calc._getCurrentTime();
    var trainTime = 0;

    //check for the closest time to the current time
    departureStationTrains.forEach(function(line) {
      var currentline = systemGraph[departureStationId].trains[line];
      var found = false;
      var testingTime = currentTime;

      console.log('checking this line', currentline);

      while(!found) { 
        console.log('testing train time: ', testingTime);

        //is this an arrival time?
        if(typeof currentline[testingTime] !== 'undefined') {
          var connectingTrain = currentline[testingTime];
          
          //make sure this train goes to the next station
          if(typeof stopsByTrain[connectingTrain][arrivalStationId] !== 'undefined') {

            //set the train time
            trainTime = testingTime;

            //throw the flag
            found = true;
          }

        }

        //if not incriment the testing time by a minue
        testingTime++; if(testingTime >  1600) throw 'error finding time';
      }

    });

    throw ('found this time ' + trainTime);

    if(currentRide == 1) {
      //if this is the first ride, save the departure info to the summary

    }
    //if there's another ride then add a transfeer
  });

  //return the best route
  return bestRoute;
}

function _buildJourneyTree(journeyTree, allRides, level) {
  var calc = this;
  var numberOfLevels = calc._objectLength(allRides);

  //console.log('rides left', calc._objectLength(allRides), allRides);
  console.log("level", level, '#Objects', numberOfLevels);

  //check for the last ride
  if(level < (numberOfLevels - 1)) {

    //and go deeper
    journeyTree = calc._buildJourneyTree(journeyTree, allRides, (level + 1));

    var newJourneyTree = {};
    var departureStn = allRides[level].start;
    var allLines = allRides[level].lines;
    var arrivalStn = allRides[level].end;

    console.log('the level is ', level, departureStn);

    //set values
    newJourneyTree['stn'] = arrivalStn;
    newJourneyTree['arrive'] = null;
    newJourneyTree['depart'] = null;
    newJourneyTree['lines'] = {};
    newJourneyTree['nextStn'] = journeyTree;

    //loop through lines
    allLines.forEach(function(line) {
      newJourneyTree.lines[line] = {};
    });

  } else {
    //if we're at the bottom
    console.log('at the bottom');
    
    var departureStn = allRides[level].start;
    var allLines = allRides[level].lines;
    var arrivalStn = allRides[level].end;

    //build arrival station
    var arrivalStation = { stn:arrivalStn, arrive:{} };

    //console.log(arrivalStation);

    /*
    //build the journeyTree
    journeyTree['stn'] = departureStn;
    journeyTree['arrive'] = null;
    journeyTree['depart'] = null;
    journeyTree['lines'] = {};

    allLines.forEach(function(line) {
      //add the arrival station to the end of the chain
      //journeyTree.lines[line] = {train:null, duration:null, arrive:arrivalStation};
      journeyTree.lines[line] = {};
      arrivalStation.arrive[line] = {};

    });

    journeyTree['nextStn'] = arrivalStation;

    //console.log('got the the bottom', journeyTree);

    return journeyTree;*/
    return arrivalStation;
  }

  journeyTree['stn'] = departureStn;
  journeyTree['arrive'] = null;
  journeyTree['depart'] = null;
  journeyTree['lines'] = {};
  journeyTree['nextStn'] = newJourneyTree;

  //loop through lines
  allLines.forEach(function(line) {
    journeyTree.lines[line] = {};
  });

  //return the tree
  return journeyTree;

}

function _calculateRideTimes(journeyTree) {
  var calc = this;

  console.log('_calculateRideTimes');
  //get the current time
  var currentTime = calc._getCurrentTime();

  //find a train leaving this station, for the next station at the right time
  var startStn = journeyTree.stn;
  if(typeof journeyTree.nextStn.stn !== 'undefined')
    var endStn = journeyTree.nextStn.stn;

  //check each line for this station
  Object.keys(journeyTree.lines).forEach(function(key) {
    var arrivalTimes = systemGraph[startStn].trains[key];
    var testTime = currentTime;
    var found = false;

    while(!found) {

      if(typeof arrivalTimes[testTime] !== 'undefined') {
        var thisTrain = arrivalTimes[testTime];

        //make sure this train goes all the way through
        found = true;
      }

      //if the time wasn't valid incriment by a minute
      testTime++; if(testTime > 1600) throw 'counted too high';
    }

    console.log(startStn, key, testTime);

  });


  //if(typeof journeyTree.nextStn !== 'undefined')
    //calc._calculateRideTimes(journeyTree.nextStn);
}

function _calcRoute(depart, arrive) {
  var calc = this;

  //return the promise
  return new Promise(function(resolve, reject) {
      var found = false;
      var i = 0;

      console.log('looking for a path');
      //1. search all stations until a route is found
      var allSearchedStations = calc._searchStations(depart, arrive);

      //see what I got back
      //console.log('all stops searched', allSearchedStations);

      console.log('looking for steps'/*, allSearchedStations*/);
      //2. find a path with specific steps between dep and arr
      var pathBetweenStations = calc._stationsPath(allSearchedStations);

      console.log('the path is', pathBetweenStations);
      throw 'waiting here';
      //see what I got back
      //console.log('the path is', pathBetweenStations);

      console.log('looking for rides');
      //3. reduce the steps to rides on train lines
      var allRides = calc._findSegments([], pathBetweenStations);

      console.log('got these rides', allRides);

      //4. turn rides into steps
      var allSteps = calc._getStepsFromRide(allRides);

      console.log('got these steps', allSteps);
      //4. create a tree of ride possiblities
      //var journeyTree = calc._buildJourneyTree({}, allRides, 0);

      //console.log('got this tree', journeyTree);
      //5. calculate ride times
      //var treeWithTimes = calc._calculateRideTimes(journeyTree);

      //console.log(journeyTree);
      throw 'cutting out';
      //5. find trains between stations
      //5. find the fastest route
      //var routeObject = calc._selectFastestRoute(journeyTree);

      //see what I got back
      //console.log('the fastest route is', routeObject);

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

  //console.log(depart, arrive);

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



