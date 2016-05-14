import Backend from './backend.service'

//const placeholder = {1: "Eastbound", 3: "Westbound"};

class TrainDataService {
	constructor() {

		this._trainsByName = {};
		this._trainsByNumber = {};
		this._trainDirections = {};
		this._schedByDbId = {}; //example: {"Red_Line": {name:"90_Red_Line", "Westbound":"dir0", "Eastbound":"dir1"} };

	}

	_setTrainList(list, key, short_name) {
		if(list == '_trainsByNumber')
			this[list][short_name] = key;
		if(list == '_trainsByName')
			this[list][key] = short_name;
	}

	_setTrainDirections(key, directions) {
		/*if(typeof directions == 'undefined')
			directions = placeholder;*/
		this._trainDirections[key] = directions;
	}

	_setSchedByDbId(list) {
		let ds = this;
		
		Object.keys(list).forEach(function(key) {
			let long_name = (list[key].long_name).replace(" ", "_");
			let short_name = list[key].short_name;
			let dbId = short_name + "_" + long_name;
			let dir0 = '';
			let dir1 = '';
			let i = 0;

			//save values
			ds._schedByDbId[long_name] = { name: dbId }

			//add directions
			Object.keys(list[key].directions).forEach(function(dir) {
				let direction = list[key].directions[dir];
				ds._schedByDbId[long_name][direction] = 'dir' + i;
				i++;
			});

		});
		
	}

	getTrainNumberByName(name) {
		return this._trainsByName[name];
	}

	getTrainNameByNumber(number) {
		return this._trainsByNumber[number];
	}

	getTrainObjectByName(name) {
		let newTrain = {};
		newTrain[name] = this.getTrainNumberByName(name);
		return newTrain;
	}

	getTrainObjectByNumber(number) {}

	getTrainDirections(trainObject) {
		let local = this;
		let directions = {};
		let currentline = '';

		Object.keys(trainObject).forEach(function(key) {
			directions[key] = local._trainDirections[key];
			currentline = key;
		})

		return directions[currentline];
	}

	isValidTrainDirection(line, dir) {
		
		let short_name = '';
		Object.keys(line).forEach(function(key){ short_name = key; })
		
		let allDirections = this._trainDirections[short_name];
		let found = false;

		Object.keys(allDirections).forEach(function(direction) {
			if(allDirections[direction] == dir) found = true;
		});

		return found;
	}

	isValidTrainByName(name) {
		let local = this;
		if(typeof local._trainsByName[name] !== 'undefined') return true;
		else return false;
	}

	getDbHeadingRef(line, heading) {
		
		return this._schedByDbId[line][heading];
	}

	getAllTrainsList() {
		let ds = this;

		//resolvturn a promise for async work
		return new Promise(function(resolve, reject) {

			Backend.getSchedTrainsList()
			.then(function(response) {
				
				resolve(response);
			})
			.catch(function(error) {
				console.log("error: " + error);
			})

		});
	}

	getTrainHeading(line) {
		let ds = this;
		let returnValue = ''; 
		let i = 0;

		Object.keys(this._trainDirections[line]).forEach(function(key) {
			if(i < 1) returnValue = ds._trainDirections[line][key];
			i++;
		});

		return returnValue;
	}

	getLineTimeTable(dbLineId) {
		
		let local = this;
		
		//return a promise for async work
		return new Promise(function(resolve, reject) {
			Backend.readLineSequence(dbLineId)
			.then(function(response) {
				//console.log(response);

				//build the proper format for the view
				let returnObject = [];

				Object.keys(response).forEach(function(stop) {
					let stopName = '';
					//identify stop name
					if(response[stop].parent_station.stop_id !== null) 
						stopName = response[stop].parent_station.stop_name;
					else
						stopName = response[stop].stop_name;

					returnObject.push({
						stop_name: stopName,
						arrivals: response[stop].arrivals
					});
				});

				resolve(returnObject);
			});

		});

	}	
	
	addSchedByDbId(trainsList) {
		this._setSchedByDbId(trainsList);
	}

	addSchedTrain(key, short_name) {
		
		//add to both lists
		this._setTrainList('_trainsByName', key, short_name);
		this._setTrainList('_trainsByNumber', key, short_name);
	}

	addSchedLineDirs(key, directions) {
		//add to the model
		this._setTrainDirections(key, directions);
		
	}

	findSchedFrinedlyStartTime(stops, currentTime) {
		//where does the current time come first?
		let timeHorz = 0;
		let timeVert = 0;
		let solution = {};
		let timesArray = [];

		//readall values into a table
		Object.keys(stops).forEach(function(stop) {
			//add a new array for each stop
			timesArray.push([]);

			stops[stop].arrivals.forEach(function(time) {
				timesArray[stop].push(time);
			});
		});

		//check vertically and horizontally at the same time
		let searching = true;
		let horzSearchX = 0;
		let horzSearchY = 0;
		let vertSearchX = 0;
		let vertSearchY = 1;

		while(searching) {
			//check all vertical start times first, then horizontal
			if(	timesArray[vertSearchY][vertSearchX] >= currentTime &&
				timesArray[vertSearchY - 1][vertSearchX] < currentTime ) {
				searching = false;
				solution = {
					train: vertSearchX,
					stop: vertSearchY,
					value:timesArray[vertSearchY][vertSearchX]
				};
			}

			if(vertSearchY < (timesArray.length / 2)) vertSearchY++;
			else { vertSearchY = 1; vertSearchX++; }
		}
		//taking a diferent approach
		/*while(searching) {
			//console.log(horzSearchX, horzSearchY);
			if(	timesArray[horzSearchY][horzSearchX] >= currentTime &&
				timesArray[horzSearchY][horzSearchX - 1] < currentTime ) {
				searching = false;
				solution = {
					train: horzSearchX,
					stop: horzSearchY,
					value:timesArray[horzSearchY][horzSearchX],
				};
			}
			//console.log(vertSearchY, vertSearchX);
			if(	timesArray[vertSearchY][vertSearchX] >= currentTime &&
				timesArray[vertSearchY - 1][vertSearchX] < currentTime ) {
				searching = false;
				solution = {
					train: vertSearchX,
					stop: vertSearchY,
					value:timesArray[vertSearchY][vertSearchX]
				};
			}

			//incriment the counters
			//console.log({hX:horzSearchX, len: timesArray[0].length});
			if(horzSearchX < (timesArray[0].length) - 1) horzSearchX++;
			else { horzSearchX = 0; horzSearchY++; }

			if(vertSearchY < (timesArray.length - 1)) vertSearchY++;
			else { vertSearchY = 1; vertSearchX++; }
		}*/

		return solution
	}

	requestRoute(dptInput, arrvInput) {
		return new Promise((res, rej) => {
			res({
				tripDuration: "17min",
				totalStops: 6,
				departureStn: {
					name: "Beaverton"
				},
				arrivalStn: {
					name: "Gresham",
					ID: "Station 9231",
					desc: "Turn left at the stoplight"
				}
			});
		});
	}
}

let _trainDataService = new TrainDataService;

export default _trainDataService;