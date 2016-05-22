'use strict'

var Cursor = function(pos, path) {
	this.pos = null;
	this.path = [];
	
	if(typeof path == 'undefined') this.basicInit(pos);
	else this.init(pos, path);
}

Cursor.prototype.basicInit = function(pos) { this.pos = pos; } 
Cursor.prototype.init = function(pos, path) { this.pos = pos; this.path = path; }

Cursor.prototype.getPos = function() { return this.pos; }
Cursor.prototype.setPos = function(newPOS) { this.pos = newPOS; }

Cursor.prototype.advanceCursor = function(pos) { this.incrimentPath(); this.setPos(pos); }
Cursor.prototype.incrimentPath = function() { this.path.push(this.pos); }
Cursor.prototype.getPath = function() { return this.path; }



module.exports = Cursor;