//used to trip planner
var TripPlanner = function() {
	this.departure = {
		id: 0,
		name: '',
		time: 0
	};
	this.arrival = {
		id: 0,
		name: '',
		time: 0
	};
	this.allTripOptions = {};
}

//SETTERS
TripPlanner.prototype._setId = function(endpoint, id) { this[endpoint].id = id; };
TripPlanner.prototype._setName = function(endpoint, name) { this[endpoint].name = name; };
TripPlanner.prototype._setTime = function(endpoint, time) { this[endpoint].time = time; };

//GETTERS
TripPlanner.prototype._getId = function(endpoint) { return this[endpoint].id; };
TripPlanner.prototype._getName = function(endpoint) { return this[endpoint].name; };
TripPlanner.prototype._getTime = function(endpoint) { return this[endpoint].time; };

//
TripPlanner.prototype.buildTripOtpions = function() {
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

//EXTERNAL METHODS
TripPlanner.prototype.calculateTrip = function(start, end) {
	
	//assign the passed in variables for calulation
	this._setId('departure', start);
	this._setId('arrival', end);

	//build the trip options
	this.buildTripOtpions();
	
	//return the findings
	return this.allTripOptions;
};

module.exports = TripPlanner;