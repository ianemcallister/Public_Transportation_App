import bookendsTemplate from './../../../../templates/bookends.hbs';
import lineTemplate from './../../../../templates/lines.hbs';
import parseHTML from './../../utils/parseHTML';

export default function LandingOptions(container) {
	var landing = this;

	//declare and initialize variables
	this._container = container;
	this._bookendsSelector = container.querySelector('.nav');
	this._navFilter = container.querySelector('.navFilter');
	this._navDisplay = container.querySelector('.navDisplay');
	this._schedSelector = container.querySelector('.sched');
	this._schedFilter = container.querySelector('.schedFilter');
	this._schedDisplay = container.querySelector('.schedDisplay');

	//test the container
	console.log(this._container);
}

LandingOptions.prototype.addTrainsList = function(trains) {

	//build the options from the model
	var htmlString = trains.map(function(train) {
		return lineTemplate(train);
	}).join('');

	//Add input and parse as nodes
	var nodes = parseHTML("Train Line: <input list='trainLines'><datalist id='trainLines'>" + htmlString + "</datalist>");

	//append to the DOM
	this._schedFilter.appendChild(nodes, this._schedSelector.firstChild);
};

LandingOptions.prototype.addStops = function(stops) {
	console.log('adding Stops', stops);
};

LandingOptions.prototype.alertMe = function(object) {
	console.log(object, " was clicked");
}