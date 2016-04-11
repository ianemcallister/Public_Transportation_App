//used to build a parent station
var ParentStation = function() {
	this.stop_id = null;		//from stops.txt
	this.stop_name = ''; 		//from stops.txt
	this.child_stations = [];	//have to be built
	this.lines_served = [];		//have to be built
};

ParentStation.prototype.setStopId = function(newStopId) { this.stop_id = newStopId; };
ParentStation.prototype.setStopName = function(newStopName) { this.stop_name = newStopName; };
ParentStation.prototype.addChildStation = function(aChildStation) { 
	this.child_stations.push(aChildStation); 
};

ParentStation.prototype.addLineServed = function(aLineServed) { this.lines_served.push(aLineServed); };

module.exports = ParentStation;