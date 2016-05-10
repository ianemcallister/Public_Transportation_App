export default function StateService() {
	var state = this;

	state.nav = {
		start: 0,
		end: 0,
		time: 0,
		day: 0,
		dir: 0,
		active: false
	};

	state.sched = {
		line: 0,
		day: 0,
		time: 0,
		dir: 0,
		active: false,
		directions: {}
	};

}

StateService.prototype.set = function(area, property, value) {
	this[area][property] = value;
};

StateService.prototype.get = function(area, property) {
	return this[area][property];
};