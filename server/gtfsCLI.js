
var gtfsParser = require('./gtfsParser');

//build the trips model from scratch
/*
gtfsParser.buildTrips().then(function(response) {

	gtfsParser.buildRoutes(response);

});*/

//build the stations JSON model
//gtfsParser.buildStnsModel();

//build system graph
gtfsParser.loadResource('routeTrips.json').then(function(response) {
	var routes = response;

	//load stations
	gtfsParser.loadResource('stopsModel.json').then(function(response) {
		var stations = response;
		
		//once we have the models pass them to the system graph builder
		gtfsParser.buildSystemGraph(routes, stations);

	});
	
});
