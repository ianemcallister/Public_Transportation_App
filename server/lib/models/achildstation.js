//used to build a child station
var ChildStation = function() {
	this.stop_id = null;				//comes from stop_times.txt is an int
	this.stop_name = '';				//comes from stops.txt is a string
	this.stop_desc = '';				//comes from stops.txt is a string
};

ChildStation.prototype.setStopId = function(newStopId) { this.stop_id = newStopId; };
ChildStation.prototype.setStopName = function(newStopName) { this.stop_name = newStopName; };
ChildStation.prototype.setStopDesc = function(newStopDesc) { this.stop_desc = newStopDesc; };

module.exports = ChildStation;