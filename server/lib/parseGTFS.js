/*	PARESGTFS.JS
*	Accesses the following csv files to export JSON
*		1. assets/downloads/gtfs/routes.txt 			may not even need routes
*		2. assets/downloads/gtfs/stop_times.txt
*		3. assets/downloads/gtfs/stops.txt
*		4. assets/downloads/gtfs/trips.txt
* 	and it returns the following files:
*		1. 90_Red_Line.JSON
*		2. 100_Blue_Line.JSON
*		3. 190_Yellow_Line.JSON
*		4. 200_Green_Line.JSON
*		5. 290_Orange_Line.JSON
*		6. Train_System_Graph.JSON
*		7. TEMP_All_Trips.JSON
*/

var csv = require('csv');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

var Trip = require(path.join(__dirname, 'models/atrip.js'));
var TripStop = require(path.join(__dirname, 'models/atripstop.js'));

//define local variables
var timer = { start: 0, end: 0 };
var routesToTrack = [90, 100, 190, 200, 290];//require(path.join(__dirname, 'config_train_lines'));
var tripCollection = {};
var importantStops = {};

//define sources
var routesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/routes.txt'));

//define streams
var rl_routes = readline.createInterface({ input: routesSource });

//private functions
function dateTimeToUnixTime(dateTime) {
	return Date.parse(dateTime);
}

function startTimer() {
	var aNewTime = new Date();
	timer.start = aNewTime.getTime();
}

function stopTimer() {
	var aNewTime = new Date();
	timer.end = aNewTime.getTime();
}

function readTimer() {
	return ((timer.end - timer.start) / 1000);
}

/*	THE MODULE TO BE EXPORTED */
module.exports = {

	/*	STOP_TIMES Function
	*	return a JSON object with all the stop_times information in a model
	*/
	stop_times: function() {
		//TODO: add station_type 0=child 1=parent checking to the model
		//TODO: add a parent station list when parsing
		
		//declare local variables
		var lineCounter = 0;
		//var aTripStop;
		//var aTrip = require(path.join(__dirname, 'models/atrip.js'));
		aTripStop = new TripStop();
		aTrip = new Trip();

		tripCollection = {};

		var trip = { old: 0, new: 0, isANewTrip: false, checkNewTrip: function() { if(this.old !== this.new) this.isANewTrip = true; else this.isANewTrip = false; } };

		//define sources
		var stop_timesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/stop_times.txt'));

		//define target files
		var TEMP_stopTimes = fs.createWriteStream(path.join(__dirname, '../assets/tests/stopTimesModel.json'));
		var TEMP_writeLog = fs.createWriteStream(path.join(__dirname, '../assets/tests/writeLog.json'));

		//define streams
		var rl_stop_times = readline.createInterface({ input: stop_timesSource });

		startTimer();

		//if the trip collection is empty, create a new one
		if(typeof tripCollection === 'undefined') tripCollection = {};

		return stop_timesPromise = new Promise(function(resolve, reject) {
			
			var stopsOnLine = 0;

			//read through file
			rl_stop_times.on('line', function(line) {

				//parse through the csv file
				csv.parse(line, {delimiter: ','}, function(err, output) {

					//does the line have data?
					if(typeof parseInt(output[0][0]) === 'number') {
						
						//as long as this isn't the first line
						if(lineCounter > 1) {

							//check the new trip number
							trip.new = output[0][0];
							trip.checkNewTrip();

							//if this line is a new trip... 
							if(trip.new !== trip.old) {
								//save the old trip to the colleciton... 
								var currentTrip = aTrip._getTripId();
								tripCollection[currentTrip] = aTrip;

								TEMP_writeLog.write(' Tripid: ' + aTrip._getTripId() + 
										' stop_headsign: ' + aTrip.stop_headsign + 
										' direction_id: ' + aTrip.direction_id + 
										' route_id: ' + aTrip.route_id + 
										' received_data: ' + aTrip.received_data + 
										' stops on line: ' + stopsOnLine +
										'\n');

								//and start building a new trip
								aTrip = new Trip();

								stopsOnLine = 0;
							}

						}

						//build a tripStop from the current line data
						aTripStop = new TripStop();
						var thisTripId = output[0][0];
						var thisDeparture = output[0][2];
						var thisStopID = output[0][3];
						var thisSequenceID = output[0][4];
						var thisHeadsign = output[0][5];

						//log the results
						console.log(
							Math.floor((lineCounter / 1604478) * 100) + '%' +	//   // 169311 //451615
							' trip: ' + thisTripId +
							' departure: ' + thisDeparture +
							' stopID: ' + thisStopID +
							' headsign: ' + thisHeadsign +
							' sequenceID: ' + thisSequenceID  
						);

						//save the stop details from this file
						aTripStop._setAll(thisTripId, thisDeparture, thisStopID, thisSequenceID, thisHeadsign);

						//add the stop to a trip
						aTrip._setNewStop(aTripStop);
						stopsOnLine++;

						//set the old trip number to the new trip number
						trip.old = output[0][0];
						
					}
					
					//incriment the counter
					lineCounter++;
			
				});

			});

			//when finished with the file close the stream and return results
			rl_stop_times.on('close', function() {
				//save the object
				var currentTripId = aTrip._getTripId();
				tripCollection[currentTripId] = aTrip;

				//stop the timer and read the result
				stopTimer();
				console.log('Trips took ' + readTimer() + ' seconds ('+ timer.end + ' ' + timer.start + ')');

				//write the model
				//TEMP_stopTimes.write(JSON.stringify(tripCollection,'','\t'));

				//close the stream
				rl_routes.close();

				//return the results
				resolve(tripCollection);
			});
			
		})

	},

	/*	TRIPS Function
	*	TODO: ADD AN EXPLAINATION HERE
	*/
	trips: function() {
		
		//declare local variables
		var lineCounter = 0;
		var aTrip;
		var errorLog = [];
		var readLog = {};

		//define sources
		var tripsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/trips.txt'));

		//define target files
		var TEMP_trips = fs.createWriteStream(path.join(__dirname, '../assets/tests/tripsModel.json'));
		var TEMP_errors = fs.createWriteStream(path.join(__dirname, '../assets/tests/errors.json'));
		var TEMP_log = fs.createWriteStream(path.join(__dirname, '../assets/tests/tripsLog.json'));
		var TEMP_importantStops = fs.createWriteStream(path.join(__dirname, '../assets/tests/importantStops.json'));
		//TEMP_log.write('testing testing\n');
		//TEMP_log.write(JSON.stringify(tripCollection,'','\t'));

		//define streams
		var rl_trips = readline.createInterface({ input: tripsSource });

		startTimer();

		return tripsPromise = new Promise(function(resolve, reject) {
			
			rl_trips.on('line', function(line) {
				
				//parse through the csv file
				csv.parse(line, {delimiter: ','}, function(err, output) {
					
					//does the line have data?
					if(typeof parseInt(output[0][0]) === 'number') {

						//if so, load the variables we want to track
						var trackThisRoute = false;
						var thisRouteId = output[0][0];
						var thisTripId = output[0][2];
						var thisDirection = output[0][3];

						//log the results 
						console.log(
							Math.floor((lineCounter / 27370) * 100) + '%' +
							' routeId: ' + thisRouteId +
							' tripId: ' + thisTripId +
							' direction: ' + thisDirection 
						);

						//Save for later analysis
						readLog[lineCounter] = {
							'percentage': Math.floor((lineCounter / 27370) * 100),
							'routeId': thisRouteId,
							'tripId': thisTripId,
							'direction': thisDirection,
						}

						//check if the referenced trip is in the model
						if(typeof tripCollection[thisTripId] !== 'undefined') {

							//if it is in the model is it one of the trips we want to track?
							for(var i = 0; i < 5; i++) { 
								if(thisRouteId == routesToTrack[i]) trackThisRoute = true;
							}
							
							//write the results of the search
							TEMP_errors.write(' routeId: ' + thisRouteId + 
										' tripId: ' + thisTripId + 
										' direction: ' + thisDirection + 
										' trackThisRoute: ' + trackThisRoute + 
										'\n');


							//if it is
							if(trackThisRoute) {
								
								//add the values we've found
								tripCollection[thisTripId].route_id = thisRouteId;
								tripCollection[thisTripId].direction_id = thisDirection;

								//save the stop id as a hash for later
								Object.keys(tripCollection[thisTripId].stop_sequence).forEach(function(stop) {
									//run through all the stops on this route and save them for later
									var neededStopId = tripCollection[thisTripId].stop_sequence[stop].stop_id;
									importantStops[neededStopId] = true;
								});
								

							} else {
								
								//if not delete the object entirely
								delete tripCollection[thisTripId];

							}

						}

					}

					//incriment the counter
					lineCounter++;

				});

			});

			rl_trips.on('close', function() {
				//stop the timer and read the result
				stopTimer();
				console.log('Trips took ' + readTimer() + ' seconds ('+ timer.end + ' ' + timer.start + ')');

				//write the model
				TEMP_trips.write(JSON.stringify(tripCollection,'','\t'));
				TEMP_importantStops.write(JSON.stringify(importantStops,'','\t'));
				
				TEMP_log.write(JSON.stringify(readLog,'','\t'));

				//close the stream
				rl_trips.close();

				//check the error log
				if(errorLog.length > 0) reject(errorLog);

				//return the results
				resolve();
			});

		})

	},

	/*	STOPS Function
	*	TODO: ADD AN EXPLAINATION HERE
	*/
	stops: function() {

		//REMOVE THIS LATER
		var contents = fs.readFileSync(path.join(__dirname, '../assets/tests/tripsModel.json'));
		tripCollection = JSON.parse(contents);
		//AND REMOVE THIS
		var contents2 = fs.readFileSync(path.join(__dirname, '../assets/tests/importantStops.json'));
		importantStops = JSON.parse(contents2);

		//declare local variables
		var lineCounter = 0;
		var ParentStation = require(path.join(__dirname, 'models/aparentStation.js')); 
		var parentStations = {};

		//define sources
		var stopsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/stops.txt'));

		//define target files
		var TEMP_stops = fs.createWriteStream(path.join(__dirname, '../assets/tests/stopsModel.json'));
		var TEMP_stops_Log = fs.createWriteStream(path.join(__dirname, '../assets/tests/stops_Log.json'));
		var TEMP_parentStations = fs.createWriteStream(path.join(__dirname, '../assets/tests/parentStations.json'));

		//define streams
		var rl_stops = readline.createInterface({ input: stopsSource });

		startTimer();

		return tripsPromise = new Promise(function(resolve, reject) {
			
			rl_stops.on('line', function(line) {

				//parse through the csv file
				csv.parse(line, {delimiter: ','}, function(err, output) {
					
					//does the line have data?
					if(typeof parseInt(output[0][0]) === 'number') {

						//test for parent station
						if(typeof parentStations[output[0][0]] !== 'undefined') isAParentStation = true;
						else isAParentStation = false;

						//is this a stop we care about?
						if(importantStops[output[0][0]] || isAParentStation) {

							//if so define the variables we're looking for
							var thisStopId = output[0][0];			
							var thisStopName = output[0][2];		//stop_name
							var thisStopDesc = output[0][3];		//stop_desc
							var thisLocationType = output[0][8];
							var thisParentStation = output[0][9];	//parent_station
							var thisDirection = output[0][10];		//direction

							//log the results 
							console.log(
								Math.floor((lineCounter / 6972) * 100) + '%' +
								' thisStopId: ' + thisStopId +
								' thisStopName: ' + thisStopName +
								' thisStopDesc: ' + thisStopDesc +
								' thisLocationType: ' + thisLocationType +
								' thisParentStation: ' + thisParentStation +
								' thisDirection: ' + thisDirection
							);

							//Save for later analysis
							TEMP_stops_Log.write(' percentage: ' + Math.floor((lineCounter / 6972) * 100) + 
										' thisStopId: ' + thisStopId +
										' thisStopName: ' + thisStopName +
										' thisStopDesc: ' + thisStopDesc +
										' thisLocationType: ' + thisLocationType +
										' thisParentStation: ' + thisParentStation +
										' thisDirection: ' + thisDirection +
										'\n');
							
							//turn the value into an object
							importantStops[thisStopId] = {};

							//add the station specific details
							if(thisLocationType == 0) {			//this is a child station record
								//if this is a child station...
								//add the station information to the importantStops model
								importantStops[thisStopId]['stop_name'] = thisStopName;
								importantStops[thisStopId]['stop_desc'] = thisStopDesc;
								importantStops[thisStopId]['direction'] = thisDirection;

								if(thisParentStation !== '') {
									
									//check if the parent station has already been created
									if(typeof importantStops[thisStopId]['parent_station'] == 'undefined') {

										//define a new variable
										importantStops[thisStopId]['parent_station'] = new ParentStation;

										//add the station name
										importantStops[thisStopId]['parent_station'].setStopId(thisParentStation);

										//track all parent stations to update later
										parentStations[thisParentStation] = importantStops[thisStopId]['parent_station'];
										
									}

									//add this stop to the list of stations served by this parent
									importantStops[thisStopId]['parent_station'].addChildStation(thisStopId);

								}

							} else if(thisLocationType == 1) {	//this is a parent station record
								console.log(thisStopName);
								//if this is a parent station...
								parentStations[thisStopId].setStopName(thisStopName);
							}

						}

					}

					//incriment the counter
					lineCounter++;

				});
			
			});

			rl_stops.on('close', function() {
				
				//after all the important stations have been identified...
				//run through the model and update station information for all records
				Object.keys(tripCollection).forEach(function(trip) {

					Object.keys(tripCollection[trip].stop_sequence).forEach(function(stop) {
						//the current stop
						var stopId = tripCollection[trip].stop_sequence[stop].stop_id;

						tripCollection[trip].stop_sequence[stop].stop_name = importantStops[stopId].stop_name;
						tripCollection[trip].stop_sequence[stop].stop_desc = importantStops[stopId].stop_desc;
						tripCollection[trip].stop_sequence[stop].direction = importantStops[stopId].direction;
						tripCollection[trip].stop_sequence[stop].parent_station = importantStops[stopId].parent_station;

						if(typeof importantStops[stopId].parent_station !=='undefined' && importantStops[stopId].parent_station !== '') {
							
							//get the parent station id
							var parentStationId = importantStops[stopId].parent_station.stop_id;
							//if it exists add the parent station name
							if(typeof parentStations[parentStationId] !== 'undefined') {
								tripCollection[trip].stop_sequence[stop].parent_station.stop_name = parentStations[parentStationId].stop_name;
							}
							
						}

					});

				});

				//stop the timer and read the result
				stopTimer();
				console.log('Trips took ' + readTimer() + ' seconds ('+ timer.end + ' ' + timer.start + ')');

				//write the model
				TEMP_stops.write(JSON.stringify(tripCollection,'','\t'));
				TEMP_parentStations.write(JSON.stringify(parentStations,'','\t'));
				//close the stream
				rl_stops.close();

				//return the results
				resolve();
			});

		});

	},

	/*	BUILD LINE FILES Function
	*	From the trips collection, build each of the respective line files
	*	1. 90_Red_Line.JSON
	*	2. 100_Blue_Line.JSON
	*	3. 190_Yellow_Line.JSON
	*	4. 200_Green_Line.JSON
	*	5. 290_Orange_Line.JSON
	*/
	exportLineFiles: function() {

		//declare local variables
		var trainlines = {};
		var TrainLine = require(path.join(__dirname, 'models/atrainline.js'));

		//define target files
		var Red_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/90_Red_Line.json'));
		var Blue_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/100_Blue_Line.json'));
		var Yellow_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/190_Yellow_Line.json'));
		var Green_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/200_Green_Line.json'));
		var Orange_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/290_Orange_Line.json'));
		var TEMP_line_Log = fs.createWriteStream(path.join(__dirname, '../assets/tests/line_log.json'));

		//start the timer
		startTimer();

		//build the trains model
		routesToTrack.forEach(function(short_name) {
			trainlines[short_name] = new TrainLine;
		});

		//run through the objects, adding all trips to each line
		Object.keys(tripCollection).forEach(function(trip) {

			//add this trip the the appropriate line and service direction
			var thisLine = tripCollection[trip].route_id;
			var serviceDirection = tripCollection[trip].direction_id;
			var thisTripId = tripCollection[trip].trip_id;

			//update the model
			trainlines[thisLine].addNewTrip(thisLine, tripCollection[trip]);

		});
		
		//then build the station sequence from the longest line
		Object.keys(trainlines).forEach(function(line) {

			var lngstOnLine = trainlines[line].getLongestTripId();
			
			trainlines[line].buildStationSequence( { 0: tripCollection[lngstOnLine[0]].stop_sequence, 1: tripCollection[lngstOnLine[1]].stop_sequence } );

		});

		//from the station sequence build a timetable
		Object.keys(trainlines).forEach(function(line) {

			trainlines[line].buildTimeTables(tripCollection);
			
		});
			

			//loop through the stops on this trip
			/*Object.keys(tripCollection[trip].stop_sequence).forEach(function(stop) {

				//pull out the important variables
				var thisStopId = tripCollection[trip].stop_sequence[stop].stop_id;
				var thisDirection = tripCollection[trip].stop_sequence[stop].direction;
				var thisHeadsign = tripCollection[trip].stop_sequence[stop].stop_headsign;
				var thisTrainTime = tripCollection[trip].stop_sequence[stop].departure_time;

				//and build the station object
				var thisStation = { id: null, name: '', desc: '', seqId: stop };

				
				//if the station has a parent use the parent station info
				if(typeof tripCollection[trip].stop_sequence[stop].parent_station !== 'undefined') {

					thisStation.id = tripCollection[trip].stop_sequence[stop].parent_station.stop_id;
					thisStation.name = tripCollection[trip].stop_sequence[stop].parent_station.stop_name;

				} else {	//if there is no parent station use the station info itself

					thisStation.id = tripCollection[trip].stop_sequence[stop].stop_id;
					thisStation.name = tripCollection[trip].stop_sequence[stop].stop_name;
				}
				
				thisStation.desc = tripCollection[trip].stop_sequence[stop].stop_desc;


				//add the the values to the model
				if(trainlines[thisLine].service[serviceDirection].headsign == '') {
					trainlines[thisLine].service[serviceDirection].headsign = thisHeadsign;
				}
				
				if(trainlines[thisLine].service[serviceDirection].direction == '') {
					trainlines[thisLine].service[serviceDirection].direction = thisDirection;
				}
				
				trainlines[thisLine].addAStation(serviceDirection, thisStation);
				trainlines[thisLine].addADepartureTime(serviceDirection, thisTripId, thisStopId, thisTrainTime);

				//monitor the findings
				console.log(
								' thisLine: ' + thisLine +
								' serviceDirection: ' + serviceDirection +
								' thisTripId: ' + thisTripId +
								' thisStopId: ' + thisStopId +
								' thisDirection: ' + thisDirection +
								' thisHeadsign: ' + thisHeadsign +
								' thisTrainTime: ' + thisTrainTime +
								' thisStationId: ' + thisStation.id +
								' thisStationName: ' + thisStation.name +
								' thisStationDesc: ' + thisStation.desc
							);
				
				//output for later evaluation
				TEMP_line_Log.write(' thisLine: ' + thisLine +
									' serviceDirection: ' + serviceDirection +
									' thisTripId: ' + thisTripId +
									' thisStopId: ' + thisStopId +
									' thisDirection: ' + thisDirection +
									' thisHeadsign: ' + thisHeadsign +
									' thisTrainTime: ' + thisTrainTime +
									' thisStationId: ' + thisStation.id +
									' thisStationName: ' + thisStation.name +
									' thisStationDesc: ' + thisStation.desc +
									'\n');

			});

		});*/



		//write out the files
		Red_LineJSON.write(JSON.stringify(trainlines[90],'','\t'));
		Blue_LineJSON.write(JSON.stringify(trainlines[100],'','\t'));
		Yellow_LineJSON.write(JSON.stringify(trainlines[190],'','\t'));
		Green_LineJSON.write(JSON.stringify(trainlines[200],'','\t'));
		Orange_LineJSON.write(JSON.stringify(trainlines[290],'','\t'));

		//finish the timer
		stopTimer();
	}

}
