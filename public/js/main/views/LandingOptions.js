import trainDataService from './../trainData.service';
import bookendsTemplate from './../../../../templates/bookends.hbs';
import stopsTemplate from './../../../../templates/stops.hbs';
import lineTemplate from './../../../../templates/lines.hbs';
import timeTableTemplate from './../../../../templates/timeTable.hbs';
import parseHTML from './../../utils/parseHTML';
import $ from 'jquery';

export default function LandingOptions(container) {
	var landing = this;
	
	landing._trainByName = {};
	landing._trainByNumber = {};

	//declare and initialize variables
	landing._container = container;
	landing.TrainDataService = new trainDataService();
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
		
		if(typeof landing._trainByName[checkable] !== "undefined") 
			landing.addTimeTable(landing._trainByName[checkable]);
		else return;
	});

}


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

LandingOptions.prototype.addTimeTable = function(trainLine) {
	var landing = this;
	var lineId = trainLine + "_" + landing._trainByNumber[trainLine];
	var direction = 0;
	var timeTable = this._schedDisplay;
	
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
		var htmlString = stops.map(function(stop) {
			return timeTableTemplate(stop);
		}).join('');

		//parse the html into nodes
		var nodes = parseHTML(htmlString);

		//append the nodes to the DOM
		timeTable.appendChild(nodes, timeTable);

	});

};
