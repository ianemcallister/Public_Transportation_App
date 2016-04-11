//used to build trainline JSON file
var TrainLine = function() {
	//this.route_long_name = '';		//from routes.txt
	//this.agency_id = '';			//from routes.txt
	this.route_id = null;			//from routes.txt
	this.service = {
		0: {
			headsign: '',			//from aTrip.js
			direction: '',			//from aTrip.js
			stations: {},			//from aTrip.js example: stopNumber: { stop_name: THE_NAME, stop_desc: THE_DESCRIPTION }
			trainTimes: {}			//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
		},
		1: {
			headsign: '',			//from aTrip.js
			direction: '',			//from aTrip.js
			stations: {},			//from aTrip.js example: stopNumber: { stop_name: THE_NAME, stop_desc: THE_DESCRIPTION }
			trainTimes: {}			//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
		}
	};
}


TrainLine.prototype.addRouteName = function(newRouteName) {
	this.route_long_name = newRouteName;
};

TrainLine.prototype.addAgencyId = function(newAgencyId) {
	this.agency_id = newAgencyId;
};

TrainLine.prototype.addRouteId = function(newRouteId) {
	this.route_id = newRouteId;
};


TrainLine.prototype.addAStation = function(direction, newStation) {
	var stopId = newStation.id;
	if(typeof this.service[direction].stations[stopId] == 'undefined') {
		this.service[direction].stations[stopId] = { name: '', desc: '' };
	}
	this.service[direction].stations[stopId].name = newStation.name;
	this.service[direction].stations[stopId].desc = newStation.desc;
};

TrainLine.prototype.addADepartureTime = function(direction, tripId, stopId, departureTime) {
	if(typeof this.service[direction].trainTimes[tripId] == 'undefined') {
		this.service[direction].trainTimes[tripId] = {};
	}
	this.service[direction].trainTimes[tripId][stopId] = departureTime;
};

TrainLine.prototype.addNewTrip = function(aNewTrip) {
	//declare local variables
	var serviceDirection = aNewTrip.direction_id;
	var thisTripId = aNewTrip.trip_id;

	console.log(aNewTrip);

	this.service[serviceDirection].headsign = aNewTrip.stop_headsign;
	this.service[serviceDirection].direction = aNewTrip.getDirectionString();
	this.service[serviceDirection].stations = aNewTrip.getAllStations();
	this.service[serviceDirection].trainTimes[thisTripId] = aNewTrip.getAllTripTimes();
};

module.exports = TrainLine;