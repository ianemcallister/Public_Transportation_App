import idb from 'idb';

class BackendService {
	constructor() {
		this.dbVersion = 9;
		this.dbName = 'transit-db';
	}

	_get(url) {
		return fetch(url);
	}

	_getJSON(url) {
		return this._get(url).then(function(response) {
			return response.json();
		});
	}

	_getCachedDbPromise(db, version, store, processReq, keyPath) {
		return idb.open(db, version, function(upgradeDb) {
			//let store = upgradeDb.transaction.objectStore(store);
			if(processReq == 'create') upgradeDb.createObjectStore(store, {keyPath: keyPath});
			//if(processReq == 'read') {}
			//if(processReq == 'update') {}
			if(processReq == 'delete') upgradeDb.deleteObjectStore(store);
			//TODO ADD AN UPDATE PROCESS
		});
	}

	_createDbStore(store, keyPath) {
		let version = this.dbVersion;
		let dbName = this.dbName;

		return this._getCachedDbPromise(dbName, version, store, "create", keyPath);
	}

	_openDbStore() {
		let version = this.dbVersion;
		let dbName = this.dbName;

		return this._getCachedDbPromise(dbName, version);
	}

	_readDbStore() {}
	
	_updateDbStore(dbPromise, store, seqModel) {
		//make additions to the store
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
					theStore.put(storeObject);
				}

			});

			console.log(store + " updated");
		});
	}

	_deleteDbStore() {}

	//add a new store here

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

	downloadATrainSched(url) {
		this._getJSON(url)
		.then(function(response) {
			console.log(response);
		});	
	}

	updateADbStore(url, db, store) {
		let backend = this;

		this._getJSON(url)
		.then(function(response) {
			let bothSequences = {};
			
			//is this a schedule file?
			if(typeof response.line !== 'undefined') {
				
				//if so get both directions
				bothSequences = backend._buildSequences(response);
				
				//build one sequence, then the other
				Object.keys(bothSequences).forEach(function(sequence) {
					//console.log(sequence);

					//add a new store
					if(false) {
						let dbPromise = backend._createDbStore(sequence, 'seqId');
						backend._updateDbStore(dbPromise, sequence, bothSequences[sequence]);
					}

					//update an existing store
					if(true) {
						let dbPromise = backend._openDbStore();
						backend._updateDbStore(dbPromise, sequence, bothSequences[sequence]);
					}
				});
			}
			
			//console.log(bothSequences);

			//backend._updateDbContent(db, store, response);
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
}

let _backendService = new BackendService;

export default _backendService;