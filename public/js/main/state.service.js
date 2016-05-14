import TrainDataService from './trainData.service';

const allHeadings = {0: "Northbound", 1: "Eastbound", 2:"Southbound", 3:"Westbound", 4:"Clockwise", 5:"Counter-Clockwise"};

class StateService {

	constructor() {
		//declare and init variables variables
		this._nav = this._navInit();
		this._sched = this._schedInit();
		this.internetConnection = true;
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
				default: null,
				selected: null
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
				default: null,
				selected: null
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

	setSchedHeading(newHeading) {
		//find the heading number
		let foundNum = null;
		Object.keys(allHeadings).forEach(function(dir) {
			if(allHeadings[dir] == newHeading)
				foundNum = dir;
		});

		let headingObject = {};
		headingObject[newHeading] = foundNum;

		this._setStateValues(headingObject, '_sched', 'inputs', 'heading', 'selected');
	}

	setSchedTime(minutes) {
		this._setStateValues(minutes,'_sched','inputs', 'time', 'selected');
	}

	getHeadingOptions() {
		return this._getStateValues('_sched', 'inputs', 'heading', 'templateModal');
	}

	getModelTime() {
		//get values
		let defaultTime = this._getStateValues('_sched', 'inputs', 'time', 'default');
		let selectedTime = this._getStateValues('_sched', 'inputs', 'time', 'selected');
		let foundTime = null;

		if(typeof defaultTime == "number") foundTime = defaultTime;
		if(typeof selectedTime == "number") foundTime = selectedTime;
		
		return foundTime;
	}

	getSchedLine() {
		let selectedLine = "";
		let trainObject = this._getStateValues("_sched","inputs","line", "selected");
		let modelObject = {};

		//find the line name
		Object.keys(trainObject).forEach(function(key) {
			selectedLine = key;
		});
		
		//distill it
		let viewSafeName = selectedLine.replace("_"," ");

		//add names to the model
		modelObject["ref"] = selectedLine;
		modelObject["safe"] = viewSafeName;

		//return the model
		return modelObject;
	}

	getDbLineId() {
		let headingObject = this.getSchedHeading();
		let lineObject = this._getStateValues("_sched","inputs","line", "selected");
		let lineName = Object.keys(lineObject)[0];
		let lineNumber = lineObject[lineName];
		return lineNumber + "_" + lineName + '_' + headingObject.safe;
	}

	getSchedHeading() {
		//declare and initialize sought variable
		let foundHeading = "";

		let lineObject = this._getStateValues("_sched","inputs","line", "selected");
		let lineName = Object.keys(lineObject)[0];
		
		//isoled selected and default headings
		let selected = this._getStateValues("_sched","inputs","heading", "selected");
		let defaultHeading = this._getStateValues("_sched","inputs","heading", "default");
		
		//check selected first, then default
		if((Object.keys(selected).length) > 0) {
			foundHeading = Object.keys(selected)[0];
		}
		else if((Object.keys(defaultHeading).length) > 0) {
			foundHeading = Object.keys(defaultHeading)[0];
		}
		
		//get the reference heading
		let refHeading = TrainDataService.getDbHeadingRef(lineName, foundHeading);
		
		//return the findings
		return {ref:refHeading, safe:foundHeading};
	}

	get(area, property) {
		if(typeof property !== "undefined") return this[area][property];
		else return  this[area];
	}

	initializeSched(short_name) {
		let state = this;

		//state._setStateValues(true, "_sched", "active");
		state._setStateValues(TrainDataService.getTrainObjectByName("Red_Line"), "_sched", "inputs", "line", "selected");
		state._setStateValues(state._wkdayFromTime(state._currentTime().wkday), "_sched", "inputs", "wkday", "default");
		state._setStateValues(state._currentTime().time, "_sched", "inputs", "time", "default");
		state._setStateValues({"Westbound": 3}, "_sched", "inputs", "heading", "default");
		state._setStateValues(state._setLineHeadingOptions(), "_sched", "inputs", "heading", "options");
		state._setStateValues(state._setLineHeadingTemplateModal(), "_sched", "inputs", "heading", "templateModal");

		console.log(this._sched);
	}

	activeSection(section) {
		this._setStateValues(true, section, "active");
	}

	sectionIsActive(section) {
		return this._getStateValues(section, 'active');
	}

	isValidDirection(query) {
		let allDirections = this._getStateValues('_sched','inputs','heading','templateModal');
		
		if(allDirections[query]) return true;
		else return false;
	}

	getReferenceTime() {
		let timeObject = this._getStateValues('_sched','inputs','time');;
		
		if(timeObject.selected == null) return timeObject.default;
		else return timeObject.selected;
	}

	noInternetConnection() { console.log('no service'); this.internetConnection = false; }
	foundInternetConnection() { console.log('internet found'); this.internetConnection = true; }

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