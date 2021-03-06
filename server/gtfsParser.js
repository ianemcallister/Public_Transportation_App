'use strict';

var readline = require('readline');
var fs = require('fs');

var gtfsParser = {
	_get: _get,
	_getJSON: _getJSON,
	buildTrips: buildTrips,
	buildRoutes: buildRoutes,
	buildStnsModel: buildStnsModel,
	loadResource: loadResource,
	buildSystemGraph: buildSystemGraph,
	buildStopsByTrain: buildStopsByTrain,
	buildAllStationNames: buildAllStationNames,
	buildStationsById: buildStationsById,
	buildAdjacencies: buildAdjacencies
}

function _get(url) {
	return fetch(url);
}

function _getJSON(url) {
	return this._get(url).then(function(response) {
		return response.json();
	});
}

function buildTrips() {
	console.log('build trips');
	var sourceFolder = './assets/gtfs/';
	var targetFolder = './assets/gtfs/';
	var importFile = "stop_times.txt";
	var exportFile = 'trainStops.json';
	var trainStops = {};

	var rl = readline.createInterface({
		input: fs.createReadStream(sourceFolder + importFile)
	});

	var stopModel = {};

	return new Promise(function(resolve, reject) {
		rl.on('line', function(line) {
			var values = line.split(',');
			var tripId = parseInt(values[0]);
			var stopId = parseInt(values[3]);
			var stopSq = parseInt(values[4]);
			var arrivl = values[1];
			var tfHour = arrivl.split(":");
			var hour = parseInt(tfHour[0]);
			var mins = parseInt(tfHour[1]);
			
			if(typeof trainStops[tripId] == 'undefined') trainStops[tripId] = {};
			if(typeof trainStops[tripId][stopSq] == 'undefined') trainStops[tripId][stopSq] = {};

			trainStops[tripId][stopSq] = {stn: stopId, mins: ((hour * 60) + mins)};

			console.log(tripId, stopId, ((hour * 60) + mins));

		}).on('close', function() {
			console.log('finished');
			//write it out for later
			var writable = fs.createWriteStream(targetFolder + exportFile);
			writable.write(JSON.stringify(trainStops, null, '\t'));
			resolve(trainStops);
		});

	});

}

function buildRoutes(allTrips) {
	console.log('build routes');
	const soughtLines = { 90:true, 100:true, 190:true, 200:true, 290:true};
	var sourceFolder = './assets/gtfs/';
	var targetFolder = './assets/gtfs/';
	var importFile = "trips.txt";
	var exportFile = 'routeTrips.json';
	var routeTrips = {};

	var rl = readline.createInterface({
		input: fs.createReadStream(sourceFolder + importFile)
	});

	return new Promise(function(resolve, reject) {
		rl.on('line', function(line) {
			var values = line.split(',');
			var routeId = parseInt(values[0]);
			var tripId = parseInt(values[2]);

			//if this is a route we're looking for, unpack the trips into it
			console.log(routeId, soughtLines[routeId] == true);
			if(soughtLines[routeId] == true) {

				//create the object if one doesn't exist
				if(typeof routeTrips[routeId] == 'undefined') routeTrips[routeId] = {};
				//if(typeof routeTrips[routeId][tripId] == 'undefined') = routeTrips[routeId][tripId] = {};

				//add the values 
				routeTrips[routeId][tripId] = allTrips[tripId];
			}

		}).on('close', function() {
			console.log('finished');
			//write it out for later
			var writable = fs.createWriteStream(targetFolder + exportFile);
			writable.write(JSON.stringify(routeTrips, null, '\t'));
			//return the file
			resolve(routeTrips);
		});
	});
}

function buildStnsModel() {
	console.log('building Statins Model');
	var sourceFolder = './assets/gtfs/';
	var targetFolder = './assets/gtfs/';
	var importFile = "stops.txt";
	var exportFile = 'stopsModel.json';
	var stopsModel = {};

	var rl = readline.createInterface({
		input: fs.createReadStream(sourceFolder + importFile)
	});

	return new Promise(function(resolve, reject) {
		rl.on('line', function(line) {
			//console.log(line);
			var values = line.split(',');
			//console.log(values);
			var stopId = values[0];
			var stopName = values[2];
			var stopDesc = values[3];
			var parentStn = values[9];
			var direction = values[10];

			console.log(stopId, stopName, stopDesc, parentStn, direction);
			stopsModel[stopId] = {
				name: stopName,
				desc: stopDesc,
				parent: parentStn,
				dir: direction
			};

		}).on('close', function() {
			console.log('finished');
			//write it out for later
			var writable = fs.createWriteStream(targetFolder + exportFile);
			writable.write(JSON.stringify(stopsModel, null, '\t'));
			resolve(stopsModel);
		})

	});
}

function loadResource(url, dir) {
	console.log('loading routes');
	var sourceFolder = dir || './assets/gtfs/';
	var routeTrips = require(sourceFolder + url)

	return new Promise(function(resolve, reject) {
		
		resolve(routeTrips);
	});
}

function buildSystemGraph(allRoutes, allStations) {
	var gtfsParser = this;
	var targetFolder = './assets/JSON/';
	var exportFile = 'systemGraph.json';
	var graphObject = {};

	//unpack the object, route by route
	Object.keys(allRoutes).forEach(function(route) {

		//then trip by trip
		Object.keys(allRoutes[route]).forEach(function(trip) {

			//then by sequence number
			Object.keys(allRoutes[route][trip]).forEach(function(sqnNum) {
				var sqnStop = allRoutes[route][trip][sqnNum];
				var station = sqnStop.stn;
				var newStation = {};
				var thisRoute = parseInt(route);
				var thisTrip = parseInt(trip);
				var thisSeqNum = parseInt(sqnNum);

				//notify the user
				console.log(station, thisRoute, thisTrip, thisSeqNum);

				//if we haven't seen this station before create the object and add basics
				//console.log("station exists?: ", typeof graphObject[station] == 'undefined');
				if(typeof graphObject[station] == 'undefined')
					graphObject[station] = {};

				newStation = graphObject[station];

				//add basic elements
				newStation['name'] = allStations[station].name;
				newStation['desc'] = allStations[station].desc;
				newStation['dir'] = allStations[station].dir;


				//identify lines served
				if(typeof newStation['lines'] == 'undefined') newStation['lines'] = {};

				newStation['lines'][thisRoute] = true;
				
				//if this station has a parent add the parent, but also update the parent  model
				//console.log("child has parentStn: ", allStations[station].parent !== "");
				if(allStations[station].parent !== "") {
					//console.log(newStation);
					newStation['parent'] = allStations[station].parent;
					
					var parentStn = allStations[station].parent;
					//console.log("paren station created?:", typeof graphObject[parentStn] == 'undefined', parentStn);
					if(typeof graphObject[parentStn] == 'undefined') {
						graphObject[parentStn] = {};

						//add the name
						graphObject[parentStn]['name'] = allStations[parentStn].name;

						//add this child station
						if(typeof graphObject[parentStn]['childStns'] == 'undefined')
							graphObject[parentStn]['childStns'] = {};

					}

					if(typeof graphObject[parentStn]['childStns'][thisRoute] == 'undefined')
						graphObject[parentStn]['childStns'][thisRoute] = {};

					graphObject[parentStn]['childStns'][thisRoute][station] = true;
					
				}

				//update the trains that serve this station
				//console.log("adding 'trains' object: ", typeof graphObject[station]['trains'] == 'undefined');
				if(typeof newStation['trains'] == 'undefined')
					newStation['trains'] = {};

				if(typeof newStation['trains'][thisRoute] == 'undefined')
					newStation['trains'][thisRoute] = {};

				var time = sqnStop.mins;

				//console.log("time & trip: ", time, trip);
				newStation['trains'][thisRoute][time] = thisTrip;

				//update the connections from this station
				var nextSeqNumber = thisSeqNum + 1;
				if(typeof allRoutes[thisRoute][thisTrip][nextSeqNumber] !== 'undefined') {
					
					//create the connections object if need be
					if(typeof newStation['connections'] == 'undefined')
						newStation['connections'] = {};

					var nextStation = allRoutes[thisRoute][thisTrip][nextSeqNumber].stn
					newStation['connections'][thisRoute] = nextStation;
				}

				
				//update the transfeers from this station
			});

		});

	});

	console.log('writing file');
	//write it out for later
	var writable = fs.createWriteStream(targetFolder + exportFile);
	writable.write(JSON.stringify(graphObject, null, '\t'));
}

function buildStopsByTrain(allTrainStops) {
	console.log('building Stops By Train');
	var targetFolder = './assets/JSON/';
	var exportFile = 'stopsByTrain.json';
	var trainsObject = {};

	//unpack by train first
	Object.keys(allTrainStops).forEach(function(train) {
		var thisTrain = parseInt(train);

		//then by sequence
		Object.keys(allTrainStops[train]).forEach(function(seqNum) {
			var thisStop = allTrainStops[train][seqNum];
			var thisSeqNum = parseInt(seqNum);
			var stationId = thisStop.stn;

			if(typeof trainsObject[thisTrain] == 'undefined')
				trainsObject[thisTrain] = {};

			if(typeof trainsObject[thisTrain][stationId] == 'undefined')
				trainsObject[thisTrain][stationId] = thisSeqNum

		});

	});

	console.log('writing file');
	//write it out for later
	var writable = fs.createWriteStream(targetFolder + exportFile);
	writable.write(JSON.stringify(trainsObject, null, '\t'));
}

function buildAllStationNames(allStops) {
	console.log('building all Station Names');
	var targetFolder = './assets/JSON/';
	var exportFile = 'allStationNames.json';
	var allStations = {};
	var stationsObject = {};

	//add header
	stationsObject['docType'] = 3;
	stationsObject['data'] = [];

	//unpack by station first
	Object.keys(allStops).forEach(function(station) {
		var thisStnName = '';
		var thisStnId = '';

		//if it has a parent station move up to that
		if(typeof allStops[station].parent !== 'undefined')
			thisStnId = allStops[station].parent;	
		else thisStnId = station;
		
		thisStnName = allStops[thisStnId].name;
 		
 		//notify the user
 		console.log(thisStnId, thisStnName);

 		//write the value
		allStations[thisStnId] = thisStnName;

	});

	//after the model is build, add it to the export object
	
	console.log('building write file');
	Object.keys(allStations).forEach(function(id) {
		//build object
		var thisStation = {
			stop_id: id,
			name: allStations[id]
		};

		//console.log(thisStation);
		stationsObject['data'].push(thisStation);
	});

	console.log('writing file');
	//write it out for later
	var writable = fs.createWriteStream(targetFolder + exportFile);
	writable.write(JSON.stringify(stationsObject, null, '\t'));
}

function buildStationsById(allStations) {
	console.log('building Stops By Train');
	var targetFolder = './assets/models/';
	var exportFile = 'stopsById.json';
	var stnsObject = {};

	var allStops = allStations.data;
	//console.log(allStations.data);
	//unpack the array
	allStops.forEach(function(stop) {
		var stpId = stop.stop_id;
		var stpName = stop.name;

		console.log(stop, stpId, stpName);
		stnsObject[stpId] = stpName;
	});

	console.log('writing file');
	//write it out for later
	var writable = fs.createWriteStream(targetFolder + exportFile);
	writable.write(JSON.stringify(stnsObject, null, '\t'));
}

function buildAdjacencies(allStops) {
	console.log('building all Station Names');
	var targetFolder = './assets/models/';
	var exportFile = 'stnAgacencies.json';
	var exportFile2 = 'allStns.json';
	var allStations = {};
	var stationsObject = {};

	//unpack by station first
	Object.keys(allStops).forEach(function(station) {
		var allCons = {};
		var localArray = [];

		//if there are connections find them
		if(typeof allStops[station].connections !== 'undefined') {
			var dirCons = allStops[station].connections;

			//unpack each line
			Object.keys(dirCons).forEach(function(con) {
				var thisStn = dirCons[con];

				allCons[thisStn] = null;
			});
		}

		//if there are parent connections find them
		if(typeof allStops[station].parent !== 'undefined') {
			var prnStn = allStops[station].parent;
			var pntCons = allStops[prnStn].childStns;

			//unpack by line
			Object.keys(pntCons).forEach(function(route) {
				var thisRoute = pntCons[route];

				//then by station
				Object.keys(thisRoute).forEach(function(con) {
					if(con != station) allCons[con] = null;
				});

			});
		}
		
		//make each list of connection an array before passing back
		Object.keys(allCons).forEach(function(stns) {
			localArray.push(stns);
		});

		//if it's a parent station don't write it
		console.log(station.search('landmark'));
		if(station.search('landmark') !== 0) {

			//add the values to the model
			stationsObject[station] = localArray;

			//and add all stations to it's own model
			allStations[station] = null;
		}
	
	});

	console.log('writing file');
	//write it out for later
	var writable = fs.createWriteStream(targetFolder + exportFile);
	writable.write(JSON.stringify(stationsObject, null, '\t'));

	var anotherWritable = fs.createWriteStream(targetFolder + exportFile2);
	anotherWritable.write(JSON.stringify(allStations, null, '\t'));
}

module.exports = gtfsParser;