/*	PARESGTFS.JS
*	Accesses the following csv files to export JSON
*		1. assets/downloads/gtfs/routes.txt
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

//define sources
var routesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/routes.txt'));
var stopsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/stops.txt'));

//define target files
var Red_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/90_Red_Line.json'));
var Blue_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/100_Blue_Line.json'));
var Yellow_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/190_Yellow_Line.json'));
var Green_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/200_Green_Line.json'));
var Orange_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/290_Orange_Line.json'));

//define streams
var rl_routes = readline.createInterface({ input: routesSource });
var rl_stops = readline.createInterface({ input: stopsSource });

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
		var stop_timesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/Shorter_stop_times.txt'));

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
										//' stop_sequence1: ' + aTrip.stop_sequence['1'].trip_id +
										//' stop_sequence2: ' + aTrip.stop_sequence['2'].trip_id +
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
							Math.floor((lineCounter / 451615) * 100) + '%' +	//  1604478 // 169311
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
	*	return a JSON object with all the trips information added to the model
	*/
	trips: function() {
		
		//declare local variables
		var lineCounter = 0;
		var trackThisRoute = false;
		var aTrip;
		var errorLog = [];
		var readLog = {};

		//define sources
		var tripsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/trips.txt'));

		//define target files
		var TEMP_trips = fs.createWriteStream(path.join(__dirname, '../assets/tests/tripsModel.json'));
		var TEMP_errors = fs.createWriteStream(path.join(__dirname, '../assets/tests/errors.json'));
		var TEMP_log = fs.createWriteStream(path.join(__dirname, '../assets/tests/tripsLog.json'));

		//define streams
		var rl_trips = readline.createInterface({ input: tripsSource });

		startTimer();

		//if the trip collection is empty, create a new one
		//if(typeof tripCollection === 'undefined') tripCollection = {};

		return tripsPromise = new Promise(function(resolve, reject) {
			
			rl_trips.on('line', function(line) {
				
				//parse through the csv file
				csv.parse(line, {delimiter: ','}, function(err, output) {
					
					//does the line have data?
					if(typeof parseInt(output[0][0]) === 'number') {

						//if so, load the variables we want to track
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
							for(var i = 0; i < routesToTrack.length; i++) { 
								if(thisRouteId == routesToTrack[i]) trackThisRoute = true;
								else trackThisRoute = false;
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
				TEMP_log.write(JSON.stringify(readLog,'','\t'));

				//close the stream
				rl_trips.close();

				//check the error log
				if(errorLog.length > 0) reject(errorLog);

				//return the results
				resolve();
			});

		})

	}

}