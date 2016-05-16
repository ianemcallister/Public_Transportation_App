
var Cursor = function() {
	
	this.position = null;			
	this.next = null;
	this.path = {'testing': 'test'};
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
	var stepPos = cursor._objectLength(cursor.path);
	
	cursor.path[stepPos] = newStep;
}

Cursor.prototype.getPosition = function() { return this.position; }
Cursor.prototype.getNext = function() { return this.next; }
Cursor.prototype.getPath = function() { return this.path; }


module.exports = Cursor;