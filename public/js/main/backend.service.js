import idb from 'idb';

class BackendService {
	constructor() {
		this.dbVersion = 4;
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
			if(processReq == 'add')
				upgradeDb.createObjectStore(store, {keyPath: keyPath});

			//TODO ADD AN UPDATE PROCESS
		});
	}

	_createDbContent() {}
	_readDbContent() {}
	_updateDbContent(db, store, newValues) {
		//TODO PULL THIS OUT LATER
		console.log(db, store, newValues);
		
		let dbPromise = this._getCachedDbPromise(db, this.dbVersion, store);

		dbPromise.then(function(db) {
			let tx = db.transaction(store, 'readwrite');
			let selectedstore = tx.objectStore(store);


		});
	}
	_deleteDbContent() {}

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
					let dbPromise = backend._getCachedDbPromise('transit-db', backend.dbVersion, sequence, "add", 'seqId');
					
					//update an existing store
				});
			}
			
			//console.log(bothSequences);

			//backend._updateDbContent(db, store, response);
		});
	}


}

let _backendService = new BackendService;

export default _backendService;