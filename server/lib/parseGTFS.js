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

/*	THE MODULE TO BE EXPORTED */
module.exports = {

	/*
	*	return something
	*/
	sayHello: function() {
		console.log('hello');
	},
}