import trainDataService from './../trainData.service';
import bookendsTemplate from './../../../../templates/bookends.hbs';
import stopsTemplate from './../../../../templates/stops.hbs';
import lineTemplate from './../../../../templates/lines.hbs';
import timeTableTemplate from './../../../../templates/timeTable.hbs';
import parseHTML from './../../utils/parseHTML';
import $ from 'jquery';

export default function LandingOptions(container) {
	var landing = this;
	
	landing._trainLinesList = {};

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
		
		if(typeof landing._trainLinesList[checkable] !== "undefined") 
			landing.addTimeTable(landing._trainLinesList[checkable]);
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

	//TODO: try the cache first
	//TODO: if no luck with the cash get from the server

	landing.TrainDataService.getCachedDbPromise('transit-db', 4, 'trains')
	.then(function(db) {
		var store = db.transaction('trains').objectStore('trains');
		return store.getAll();
	})
	.then(function(trains) {
		
		//save the trains for later
		trains.forEach(function(train) {
			var longName = train['long_name'];
			var key = longName.replace(" ", "_");
			
			landing._trainLinesList[key] = train['short_name'];
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

	console.log('this is the ' + trainLine);

	//check if nodes were there before then clear anything out that was there
	if(landing._schedDisplay.hasChildNodes()) {
		var myNode = landing._schedDisplay;
		while (myNode.firstChild) {
		    myNode.removeChild(myNode.firstChild);
		}
	}

	//colect the context from the appropriate model
	var tempContext = [
		{stationId: 123, stationName: "PDX", arrival: 14733},
		{stationId: 329, stationName: "Grisham", arrival: 14753}
	];

	//build the selected timetable
	var htmlString = tempContext.map(function(stop) {
		return timeTableTemplate(stop);
	}).join('');

	//parse the html into nodes
	var nodes = parseHTML(htmlString);

	//append the nodes to the DOM
	this._schedDisplay.appendChild(nodes, this._schedDisplay);
};
