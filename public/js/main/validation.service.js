export default function ValidationService() {
	var validator = this;

	//validator properties
	validator.weekdays = {
		"Sunday":true, 
		"Monday":true, 
		"Tuesday":true,
		"Wednesday":true, 
		"Thursday":true,
		"Friday": true,
		"Saturday": true
	};

	validator.directions = {
		"Northbound": false,
		"Eastbound": true,
		"Southbound": false,
		"Westbound": true,
		"Clockwise": false,
		"Counter-Clockwise": false
	};
}

ValidationService.prototype.isWkday = function(wkday) {
	return this.weekdays[wkday];
};

ValidationService.prototype.isOpnDir = function(direction) {
	return this.directions[direction];
};