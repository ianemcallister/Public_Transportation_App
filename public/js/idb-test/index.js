import idb from 'idb';

console.log('opening idb');

var dbPromise = idb.open('transit-db', 2, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('system-graph', {keyPath: 'stnId'});
      upgradeDb.createObjectStore('arrivals', {keyPath: 'time'});
      upgradeDb.createObjectStore('stops', {keyPath: 'trainId'});
    case 1:
      upgradeDb.createObjectStore('trains', {keyPath: 'short_name'});
  }
  
});

dbPromise.then(function(db) {
  var tx = db.transaction('trains', 'readwrite');
  var systemGraphStore = tx.objectStore('trains');

  systemGraphStore.put({
    short_name: 90, long_name: 'Red Line' 
  });

  systemGraphStore.put({
    short_name: 100, long_name: 'Green Line' 
  });

  systemGraphStore.put({
    short_name: 190, long_name: 'Blue Line' 
  });

  systemGraphStore.put({
    short_name: 200, long_name: 'Yellow Line' 
  });

  systemGraphStore.put({
    short_name: 290, long_name: 'Orange Line' 
  });

  return tx.complete;
}).then(function() {
  console.log('stations added');
});

/*
var dbPromise = idb.open('test-db', 4, function(upgradeDb) {
  var keyValStore = upgradeDb.createObjectStore('keyval');
  keyValStore.put("world", "hello");
  upgradeDb.createObjectStore('people', {keyPath: 'name'});
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  // TODO: in the keyval store, set
  // "favoriteAnimal" to your favourite animal
  // eg "cat" or "dog"
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favorite Animal: cat to keyval');
});
*/