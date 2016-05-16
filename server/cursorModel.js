var systemGraph = require('./assets/JSON/systemGraph');

var Cursor = function(start) {
	//define local values
	this.position = null;			
	this.next = null;
	this.path = {};
	this.visitedStns = {};

	//initialize the cursor
	if(typeof start !== 'undefined') this._initialize(start);
}

Cursor.prototype._initialize = function(start) {
	var cursor = this;

	var dprtHeading = systemGraph[start].dir;
	var linesObj = systemGraph[start].lines;
  	var dprtLines = cursor._linesObjToArray(linesObj);

	cursor.setPosition(start);
  	cursor.addPathStep({stn: start, lineOptions: dprtLines, heading: dprtHeading});
  	cursor.addVisitedStns();
  	console.log("new cursor", this);
}

Cursor.prototype._linesObjToArray = function(obj) {
  var returnArray = [];

  Object.keys(obj).forEach(function(key) {
    returnArray.push(key);
  });

  return returnArray;
}

Cursor.prototype._objectLength = function(object) {
	var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}

Cursor.prototype.setPosition = function(newPos) { console.log('setting pos', newPos); this.position = newPos; }
Cursor.prototype.setNext = function(newNext) { this.next = newNext; }
Cursor.prototype.addPathStep = function(newStep) {
	var cursor = this;
	
	console.log("new step: ", newStep);
	var stepPos = cursor._objectLength(cursor.path);
	
	cursor.path[stepPos] = newStep;
}

Cursor.prototype.getPosition = function() { return this.position; }
Cursor.prototype.getNext = function() { return this.next; }
Cursor.prototype.getPath = function() { return this.path; }
Cursor.prototype.getVisitedStns = function() { return this.visitedStns; }

Cursor.prototype.addVisitedStns = function() {
	var cursor = this;
	var stnId = cursor.position;

	cursor.visitedStns[stnId] = true;
}

Cursor.prototype.updatePosition = function() {
	var cursor = this;
	var nextNode = this.next;

	Object.keys(nextNode).forEach(function(key) {
		var heading = systemGraph[key].dir;
		var lineOptions = nextNode[key];

		cursor.setPosition(key);
		cursor.addPathStep({stn: key, lineOptions: lineOptions, heading: heading});

	});

	cursor.visitedStns[cursor.getPosition()] = true;

}

Cursor.prototype.isDestinationStation = function(destination) {
	var cursor = this;
	console.log("isDestinationStation checking ", cursor.position, destination);
	if(cursor.position == destination) return true;
	else return false;
}

Cursor.prototype.getUnvisitedConnections = function() {
  var uc = this;
  var returnArray = {};
  var currentNode = uc.getPosition();
  var visitedStns = uc.getVisitedStns();

  //get connections
  var connections = systemGraph[currentNode].connections;
  
  //check the direct connections first;
  console.log(this);
  console.log('direct connections ', connections);
  if(typeof connections !== "undefined") {
  	Object.keys(connections).forEach(function(connection) {
	    var station = connections[connection];

	    //check if this station has been visited before
	    if(typeof visitedStns[station] == 'undefined') {
	      
	      //if it hasn't add it to the list
	      if(typeof returnArray[station] !== 'object') returnArray[station] = [];
	    
	      returnArray[station].push(connection);
	    }
	    
	  });
  }
  

  //then check for connections through a parent station
  if(typeof systemGraph[currentNode].parent !== 'undefined') {
  	var parentstn = systemGraph[currentNode].parent;
  	var childstations = systemGraph[parentstn].childStns;

  	//unpack the routes first
  	Object.keys(childstations).forEach(function(route) {
  		var routeObject = childstations[route];
  		
  		//then unpack the specific stations
  		Object.keys(routeObject).forEach(function(stn) {

  			//check if this station has been visited before
	    	if(typeof visitedStns[stn] == 'undefined') {
	  			//if it hasn't add it to the list
	      		if(typeof returnArray[stn] !== 'object') returnArray[stn] = [];
	  			
	  			returnArray[stn].push(route);
	  		}
	  		
  		});

  	});

  }
  
  //return the array
  return returnArray;
  //return {};	
}

Cursor.prototype.updateData = function(allData) {
	console.log("updateData checking allData: ", allData);

	this.position = allData.position;
	this.next = allData.next;
	this.path = allData.path;
	this.visitedStns = allData.visitedStns;
}


Cursor
module.exports = Cursor;