import idb from 'idb';

export default function TrainDataService() {

}

TrainDataService.prototype._get = function(url) {
	return fetch(url);
};

TrainDataService.prototype._getJSON = function(url) {
	return this._get(url).then(function(response) {
		return response.json();
	});
};

TrainDataService.prototype._cachedDbExists = function(db, version, store) {

};

TrainDataService.prototype._getCachedDbPromise = function(db, version, store) {
	return idb.open(db, version, function(upgradeDb) {
		var store = upgradeDb.transaction.objectStore(store);
	});
};

TrainDataService.prototype.getAllTrainsList = function() {
	var dataService = this;

	//return a promise for async work
	return new Promise(function(resolve, reject) {

		dataService._getCachedDbPromise('transit-db', 4, 'trains')
		.then(function(db) {
			var store = db.transaction('trains').objectStore('trains');
			return store.getAll();
		})
		.then(function(trains) {
			resolve(trains);
		})
		.catch(function(error) {
			console.log("error: " + error);
			//TODO: if no luck with the cash get from the server

		});

		dataService._getJSON('api/download/allTrains.json')
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log('error: ' + error);
		});
		
	});
};

TrainDataService.prototype.getLineTimeTable = function(lineId, direction) {
	var dataService = this;
	var heading = "dir" + direction;

	//return a promise for async work
	return new Promise(function(resolve, reject) {
		dataService._getCachedDbPromise('transit-db', 4, lineId)
		.then(function(db) {
			var tx = db.transaction(lineId);
			var routeStore = tx.objectStore(lineId);
			var sequence = routeStore.index(heading);

			return sequence.getAll();
		}).then(function(stops) {
			//pass the stops back
			resolve(stops);
		}).catch(function(error) {
			console.log("error: " + error);
			reject();
		})
	});
};