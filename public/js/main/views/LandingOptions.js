import TrainDataServ from './../trainData.service';
import StateService from './../state.service';
import parseHTML from './../../utils/parseHTML';
import $ from 'jquery';

import bookendsTemplate from './../../../../templates/bookends.hbs';
import stopsTemplate from './../../../../templates/stops.hbs';
import lineTemplate from './../../../../templates/lines.hbs';
import schedFilterTemplate from './../../../../templates/schedfilter.hbs';
import timeTableTemplate from './../../../../templates/timeTable.hbs';
import navSection from './../../../../templates/navSection.hbs';
import navSummary from './../../../../templates/navSummary.hbs';
import navSteps from './../../../../templates/navSteps.hbs';

export default function LandingOptions(container) {
	var landing = this;

	//declare and initialize variables
	landing._container = container;
	landing._bookendsSelector = container.querySelector('.nav');
	landing._navFilter = container.querySelector('.navFilter');
	landing._schedSelector = container.querySelector('.sched');
	landing._schedFilter = container.querySelector('.schedFilter');
	landing._trainLines = container.querySelector('#trainLines');
	landing._schedDisplay = container.querySelector('.schedDisplay');

	//download content

	//build page
	landing._initializePage();
	
}

LandingOptions.prototype._initializePage = function() {
	var landing = this;
	var foundNetwork = false;

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

	$('#trainLinesInput').on('change keyup click',function(event) {
		//check for a valid input
		var checkable = ($('#trainLinesInput').val()).replace(" ", "_");
		
		if(TrainDataServ.isValidTrainByName(checkable)) {
			//save the selected line
		
			//build the new view
			landing._buildSched(checkable);

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

LandingOptions.prototype._minToHHmmA = function(minutes, format) {
	var hours = Math.floor(minutes/60);
	var mins = minutes % 60;
	var A = 'am';
	var timeString = "";

	if (minutes < 60) hours = 12;
	if (minutes >= 720) {
		hours = hours - 12;
		A = 'pm';
	}

	if(format == "HH:mm a") {
		if(mins < 10) timeString = hours + ":0" + mins + " " + A;
		else timeString = hours + ":" + mins + " " + A;
	}

	if(format == "HH:mm:ss.SSS") {
		if(hours < 10) timeString = "0" + hours;
		if(minutes >= 720) timeString = parseInt(hours) + 12;
		else timeString = hours;
		timeString += ":";
		if(mins < 10) timeString = timeString + "0" + mins;
		else timeString = timeString + mins + ":00.000";
	}

	return timeString
};

LandingOptions.prototype._hhMMaToMin = function(time) {	
	var hhMM = time.split(':');
	var totalMins = parseInt(hhMM[0] * 60) + parseInt(hhMM[1]);

	return totalMins;
}

LandingOptions.prototype._formatDir = function(currentDir) {
	var directions = { 0: "Northbound", 1: "Eastbound", 2: "Southbound", 3:"Westbound", 4:"Clockwise", 5:"Counter-Clockwise" };
	return directions[currentDir];
};

LandingOptions.prototype._cleanNode = function(node) {
	if(node.hasChildNodes()) {
		var myNode = node;
		while (myNode.firstChild) {
		    myNode.removeChild(myNode.firstChild);
		}
	}
}

LandingOptions.prototype._addTrainsList = function() {
	var landing = this;
	var trainLinesInput = landing._trainLines;

	TrainDataServ.getAllTrainsList()
	.then(function(trains) {

		//save the train details for later
		trains.forEach(function(train) {
			var longName = train['long_name'];
			var shortName = train['short_name'];
			var key = longName.replace(" ", "_");
			
			TrainDataServ.addSchedTrain(key, shortName);

			TrainDataServ.addSchedLineDirs(key, train.directions);

		});

		//build the options from the model
		var htmlString = trains.map(function(train) {
			return lineTemplate(train);
		}).join('');

		//Add input and parse as nodes
		var nodes = parseHTML(htmlString);

		//append to the DOM
		trainLinesInput.appendChild(nodes, trainLinesInput.firstChild);

	}).catch(function(error) {
		console.log("error: " + error);
	});
	
};

LandingOptions.prototype._buildSched = function(checkable) {
	let landing = this;
	let heading = TrainDataServ.getTrainHeading(checkable);

	StateService.initializeSched(checkable, heading);

	//build the filter
	landing._showSchedFilter();

	//build the timetable
	landing._addTimeTable();

	//mark as active
	StateService.activeSection('_sched');
};

LandingOptions.prototype._showSchedFilter = function() {
	let landing = this;
	//view variable
	let schedFilter = landing._schedFilter;

	//model variables
	let modelTime = StateService.getModelTime();
	//var friendlyTime = landing._minToHHmmA(modelTime, "HH:mm:ss.SSS");
	var friendlyDir = StateService.getSchedHeading();

	var context = {
		direction: friendlyDir,
		dirOptions: StateService.getHeadingOptions()
	};

	//clean old nodes
	if(StateService.sectionIsActive('_sched')) {
		console.log(container.querySelector('#schedFilterOptions'));
		let schedFilterOptions = container.querySelector('#schedFilterOptions');
		landing._cleanNode(schedFilterOptions);
	}
	
	var htmlString = schedFilterTemplate(context);

	var nodes = parseHTML(htmlString);

	schedFilter.appendChild(nodes, schedFilter);

	//add 
	

	//add watchers
	$('#directionInput').on('change keyup',function(event) {
		var allDirections = {"Northbound":0, "Eastbound":1, "Southbound":2, "Westbound":3, "Clockwise":4, "Counter-Clockwise":5 };
		var inputValue = ($('#directionInput').val());
		
		if(StateService.isValidDirection(inputValue)) {

			//pass value to state, to be updated
			StateService.setSchedHeading(inputValue);

			//rebuild the timetable
			landing._addTimeTable();
		}

	});

	$('#timeInput').on('change keyup',function(event) { 
		var checkable = ($('#timeInput').val());
		
		if(isNaN(checkable)) {
			
			let totalMinutes = landing._hhMMaToMin(checkable);

			console.log(totalMinutes);
			StateService.setSchedTime(totalMinutes);

			landing._addTimeTable();
		}
	});
};

LandingOptions.prototype._addTimeTable = function() {
	var landing = this;
	
	//view variable
	var timeTable = this._schedDisplay;

	//model variables
	var currentLine = StateService.getSchedLine();
	var currentHeading = StateService.getSchedHeading();
	var dbLineId = StateService.getDbLineId();
	
	//check if nodes were there before then clear anything out that was there
	landing._cleanNode(timeTable);

	//reach out to the db
	TrainDataServ.getLineTimeTable(dbLineId)
	.then(function(stops) {
		
		//build the selected timetable
		var header = "<h4>"+ currentLine.safe + " (" 
		+ currentHeading.safe + ")</h4>\
		<strong>Station</strong><strong>Arrives</strong>";
		
		//placeholder for arrival time accross stations
		let trainNumber = 0;
		let i = 0;
		let startStation = 0;
		var currentTime = StateService.getReferenceTime();
		let startObject = TrainDataServ.findSchedFrinedlyStartTime(stops, currentTime);
		let train = startObject.train;
		
		//build the template
		var htmlString = stops.map(function(stop) {
			//build context for template
			var friendlyStop = { stop_name: stop.stop_name, time: '' };

			if(stop.arrivals[train] == null) friendlyStop.time = '-';
			else friendlyStop.time = landing._minToHHmmA(stop.arrivals[train], "HH:mm a");

			return timeTableTemplate(friendlyStop);
		}).join('');

		htmlString = header + htmlString;

		//parse the html into nodes
		var nodes = parseHTML(htmlString);

		//append the nodes to the DOM
		timeTable.appendChild(nodes, timeTable);

	});

};

LandingOptions.prototype._buildNavSummary = function(context) {
	let landing = this;
	let navSumDisplay = landing._navDisplay;

	//if there was a summary there before, delete it.
	landing._cleanNode(navSumDisplay);

	//build the summary
	let summaryHtmlString = navSummary(context);
	let summaryNodes = parseHTML(summaryHtmlString);

	//append the nodes to the dom
	navSumDisplay.appendChild(summaryNodes, navSumDisplay);

	//define the elements
	let navStepsDisplay = landing._container.querySelector('.navSteps');

	//build the steps
	let stepsHtmlString = context.steps.map(function(step) {
		return navSteps(step);
	}).join('');

	//parse the html into nodes
	let stepsNodes = parseHTML(stepsHtmlString);

	//append the nodes to the dom
	navStepsDisplay.appendChild(stepsNodes, navStepsDisplay);

};

LandingOptions.prototype.addStopsList = function(stops) {
	let landing = this;

	//console.log(stops);
	//build the options from the model
	let htmlString = stops.map(function(stop) {
		//console.log(stop.stop_id, stop.name);
		return stopsTemplate(stop);
	}).join('');

	//console.log(htmlString);

	let nodes = parseHTML(htmlString);
	let nodes2 = parseHTML(htmlString);

	landing._dprtDatalist.appendChild(nodes, landing._dprtDatalist.firstChild);
	landing._arrvDatalist.appendChild(nodes2, landing._arrvDatalist.firstChild);
};

LandingOptions.prototype.buildNavView = function() {
	let landing = this;

	//build the nav view
	let htmlString = navSection();
	let nodes = parseHTML(htmlString);

	//append the nodes to the dom
	landing._bookendsSelector.appendChild(nodes, landing._bookendsSelector);

	//define elements
	landing._dptInput = landing._container.querySelector('#departureStopsInput');
	landing._arrvInput = landing._container.querySelector('#arrivalStopsInput');
	landing._dprtDatalist = landing._container.querySelector('#departureStops');
	landing._arrvDatalist = landing._container.querySelector('#arrivalStops');

	landing._navDisplay = landing._container.querySelector('.navDisplay');

	//define input variables
	let dptInput = {};
	let arrvInput = {};

	//add watchers
	$('#departureStopsInput').on('change keyup',function(event) { 
		var checkable = ($('#departureStopsInput').val());
		
		dptInput = checkable;
	});

	$('#arrivalStopsInput').on('change keyup',function(event) { 
		var checkable = ($('#arrivalStopsInput').val());
		
		arrvInput = checkable;
	});

	$('#navSubmission').on('click',function(event) { 
		console.log('submission clicked');
		
		//request stns Data
		TrainDataServ.requestStnsData(dptInput, arrvInput).then(function(response) {

			console.log(response);
			//landing._buildStnsDataSummary(response);

		}).catch(e => { console.log("error: " + e); });

		//request the route
		/*TrainDataServ.requestRoute(dptInput, arrvInput)
		.then(function(response) {

			//build the route summary, passing in the context
			landing._buildNavSummary(response);

		}).catch(e => {
			console.log("error: " + e);
		});*/

	});

}
