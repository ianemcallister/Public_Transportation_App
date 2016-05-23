'use strict';

var Rides = function(newTrain, startStn, nextStn) {
	this.line = null;
	this.train = null;
	this.path = [];

	if(typeof newTrain !== 'undefined') this._init(newTrain, startStn, nextStn);
}

Rides.prototype._init = function(newTrain, startStn, nextStn) { this.addLine(newTrain.line); this.addTrain(newTrain.num); this.addStnToPath(startStn); this.addStnToPath(nextStn); }

Rides.prototype.addLine = function(newLine) { this.line = newLine; }
Rides.prototype.addTrain = function(newTrain) { this.train = newTrain; }
Rides.prototype.addStnToPath = function(newStn) { this.path.push(newStn); }

Rides.prototype.getAll = function() { return {line: this.line, train: this.train, path: this.path }; }

Rides.prototype.test = function() { console.log('testing here'); }

module.exports = Rides;