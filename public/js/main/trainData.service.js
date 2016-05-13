import idb from 'idb';

class TrainDataService {
	constructor() {

		this._trainsByName = {};
		this._trainsByNumber = {};
		this._trainDirections = {};
		this._schedByDbId = {};

		//TODO: Pull this out later
		this._trainByNumber = {
			90: "Red_Line",
			100: "Green_Line",
			190: "Blue_Line",
			200: "Yellow_Line",
			290: "Orange_Line"
		};

		//TODO: Pull this out later
		this._trainsByName = {
			"Red_Line": 90,
			"Green_Line": 100,
			"Blue_Line": 190,
			"Yellow_Line": 200,
			"Orange_Line": 290
		};

		//TODO: Pull this out later
		this._trainDirections = {
			"Red_Line": {1:'Eastbound', 3:'Westbound'},
			"Green_Line": {1:'Eastbound', 3:'Westbound'},
			"Blue_Line": {1:'Eastbound', 3:'Westbound'},
			"Yellow_Line": {1:'Eastbound', 3:'Westbound'},
			"Orange_Line": {1:'Eastbound', 3:'Westbound'}
		};

		this._schedByDbId = {
			"Red_Line": {name:"90_Red_Line", "Westbound":"dir0", "Eastbound":"dir1"} 
		};
	}

	_get() {}
	_getJSON() {}

	_getCachedDbPromise(db, version, store) {
		return idb.open(db, version, function(upgradeDb) {
			let store = upgradeDb.transaction.objectStore(store);
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

	getDbLineId(line) {
		return "90_Red_Line";
	}

	getDbHeadingRef(line, heading) {
		return this._schedByDbId[line][heading];
	}

	getAllTrainsList() {

	}

	getLineTimeTable(dbLineId, currentHeading) {
		let local = this;
		
		//return a promise for async work
		return new Promise(function(resolve, reject) {
			local._getCachedDbPromise('transit-db', 4, dbLineId)
			.then(function(db) {
				let tx = db.transaction(dbLineId);
				let routeStore = tx.objectStore(dbLineId);
				let sequence = routeStore.index(currentHeading);

				return sequence.getAll();
			}).then(function(stops) {
				resolve(stops);
			}).catch(function(error) {
				console.log("error: " + error);
				reject();
			});
		});
	}	
	

}

let _trainDataService = new TrainDataService;

export default _trainDataService;