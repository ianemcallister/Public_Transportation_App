//
var TripStation = require('./tripStation');

var Trip = function() {
	this.endpoint = {
		arrival: {
			station: new TripStation,
			time: 0
		},
		departure: {
			station: new TripStation,
			time: 0
		}
	};
	this.segment = {};
	this.summary = {
		duration: 0,
		noOfStops: 0,
		start: '',
		finish: ''
	};
}

Trip.prototype.getEndpointAttribute = function(endpoint, attribute) {
	return this.endpoint[endpoint].station[attribute];
};

Trip.prototype.getEndpointStation = function(endpoint) {
	return this.endpoint[endpoint].station;
};

Trip.prototype.setSummaryAttribute = function(attribute, value) {
	this.summary[attribute] = value;
};

Trip.prototype.setEndpointStation = function(endpoint, station) {
	this.endpoint[endpoint].station.setStation(station);
};

Trip.prototype.setEndpointTime = function(endpoint, unixTime) { 
	this.endpoint[endpoint].time = unixTime;
};

Trip.prototype.addSegments = function(tripSteps) {

};

Trip.prototype.writeSummary = function() {
	//set the start & finish
	this.setSummaryAttribute('start', this.getEndpointAttribute('departure', 'name'));
	this.setSummaryAttribute('finish', this.getEndpointAttribute('arrival', 'name'));

	//set the duration

	//set the noOfStops
};

module.exports = Trip;