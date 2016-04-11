//used to build trips
var Trip = function() {
	this.trip_id = null;		//from stop_times.txt
	this.stop_headsign = '';	//from stop_times.txt
	this.direction_id = null;	//from trips.txt
	this.route_id = null;		//from trips.txt
	this.noOfStops = 0;			//to be calculated
	this.stop_sequence = {};	//collection of tripstops with stop_sequence keys from stop_times.txt
	this.received_data = false;	
}

Trip.prototype._getTripId = function() { return this.trip_id; };
Trip.prototype._getStopHeadsign =function() { return this.stop_headsign; };
Trip.prototype._getDirection = function() { return this.direction_id; };
Trip.prototype._getRouteId = function() { return this.route_id; };
Trip.prototype._getDirectionString = function() {
	//check first three directions, if they all match use the value
	if( stop_sequence[0].direction == stop_sequence[1].direction && 
		stop_sequence[1].direction == stop_sequence[2].direction && 
		stop_sequence[2].direction == stop_sequence[3].direction) return stop_sequence[0].direction
};

Trip.prototype._getAllStations = function() {
	//declare local variables
	var stationsList = {};

	//pull pertainant data out of stop_sequence
	Object.keys(this.stop_sequence).forEach(function(stopNumber) {
		//set the values
		stationsList[stopNumber] = {};
		stationsList[stopNumber]['stop_name'] = this.stop_sequence.stop_name;
		stationsList[stopNumber]['stop_desc'] = this.stop_sequence.stop_desc;
	});

	return stationsList;
};

Trip.prototype._getAllTripTimes = function() {
	//declare local variables
	var departureList = {};

	Object.keys(this.stop_sequence).forEach(function(stopNumber) {
		//set the values
		departureList[stopNumber] = this.stop_sequence.departure_time;
	});

	return departureList;
};

Trip.prototype._setReceivedData = function() {
	this.received_data = true;
};

Trip.prototype._setTripId = function(newTripId) {
	this.trip_id = newTripId;
	if(!this.received_data) this._setReceivedData();
};

Trip.prototype._setStopHeadSign = function(newHeadsign) {
	this.stop_headsign = newHeadsign;
	if(!this.received_data) this._setReceivedData();
};

Trip.prototype._setDirectionId = function(newDirection) {
	this.direction_id = newDirection;
	if(!this.received_data) this._setReceivedData();
};

Trip.prototype._setRouteId = function(newRouteId) {
	this.route_id = newRouteId;
	if(!this.received_data) this._setReceivedData();
};

Trip.prototype.countStops = function() {
	this.noOfStops++;
};

Trip.prototype._setNewStop = function(aNewStop) {
	//define local variables
	var stopNumber = aNewStop._getStopSequenceId();
	var newTripStop = {
		trip_id: aNewStop._getTripId(),
		stop_id: aNewStop._getStopId(),
		departure_time: aNewStop._getDepartureTime(),
		stop_sequence: aNewStop._getStopSequenceId(),
		stop_headsign: aNewStop._getStopHeadsign(),
		stop_name: aNewStop._getStopName(),
		stop_desc: aNewStop._getStopDesc(),
		hasParentStation: aNewStop._hasParentStation,
		parent_station: aNewStop._getParentStation(),
		direction: aNewStop._getDirection()
	};

	//if need be override values
	if(aNewStop.hasParentStation) newTripStop['stop_name'] = aNewStop._getParentStationName();
	else newTripStop['stop_name'] = aNewStop._getStopName();

	//set the trip headsign
	this.stop_headsign = aNewStop._getStopHeadsign();

	//set the trip Id
	/*if(this.trip_id === null)*/ this._setTripId(aNewStop._getTripId());

	//add the stop to the model
	this.stop_sequence[stopNumber] = newTripStop;

	//update the flag if need be
	if(!this.received_data) this._setReceivedData();

	//count the stop
	this.countStops();
};

module.exports = Trip;