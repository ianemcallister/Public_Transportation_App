//pase elment of the linked list

var Node = function() {
	this.data = {};
	this.connections = [];
}

//setters
Node.prototype.setData = function(newData) { this.data = newData; };
Node.prototype.setAConnection = function(newConnection) { this.connections.push(newConnection); };

//getters
Node.prototype.getData = function() { return this.data; };
Node.prototype.getAllConnections = function() { return this.connections; };

module.exports = Node;