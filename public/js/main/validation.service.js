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
	}
}

ValidationService.prototype.isWkday = function(wkday) {
	return this.weekdays[wkday];
};