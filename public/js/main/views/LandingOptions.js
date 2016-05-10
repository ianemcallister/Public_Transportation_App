import trainDataService from './../trainData.service';
import validationService from './../validation.service';
import stateService from './../state.service';
import bookendsTemplate from './../../../../templates/bookends.hbs';
import stopsTemplate from './../../../../templates/stops.hbs';
import lineTemplate from './../../../../templates/lines.hbs';
import schedFilterTemplate from './../../../../templates/schedfilter.hbs';
import timeTableTemplate from './../../../../templates/timeTable.hbs';
import parseHTML from './../../utils/parseHTML';
import $ from 'jquery';

export default function LandingOptions(container) {
	var landing = this;
	
	landing._trainByName = {};
	landing._trainByNumber = {};
	landing.state = {
		nav: { start: '', end: '', time: 0, day: 0, dir: 0, active:false},
		sched: { line: 0, day: 0, time: 0, dir: 0, active:false, directions:{} }
	};

	//declare and initialize variables
	landing._container = container;
	landing.TrainDataService = new trainDataService();
	landing.ValidationService = new validationService();
	landing.StateService = new stateService();
	landing._bookendsSelector = container.querySelector('.nav');
	landing._navFilter = container.querySelector('.navFilter');
	landing._navDisplay = container.querySelector('.navDisplay');
	landing._schedSelector = container.querySelector('.sched');
	landing._schedFilter = container.querySelector('.schedFilter');
	landing._trainLines = container.querySelector('#trainLines');
	landing._schedDisplay = container.querySelector('.schedDisplay');

	//test the container
	console.log(landing._container);

	landing._initializePage();
	
}

LandingOptions.prototype._initializePage = function() {
	var landing = this;

	//addTrainsList
	landing._addTrainsList();

	//when page is ready
	$(document).ready(function() {	
		//add watchers
		landing._startWatching()
	});
};

LandingOptions.prototype._startWatching = function() {
	var landing = this;

	$('#schedHeader').click(function() {
		console.log(landing);
	});

	$('#trainLinesInput').on('change keyup click',function(event) {
		//check for a valid input
		var checkable = ($('#trainLinesInput').val()).replace(" ", "_");
		
		if(typeof landing._trainByName[checkable] !== "undefined") {
			//define the current time
			var timeNow = landing._currentTime();
			var currentTime = timeNow.time;
			var currentDay = timeNow.wkday;

			//set the state variables
			landing.state.sched.active = true;
			landing.state.sched.line = landing._trainByName[checkable];
			landing.state.sched.day = currentDay
			landing.state.sched.time = currentTime
			landing.state.sched.dir = 0

			//log for reference
			console.log(landing.state.sched);

			//build the filter
			landing._showSchedFilter(landing.state.sched);

			//build the timetable
			landing._addTimeTable(landing.state.sched);

		} else return;

	});

};

LandingOptions.prototype._currentTime = function() {
	var dateTime = new Date();
	var dayOfWeek = dateTime.getDay();
	var hours = dateTime.getHours();
	var minutes = dateTime.getMinutes();

	return {wkday: dayOfWeek, time: (hours * 60) + minutes};
};

LandingOptions.prototype._formatDay = function(wkday) {
	var weekDays = {0: "Sunday", 1: "Monday", 2:"Tuesday", 3:"Wednesday", 4:"Thursday", 5:"Friday", 6: "Saturday"};
	return weekDays[wkday];
};

LandingOptions.prototype._findDay = function(dayOfWeek) {
	var weekDays = {"Sunday":0 , "Monday":1, "Tuesday":2, "Wednesday":3, "Thursday":4, "Friday":5, "Saturday":6};
	return weekDays[dayOfWeek];

};

LandingOptions.prototype._formatTime = function(minutes) {
	var hours = Math.floor(minutes/60);
	var mins = minutes % 60;
	var A = 'am';
	var timeString = "";

	if (minutes < 60) hours = 12;
	if (minutes >= 720) {
		hours = hours - 12;
		A = 'pm';
	}

	if(mins < 10) timeString = hours + ":0" + mins + " " + A;
	else timeString = hours + ":" + mins + " " + A;

	return timeString
};

LandingOptions.prototype._formatDir = function(currentDir) {
	var directions = { 0: "Northbound", 1: "Eastbound", 2: "Southbound", 3:"Westbound", 4:"Clockwise", 5:"Counter-Clockwise" };
	return directions[currentDir];
};

LandingOptions.prototype.addStopsList = function(stops) {
	//build the options from the model
	var htmlString = stops.map(function(stop) {
		return stopsTemplate(stop);
	}).join('');

	//var nodes = parseHTML(htmlString + "" + htmlString + "" );

	//this._navFilter.appendChild(nodes, this._navFilter.firstChild);
};

LandingOptions.prototype._addTrainsList = function() {
	var landing = this;
	var trainLinesInput = landing._trainLines;

	landing.TrainDataService.getAllTrainsList()
	.then(function(trains) {
		
		//save the trains for later
		trains.forEach(function(train) {
			var longName = train['long_name'];
			var shortName = train['short_name'];
			var key = longName.replace(" ", "_");
			
			landing._trainByName[key] = train['short_name'];
			landing._trainByNumber[shortName] = key;
		});

		//build the options from the model
		var htmlString = trains.map(function(train) {
			return lineTemplate(train);
		}).join('');

		//Add input and parse as nodes
		var nodes = parseHTML(htmlString);

		//append to the DOM
		trainLinesInput.appendChild(nodes, trainLinesInput.firstChild);

	});
	
};

LandingOptions.prototype._showSchedFilter = function(stateValues) {
	var landing = this;
	var schedFilter = landing._schedFilter;
	var friendlyTime = landing._formatTime(stateValues.time);
	var friendlyDay = landing._formatDay(stateValues.day);
	var friendlyDir = landing._formatDir(stateValues.dir);
	var context = {direction: friendlyDir, wkday: friendlyDay, time: friendlyTime};

	var htmlString = schedFilterTemplate(context);

	var nodes = parseHTML(htmlString);

	schedFilter.appendChild(nodes, schedFilter);

	//add watchers
	$('#directionInput').on('change keyup',function(event) {
		var checkable = ($('#directionInput').val());
		console.log('changed direction', checkable);
		//landing._addTimeTable()
	});

	$('#wkdayInput').on('change keyup',function(event) {
		var checkable = ($('#wkdayInput').val()); 
		
		if(landing.ValidationService.isWkday(checkable)) {
			landing.state.sched.day = landing._findDay(checkable);
			landing._addTimeTable(landing.state.sched);
		}

	});

	$('#timeInput').on('change keyup',function(event) { 
		var checkable = ($('#timeInput').val());
		console.log('changed time', checkable);
	});
};

LandingOptions.prototype._addTimeTable = function(stateValues) {
	var landing = this;
	var lineId = stateValues.line + "_" + landing._trainByNumber[stateValues.line];
	var direction = 0;
	var timeTable = this._schedDisplay;
	var lineTitle = landing._trainByNumber[stateValues.line].replace("_", " ");

	//check if nodes were there before then clear anything out that was there
	if(timeTable.hasChildNodes()) {
		var myNode = timeTable;
		while (myNode.firstChild) {
		    myNode.removeChild(myNode.firstChild);
		}
	}

	//reach out to the db
	landing.TrainDataService.getLineTimeTable(lineId, direction)
	.then(function(stops) {

		//build the selected timetable
		var header = "<h4>"+ lineTitle + "</h4>\
		<span>" + landing._formatDir(stateValues.dir) + 
		" - " + landing._formatDay(stateValues.day) + "</span><br>\
		<strong>Station</strong><strong>Arrives</strong>";

		var htmlString = stops.map(function(stop) {
			var friendlyStop = { stop_name: stop.stop_name, time: '' };
			var totalMinutes = 0;

			if(stop.arrivals[stateValues.time]) {
				totalMinutes = stateValues.time;
			} else {
				totalMinutes = 10;
			}

			friendlyStop.time = landing._formatTime(totalMinutes);

			return timeTableTemplate(friendlyStop);
		}).join('');

		htmlString = header + htmlString;

		//parse the html into nodes
		var nodes = parseHTML(htmlString);

		//append the nodes to the DOM
		timeTable.appendChild(nodes, timeTable);

	});

};
