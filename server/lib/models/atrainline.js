//used to build trainline JSON file
module.exports = {
	route_long_name: '',	//from routes.txt
	agency_id: '',			//from routes.txt
	route_id: null,			//from routes.txt
	service: {				//
		0: {
			headsign: '',	//from aTrip.js
			direction: '',	//from aTrip.js
			stations: {},	//from aTrip.js example: { stopNumber: { stop_name: THE_NAME, stop_desc: THE_DESCRIPTION }}
			trainTimes: {}	//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
		},
		1: {
			headsign: '',	//from aTrip.js
			direction: '',	//from aTrip.js
			stations: {},	//from aTrip.js example: { stopNumber: { stop_name: THE_NAME, stop_desc: THE_DESCRIPTION }}
			trainTimes: {}	//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
		}
	},
	addRouteName: function(newRouteName) {
		this.route_long_name = newRouteName;
	},
	addAgencyId: function(newAgencyId) {
		this.agency_id = newAgencyId;
	},
	addRouteId: function(newRouteId) {
		this.route_id = newRouteId;
	},
	addNewTrip: function(aNewTrip) {
		//declare local variables
		var serviceDirection = aNewTrip.direction_id;
		var thisTripId = aNewTrip.trip_id;

		console.log(aNewTrip);

		this.service[serviceDirection].headsign = aNewTrip.stop_headsign;
		this.service[serviceDirection].direction = aNewTrip.getDirectionString();
		this.service[serviceDirection].stations = aNewTrip.getAllStations();
		this.service[serviceDirection].trainTimes[thisTripId] = aNewTrip.getAllTripTimes();
	}
}