//used to trip planner
var TripStation = require('./tripStation');
var TripSegment = require('./tripSegment');
var Trip = require('./routeTrip');
var JourneyCalculator = require('../../scripts/calculateJourney');

var TripPlanner = function() {
	//declare the local variables
	this.template = new Trip;
	this.allTripOptions = {};
}

//SETTERS
TripPlanner.prototype._setTemplateEndpointStation = function(endpoint, id) {
	this.template.endpoint[endpoint].station.setId(id);
};

TripPlanner.prototype._setTemplateEndpointTime = function(endpoint, unixTime) { 
	this.template.endpoint[endpoint].time = unixTime;
};

//GETTERS
TripPlanner.prototype.getBookendStations = function() {
	return { 	start: this.template.getEndpointStation('departure'), 
				end: this.template.getEndpointStation('arrival') };
};

//BUILD METHODS
TripPlanner.prototype._addATripSummary = function(aStation) {

};

TripPlanner.prototype._addATripDepartureStation = function(aStation) {

};

TripPlanner.prototype._addATripArrivalStation = function(aStation) {

};

TripPlanner.prototype._addASegment = function(aStation) {

};

TripPlanner.prototype._addATrip = function(aNewTrip) {
	//declare the local variable
	var i = 0;

	//count the number of keys
	Object.keys(this.allTripOptions).forEach(function(trip) { i++; });

	//add the new trip
	this.allTripOptions[i] = aNewTrip;
};

TripPlanner.prototype._getAllTrips = function(aStation) { return this.allTripOptions; };

TripPlanner.prototype._buildTripOtpions = function() {
	//declare local variables
	this.allTripOptions = {
		0: {
			stops: [
				{ id: this._getId('departure'), name: this._getName('departure') },
				{ id: this._getId('arrival'), name: this._getName('arrival') }
			]
		}
	};

}

TripPlanner.prototype._findFewestStops = function() {
	//define a new trip
	var fewestStopsTrip = new Trip;
	var bookendStations = this.getBookendStations();

	//define bookends
	fewestStopsTrip.setEndpointStation('departure', bookendStations.start );
	fewestStopsTrip.setEndpointStation('arrival', bookendStations.end );

	//construct the trip
	fewestStopsTrip.addSegments(
		JourneyCalculator.findFewestStops(47821, 8372)/*[
		 This is will be an object returned from a function
		{
			type: { ride: false, transfeer: false },
			line: {},
			transfeerTo: {},
			noOfStops: 0,
			duration: 0,
			endpoints: { board: {}, disembark: {} }
		},
		{
			type: { ride: false, transfeer: false },
			line: {},
			transfeerTo: {},
			noOfStops: 0,
			duration: 0,
			endpoints: { board: {}, disembark: {} }
		}
	]*/);

	//build the summary
	fewestStopsTrip.writeSummary();

	//add the new trip to the list of trips
	this._addATrip(fewestStopsTrip);
};

TripPlanner.prototype._findShortestTime = function() {}
TripPlanner.prototype._findFewestTransfeeres = function() {}

//EXTERNAL METHODS
TripPlanner.prototype.calculateTrip = function(start, end) {
	console.log('got here');

	//designate the departure and arrival stations
	this._setTemplateEndpointStation('departure', start);
	this._setTemplateEndpointStation('arrival', end);

	//check for the route with the fewestStops
	this._findFewestStops();

	//check for the route with the shortestTime
	this._findShortestTime();

	//check for the route with the fewestTransfeers
	this._findFewestTransfeeres();

	
	//return all the route options to the user
	return this._getAllTrips();
};

TripPlanner.prototype.message = function() { console.log('testing'); }

module.exports = TripPlanner;