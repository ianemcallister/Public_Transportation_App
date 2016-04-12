'use strict';

import fs from 'fs';
import path from 'path';

var fileGrabber = {
	alertMe: function() { console.log('does this work from the model?'); },
	getAllTrainlines: function() {
		
		//build the promise to return
		return new Promise(function(resolve, reject) {
			
			//define local variables
			var contents = fs.readFileSync(path.join(__dirname, '../../assets/JSON/90_Red_Line.json'));
			var RedLine = JSON.parse(contents);

			console.log(RedLine);
			
			resolve(RedLine);

		});	

	}
	//this.RedLine = fs.readFileSync(path.join(__dirname, '../../assets/JSON/90_Red_Line.json'));
}

//fileGrabber.prototype.alertMe = function() {  }
//fileGrabber.prototype.getAllTrainlines = function() { }

module.exports = fileGrabber;