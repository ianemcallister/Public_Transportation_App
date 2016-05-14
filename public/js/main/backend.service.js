import idb from 'idb';

class BackendService {
	constructor() {
		this.dbVersion = 1;
		this.dbName = 'TriMet';
	}

	_get(url) {
		return fetch(url);
	}

	_getJSON(url) {
		return this._get(url).then(function(response) {
			return response.json();
		});
	}

	_getCachedDbPromise() {
		let version = this.dbVerion;
		let dbName = this.dbName;
		return idb.open(dbName, version, function(upgradeDb) {
		  switch(upgradeDb.oldVersion) {
		    case 0:
		      upgradeDb.createObjectStore('trains', {keyPath: 'short_name'});
		      upgradeDb.createObjectStore('90_Red_Line_Eastbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('90_Red_Line_Westbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('100_Blue_Line_Eastbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('100_Blue_Line_Westbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('190_Yellow_Line_Northbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('190_Yellow_Line_Southbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('200_Green_Line_Eastbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('200_Green_Line_Westbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('290_Orange_Line_Northbound', {keyPath: 'seqId'});
		      upgradeDb.createObjectStore('290_Orange_Line_Southbound', {keyPath: 'seqId'});
		  }
		  
		});
	}

	_openDbStore() {
		let version = this.dbVersion;
		let dbName = this.dbName;

		return this._getCachedDbPromise(dbName, version);
	}

	_readDbStore() {}
	
	_updateDbStore(store, seqModel) {
		let backend = this;
		let dbPromise = backend._getCachedDbPromise();

		dbPromise.then(function(db) {
			let tx = db.transaction(store, 'readwrite');
			let theStore = tx.objectStore(store);

			Object.keys(seqModel).forEach(function(stop) {
				
				if(stop !== 'direction') {
					
					//build the model
					let storeObject = {
						seqId: stop,
						stop_id: seqModel[stop].stop_id,
						stop_name: seqModel[stop].stop_name,
						arrivals: seqModel[stop].arrivals,
						parent_station: seqModel[stop].parent_station
					}
					
					//add it to the store
					console.log(storeObject);
					theStore.put(storeObject);
				}

			});

		});
	}	

	_deleteDbStore() {}

	_buildSequences(lineData) {
		let backend = this;
		let returnObject = {};

		//build sequence names
		let short_name = lineData.line.short_name;
		let long_name = lineData.line.long_name;
		let headings = [];

		//add the two heading names to the array
		Object.keys(lineData.line.directions).forEach(function(num) {
			headings.push(lineData.line.directions[num]);
		});

		//define the headings
		let nameOne = short_name + '_' + long_name.replace(" ", "_") + "_" + headings[0];
		let nameTwo = short_name + '_' + long_name.replace(" ", "_") + "_" + headings[1];
		
		//add them to the return object
		returnObject[nameOne] = {};
		returnObject[nameTwo] = {};

		Object.keys(returnObject).forEach(function(heading) {
			let currentHeading = heading.split("_")[3];

			for(var i = 1; i <= 2; i++) {
				let name = "sequence" + i;
				if(currentHeading == lineData[name].direction)
					returnObject[heading] = lineData[name];
			}
		});

		return returnObject;
	}

	_addANewDbStore(storeName, storeModel) {
		let backend = this;
		console.log(storeName, storeModel);

		//bump the version
		//backend.dbVersion += 1;
		let dbName = backend.dbName;
		let dbVersion = backend.dbVersion

		let dbPromise = idb.open(dbName, dbVersion, function(upgradeDb) {
			upgradeDb.createObjectStore(storeName, {keyPath: 'seqId'});
		});

		dbPromise.then(function(db) {
		
			var tx = db.transaction(storeName, 'readwrite');
  			var store = tx.objectStore(storeName);

  			Object.keys(seqModel).forEach(function(stop) {
				
				if(stop !== 'direction') {
					
					//build the model
					let storeObject = {
						seqId: stop,
						stop_id: seqModel[stop].stop_id,
						stop_name: seqModel[stop].stop_name,
						arrivals: seqModel[stop].arrivals,
						parent_station: seqModel[stop].parent_station
					}
					
					//add it to the store
					console.log(storeObject);
					theStore.put(storeObject);
				}

			});
			return tx.complete;
		})
		.then(function() {
			console.log("added " + storeName + ' to the db');
		})
		.catch(function(error) {
			console.log('error: ' + error);
		});	
	}

	_seperateSchedFile(trainLineObject) {
		let backend = this;
		let bothSequences = {};

		//get both train directions
		bothSequences = backend._buildSequences(trainLineObject);

		//build one sequence, then the other
		Object.keys(bothSequences).forEach(function(sequence) {

			backend._updateDbStore(sequence, bothSequences[sequence]);
		});
	}

	downloadATrainSched(url) {
		this._getJSON(url)
		.then(function(response) {
			console.log(response);
		});	
	}

	updateADbStore(url) {
		let backend = this;

		this._getJSON(url)
		.then(function(response) {
			
			//if this is a schedule file, unpack it.  Otherwise it's a list of files, map and unpack them
			if(typeof response.line !== 'undefined') backend._seperateSchedFile(response);
			//else.....
		});
	}

	readLineSequence(dbStoreId) {
		let backend = this;

		let dbPromise = backend._openDbStore();
		return new Promise(function(resolve, reject) {
			dbPromise.then(function(db) {
				let tx = db.transaction(dbStoreId);
				let store = tx.objectStore(dbStoreId);

				return store.getAll();
			}).then(function(stops) {
				resolve(stops);
			}).catch(function(error) {
				console.log('error: ' + error);
				reject();
			});
		})
	}

	getSchedTrainsList() {

		return new Promise(function(resolve, reject) {
			return 'good';
		}).then(function(response) {
			resolve(response);
		}).catch(function(error) {
			console.log("error: " + error);
		})

	}
}

let _backendService = new BackendService;

export default _backendService;