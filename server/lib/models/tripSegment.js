//
var TripSegment = function() {
	this.type = { ride: false, transfeer: false };
	this.line = {};
	this.transfeerTo = {};
	this.noOfStops = 0;
	this.duration = 0;
	this.endpoints = {
		board: new TripStation,
		disembark: new TripStation
	};
}

module.exports = TripSegment;