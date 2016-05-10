import idb from 'idb';

export default function TrainDataService() {

	console.log('in the train data service');
}

TrainDataService.prototype.get = function(url) {
	return fetch(url);
};

TrainDataService.prototype.getJSON = function(url) {
	return get(url).then(function(response) {
		return response.json();
	});
};

TrainDataService.prototype.cachedDbExists = function(db, version, store) {
	
};

TrainDataService.prototype.getCachedDbPromise = function(db, version, store) {
	return idb.open(db, version, function(upgradeDb) {
		var store = upgradeDb.transaction.objectStore(store);
	});
};