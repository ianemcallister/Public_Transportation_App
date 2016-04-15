//used to mode through the system map
//dependencies
var node = require('./models/node');

var LinkedList = function(dataSource) {
	//declare the properties

	//run the constructor
	this._constructor(dataSource);
}

LinkedList.prototype._constructor = function(dataSource) { 
	console.log('found this:');
	console.log(dataSource);
};

LinkedList.prototype.getConnectedStations = function() {

};

module.exports = LinkedList;
