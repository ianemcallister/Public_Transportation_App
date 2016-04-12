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
			trainTimes: {},			//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
			stopSequence: [],			//calculated and built
			timeTable: [],				//calculated and built
			longest_trip_id: null,	//checked for
			longest_trip: null		//calculate this then delete it when finished
		},
		1: {
			headsign: '',			//from aTrip.js
			direction: '',			//from aTrip.js
			stations: {},			//from aTrip.js example: stopNumber: { stop_name: THE_NAME, stop_desc: THE_DESCRIPTION }
			trainTimes: {},			//from aTrip.js example: tripId: { stopNumber: departure_time, stopNumber: departure_time  }
			stopSequence: [],			//calculated and built
			timeTable: [],				//calculated and built
			longest_trip_id: null,	//checked for
			longest_trip: null		//calculate this then delete it when finished	
		}
	};
}

TrainLine.prototype.getLongestTripId = function() {
	return { 0: this.service[0].longest_trip_id, 1: this.service[1].longest_trip_id }
};

TrainLine.prototype.addRouteName = function(newRouteName) {
	this.route_long_name = newRouteName;
};

TrainLine.prototype.addAgencyId = function(newAgencyId) {
	this.agency_id = newAgencyId;
};

TrainLine.prototype.addRouteId = function(newRouteId) {
	this.route_id = newRouteId;
};

TrainLine.prototype.addSequenceStop = function(direction, station) {
	
	//define variables
	if(typeof station.parent_station !== 'undefined') {
		var stationId = station.parent_station.stop_id;
		var stationName = station.parent_station.stop_name;
	} else {
		var stationId = station.stop_id;
		var stationName = station.stop_name
	} 
	var stationDesc = station.stop_desc

	var stopObject = {
		id: stationId,
		name: stationName,
		desc: stationDesc
	};

	this.service[direction].stopSequence.push(stopObject);

};

TrainLine.prototype.checkForLongestTrip = function(aNewTrip) {


};

TrainLine.prototype.buildStationSequence = function(lngstTrips) {
	//define local
	var local = this;
	//build in both directions
	Object.keys(this.service).forEach(function(direction) {

		Object.keys(lngstTrips[direction]).forEach(function(station) {
			
			//something
			if(typeof station !== 'undefined') {
				
				local.addSequenceStop(direction, lngstTrips[direction][station]);
			}
			
		});

		//after building delete the tools
		delete local.service[direction].longest_trip_id;
		delete local.service[direction].longest_trip;
	});



};

TrainLine.prototype.buildTimeTables = function(allTrips) {
	//define local
	var local = this;
	
	//build in both directions
	Object.keys(this.service).forEach(function(direction) {

		//declare local variables
		var tripsOnThisLine = 0;

		//loop through all trips
		Object.keys(allTrips).forEach(function(trip) {

			console.log('Adding trip ' + trip);

			//only work with the current route
			if(allTrips[trip].route_id == local.route_id) {

				//if the trip is in the same direction as the current direction, explore further
				if(allTrips[trip].direction_id == direction) {

					//decalare local variables
					var firstStationFound = false;
					var currentLocalstopSequencePosition = 0;

					//looking at the stop squence what is the station_id?
					Object.keys(allTrips[trip].stop_sequence).forEach(function(stop) {

						//declare local variables
						var allTripsStopId;
						
						//define the allTripsStopId base on parent or child
						if(typeof allTrips[trip].stop_sequence[stop].parent_station !== 'undefined') {
							allTripsStopId = allTrips[trip].stop_sequence[stop].parent_station.stop_id;
						} else {
							allTripsStopId = allTrips[trip].stop_sequence[stop].stop_id;
						}

						//loop through local stop sequence array until the matching station id is found or the whole array is checked
						while(!firstStationFound && currentLocalstopSequencePosition < local.service[direction].stopSequence.length) {

							if(allTripsStopId == local.service[direction].stopSequence[currentLocalstopSequencePosition].id) {

								console.log('found the first station');
								//throw the flag
								firstStationFound = true;
								
								//add a new trip array to the timeTable
								local.service[direction].timeTable.push([]);

								//best time to incriment, but count backwards
								tripsOnThisLine++;

							} else {

								//incriment the counter
								currentLocalstopSequencePosition++;

							}

						}

						//if a match was found add the departure times
						if(firstStationFound) {

							console.log('Adding stop: ' + stop + ' with ' + allTrips[trip].stop_sequence[stop].departure_time + ' to ' + (tripsOnThisLine - 1) + ' ' + currentLocalstopSequencePosition);
							//add to the model
							local.service[direction].timeTable[tripsOnThisLine - 1][currentLocalstopSequencePosition] = allTrips[trip].stop_sequence[stop].departure_time;

							//log the success

						} else {

							//otherwise throw an error
							console.log('an error occured with the timetable');
						}

						//incriment the counter
						currentLocalstopSequencePosition++;

					});


				}

			}

		});

	});

};

TrainLine.prototype.addAStation = function(direction, newStation) {
	var stopId = newStation.id;
	var newSeqId = newStation.seqId;
	var alreadyListed = false;

	if(typeof this.service[direction].stations[stopId] == 'undefined') {
		this.service[direction].stations[stopId] = { name: '', desc: ''};
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

TrainLine.prototype.addNewTrip = function(routeId, aNewTrip) {
	//declare local variables
	var serviceDirection = aNewTrip.direction_id;
	var thisTripId = aNewTrip.trip_id;
	var noOfStops = aNewTrip.noOfStops;

	//console.log(routeId);

	this.route_id = routeId;
	this.service[serviceDirection].headsign = aNewTrip.stop_headsign;
	//this.service[serviceDirection].direction = aNewTrip.getDirectionString();
	//this.service[serviceDirection].stations = aNewTrip.getAllStations();
	//this.service[serviceDirection].trainTimes[thisTripId] = aNewTrip.getAllTripTimes();

	if(aNewTrip.noOfStops > this.service[serviceDirection].longest_trip) {
		this.service[serviceDirection].longest_trip = aNewTrip.noOfStops;
		this.service[serviceDirection].longest_trip_id = thisTripId;
	}

};

module.exports = TrainLine;