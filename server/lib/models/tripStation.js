//
var TripStation = function() {
	this.id = 0,
	this.name = '',
	this.desc = ''
}

TripStation.prototype.setId = function(id) { this.id = id; };
TripStation.prototype.setName = function(name) { this.name = name; };
TripStation.prototype.setDesc = function(desc) { this.desc = desc; };

TripStation.prototype.setStation = function(aStation) {
	this.id = aStation.id;
	this.name = aStation.name;
	this.desc = aStation.desc;
};

TripStation.prototype.getId = function() { return this.id; };
TripStation.prototype.getName = function() { return this.name; };
TripStation.prototype.getDesc = function() { return this.desc; };

module.exports = TripStation;