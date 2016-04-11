/* 	BUILD.JS
*	This module uses pre-downloaded GTFS .csv files to build:
*		1. train schedule JSON files for each train line
*		2. a system map containing the connections of all the train lines
*
*	it takes severel inputs:
*		1. assets/downloads/gtfs/routes.txt
*		2. assets/downloads/gtfs/stop_times.txt
*		3. assets/downloads/gtfs/stops.txt
*		4. assets/downloads/gtfs/trips.txt
*	
*	and it returns the following files:
*		1. 90_Red_Line.JSON
*		2. 100_Blue_Line.JSON
*		3. 190_Yellow_Line.JSON
*		4. 200_Green_Line.JSON
*		5. 290_Orange_Line.JSON
*		6. Train_System_Graph.JSON
*		7. TEMP_All_Trips.JSON
*/

//LOAD DEPENDENCIES
var parse = require('../lib/parseGTFS');


//PARSE RAW MODELS & BUILD 
//first build a model from the systems stops file
//parse.stop_times()
//.then(function(returnedCollection) { 
	
	//then go into trips
	//parse.trips()
	//.then(function(returnedCollection) { 
		
		//then go into stops
		parse.stops()
		.then(function(returnedCollection) {

			//into here
			parse.exportLineFiles();
			
		})
		.catch(function(error) { throw new Error(error); });

	//})
	//.catch(function(error) { throw new Error(error); });
	
//})
//.catch(function(error) { throw new Error(error); });

//BUILD REQUIRED MOEDELS

//EXPORT MODELS