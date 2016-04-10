//used to build stops on a trip
var TripStop = function() {
	this.trip_id = null;				//comes from stop_times.txt is an int
	this.stop_id = null;				//comes from stop_times.txt is an int
	this.departure_time = null;			//comes from stop_times.txt converted to a unixTime
	this.stop_sequence = null;			//comes from stop_times.txt is an int
	this.stop_headsign = '';			//comes from stop_times.txt is a string
	this.stop_name = '';				//comes from stops.txt is a string
	this.stop_desc = '';				//comes from stops.txt is a string
	this.hasParentStation = false;		//must be set by a function
	this.parent_station = {};			//comes form stops.txt
	this.direction = '';				//comes from stops.txt
}

function unixTimeToDateTime(unixTime) {
	return new Date(parseInt(unixTime));
}

function dateTimeToUnixTime(dateTime) {
	if(typeof dateTime === 'string') {
		var hour = parseInt(dateTime.slice(0, 2));
		var minute = parseInt(dateTime.slice(3, 5));
		var second = parseInt(dateTime.slice(6, 8));
		var tempDate = new Date();
		tempDate.setHours(hour, minute, second);
		dateTime = tempDate;
	}
	return Date.parse(dateTime);
}

TripStop.prototype._getTripId = function() { return this.trip_id; };
TripStop.prototype._getStopId = function() { return this.stop_id; };
TripStop.prototype._getDepartureTime = function() { return this.departure_time; };
TripStop.prototype._getStopSequenceId = function() { return this.stop_sequence; };
TripStop.prototype._getStopHeadsign = function() { return this.stop_headsign; };
TripStop.prototype._getStopName = function() { return this.stop_name; };
TripStop.prototype._getStopDesc = function() { return this.stop_desc; };
TripStop.prototype._getParentStation = function() { return this.parent_station; };
TripStop.prototype._getParentStationName = function() { return this.parent_station.stop_name; };
TripStop.prototype._getDirection = function() { return this.direction; };
TripStop.prototype._setAll = function(newTripId, newDeparture, newStopID, newSequenceID, newHeadsign) {
	this._setTripId(newTripId);
	this._setDepartureTime(newDeparture);
	this._setStopId(newStopID);
	this._setStopSequenceNo(newSequenceID);
	this._setStopHeadSign(newHeadsign);
};

TripStop.prototype._setTripId = function(newTripId) {
	this.trip_id = newTripId;
};

TripStop.prototype._setStopId = function(newStopId) {
	this.stop_id = newStopId;
};

TripStop.prototype._setDepartureTime = function(newDepartureTime) {
	this.departure_time = dateTimeToUnixTime(newDepartureTime);
};

TripStop.prototype._setStopSequenceNo = function(newStopSeqNo) {
	this.stop_sequence = newStopSeqNo;
};

TripStop.prototype._setStopHeadSign = function(newStopHeadSign) {
	this.stop_headsign = newStopHeadSign;
};

TripStop.prototype._setStopName = function(newStopName) {
	this.stop_name = newStopName;
};

TripStop.prototype._setStopDesc = function(newStopDesc) {
	this.stop_desc = newStopDesc;
};

TripStop.prototype._setParentStation = function(newParentStation) {
	this.parent_station = newParentStation;
	this.hasParentStation = true;
};

TripStop.prototype._setDirection = function(newDirection) {
	this.direction = newDirection;
};

module.exports = TripStop;