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

//define local variables
var timer = { start: new Date().getTime(), end: 0 };
var routesToTrack = [90, 100, 190, 200, 290];//require(path.join(__dirname, 'config_train_lines'));
var allTrainLines = {};

//define sources
var routesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/routes.txt'));
var stop_timesSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/stop_times.txt'));
var stopsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/stops.txt'));
var tripsSource = fs.createReadStream(path.join(__dirname, '../assets/downloads/gtfs/trips.txt'));

//define target files
var Red_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/90_Red_Line.JSON'));
var Blue_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/100_Blue_Line.JSON'));
var Yellow_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/190_Yellow_Line.JSON'));
var Green_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/200_Green_Line.JSON'));
var Orange_LineJSON = fs.createWriteStream(path.join(__dirname, '../assets/JSON/290_Orange_Line.JSON'));

//define streams
var rl_routes = readline.createInterface({ input: routesSource });
var rl_stop_times = readline.createInterface({ input: stop_timesSource });

/*	THE MODULE TO BE EXPORTED */
module.exports = {

	/*
	*	return a JSON object with all the stop_times information in a model
	*/
	stop_times: function() {
		//declare local variables
		var lineCounter = 0;
		var allSystemStops = {};
		var aTrip;
		var aTripStop;
		var trip = { old: 0, new: 0, isANewTrip: false, checkNewTrip: function() { if(this.old !== this.new) this.isANewTrip = true; else this.isANewTrip = false; } };

		var stop_timesPromise = new Promise(function(resolve, reject) {

			//read through file
			rl_stop_times.on('line', function(line) {
				
				//

				//parse through the csv file
				csv.parse(line, {delimiter: ','}, function(err, output) {

					//check the line number
					if(lineCounter > 0) {

						//define the local variables
						if(line != '') {
							aTripStop = require(path.join(__dirname, 'models/atripstop.js'));
							var thisTripId = output[0][0];
							var thisDeparture = output[0][2];
							var thisStopID = output[0][3];
							var thisSequenceID = output[0][4];
							var thisHeadsign = output[0][5];
							//var thisRoute = trip_on_route[thisTripId];
							//var thisDirection = trip_has_direction[thisTripId];
							//var thisStopSequence = output[0][4];
							//var stationNumber = allLines[thisRoute][thisDirection].stations.length;
						}

						//check the new trip number
						trip.new = thisTripId;
						trip.checkNewTrip();

						//log the results
						console.log(
							Math.floor((lineCounter / 1604478) * 100) + '%' +
							' trip: ' + thisTripId +
							' departure: ' + thisDeparture +
							' stopID: ' + thisStopID +
							' headsign: ' + thisHeadsign +
							' sequenceID: ' + thisSequenceID  
						);

						//save the stop details from this file
						aTripStop.stop_id = thisStopID;
						aTripStop.departure_time = thisDeparture;

						//if this is a new trip initialize the model
						if(trip.isANewTrip) aTrip = require(path.join(__dirname, 'models/atrip.js'));

						//add this stop to its respective trip
						aTrip.stop_headsign = thisHeadsign;
						aTrip.stop_sequence[thisSequenceID] = aTripStop;

						//set the old trip number to the new trip number
						trip.old = trip.new;
					}

					//incriment the counter
					lineCounter++;

				});

			});

			//when finished with the file close the stream and return results
			rl_stop_times.on('close', function() {
				rl_routes.close();
				resolve(allSystemStops);
			});
			
		});

		return stop_timesPromise
		.then(function(allSystemStops) { return allSystemStops; })
		.catch(function(eror) { return error; });
	},
}