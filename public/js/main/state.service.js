import TrainDataService from './trainData.service';

const allHeadings = {0: "Northbound", 1: "Eastbound", 2:"Southbound", 3:"Westbound", 4:"Clockwise", 5:"Counter-Clockwise"};

class StateService {

	constructor() {
		//declare and init variables variables
		this._nav = this._navInit();
		this._sched = this._schedInit();
	}

	_navInit() {
		return {
			start: '', 
			end: '', 
			time: 0, 
			day: 0, 
			dir: 0, 
			active:false
		};
	}

	_schedInit() {
		return {
			inputs: this._schedInputsInit(),
			filter: {},
			timeTable: {},
			active: false,
		};
	}

	_navInputsInit() {
		return {
			departure: {
				default: {},
				selected: {},
				options: []
			},
			arrival: {
				default: {},
				selected: {},
				options: []
			},
			wkday: {
				default: {},
				selected: {},
				options: []
			},
			time: {
				default: {},
				selected: {}
			},
			importantEndpoint: {
				default: {},
				selected: {},
				options: []
			}
		}
	}

	_schedInputsInit() {
		return {
			line: {
				default: {},
				selected: {},
				options: {}
			},
			heading: {
				default: {},
				selected: {},
				options: {},
				templateModal: {}
			},
			wkday: {
				default: {},
				selected: {},
				options: {}
			},
			time: {
				default: {},
				selected: {}
			}
		};
	}

	_currentTime() {
		let dateTime = new Date();
		let dayOfWeek = dateTime.getDay();
		let hours = dateTime.getHours();
		let minutes = dateTime.getMinutes();

		return {wkday: dayOfWeek, time: (hours * 60) + minutes};
	}

	_wkdayFromTime(wkday) {
		let days = {0:"Sunday", 1:"Monday", 2:"Tuesday", 3:"Wednesday", 4:"Thursday", 5:"Friday", 6:"Saturday"};
		let dayOfWeek = days[wkday];
		let wkDayObject = {};
		wkDayObject[dayOfWeek] = wkday;
		return wkDayObject;
	}

	_getStateValues(section, category, subcategory, property) {
		if(typeof category !== "undefined") {
			if(typeof subcategory !== 'undefined')
				if(typeof property !== "undefined")
					return this[section][category][subcategory][property];
				else
					return this[section][category][subcategory];
			else
				return this[section][category];
		} else
			return this[section];
	}

	_setStateValues(newValues, section, category, subcategory, property) {
		if(typeof category !== "undefined") {
			if(typeof subcategory !== 'undefined')
				if(typeof property !== "undefined")
					this[section][category][subcategory][property] = newValues;
				else
					this[section][category][subcategory] = newValues;
			else
				this[section][category] = newValues;
		} else
			this[section] = newValues;
	}

	_setLineHeadingOptions() {
		//get the line from the model
		let line = this._getStateValues('_sched', 'inputs', 'line', 'selected');

		return TrainDataService.getTrainDirections(line);
	}

	_setLineHeadingTemplateModal() {
		//get the line from the model
		let line = this._getStateValues('_sched', 'inputs', 'line', 'selected');
		let templateModal = {};

		Object.keys(allHeadings).forEach(function(dir) {
			if(TrainDataService.isValidTrainDirection(line, allHeadings[dir]))
				templateModal[allHeadings[dir]] = true;
			else templateModal[allHeadings[dir]] = false;
		});

		return templateModal;
	}

	set(area, property, value) {
		this[area][property] = value;
	}

	getSchedLine() {
		let selectedLine = "";
		let trainObject = this._getStateValues("_sched","inputs","line", "selected");
		
		Object.keys(trainObject).forEach(function(key) {
			selectedLine = key;
		});
		
		return selectedLine;
	}

	getSchedHeading() {
		//check selected first
		let selected = this._getStateValues("_sched","inputs","line", "selected");
		let defaultLine = this._getStateValues("_sched","inputs","line", "default");
		console.log(selected, defaultLine);
		//then default
	}
	get(area, property) {
		if(typeof property !== "undefined") return this[area][property];
		else return  this[area];
	}

	initializeSched(short_name) {
		let state = this;

		state._setStateValues(true, "_sched", "active");
		state._setStateValues(TrainDataService.getTrainObjectByName("Red_Line"), "_sched", "inputs", "line", "selected");
		state._setStateValues(state._wkdayFromTime(state._currentTime().wkday), "_sched", "inputs", "wkday", "default");
		state._setStateValues(state._currentTime().time, "_sched", "inputs", "time", "default");
		state._setStateValues({"Westbound": 3}, "_sched", "inputs", "heading", "default");
		state._setStateValues(state._setLineHeadingOptions(), "_sched", "inputs", "heading", "options");
		state._setStateValues(state._setLineHeadingTemplateModal(), "_sched", "inputs", "heading", "templateModal");

		console.log(this._sched);
	}

	//TODO REMOVE THIS LATER
	setNav(number) {
		this._nav = number;
	}

	//TODO REMOVE THIS LATER
	test() {
		return this._nav;
	}

}

let _stateService = new StateService;

export default _stateService;