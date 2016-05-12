import idb from 'idb';

console.log('opening idb');

var dbPromise = idb.open('transit-db', 4, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('system-graph', {keyPath: 'stnId'});
      upgradeDb.createObjectStore('arrivals', {keyPath: 'time'});
      upgradeDb.createObjectStore('stops', {keyPath: 'trainId'});
    case 1:
      upgradeDb.createObjectStore('trains', {keyPath: 'short_name'});
    case 2:
      upgradeDb.createObjectStore('90_Red_Line', {keyPath: 'stop_id'});
    case 3:
      var redLineStore = upgradeDb.transaction.objectStore('90_Red_Line');
      redLineStore.createIndex('dir0', 'dir0');
    case 4:
      redLineStore = upgradeDb.transaction.objectStore('90_Red_Line');
      redLineStore.createIndex('dir1', 'dir1');
  }
  
});

dbPromise.then(function(db) {
  var tx = db.transaction('trains', 'readwrite');
  var systemGraphStore = tx.objectStore('trains');

  systemGraphStore.put({
    short_name: 90, long_name: 'Red Line', directions: {
      3: "Westbound",
      1: "Eastbound"
    } 
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

dbPromise.then(function(db) {
  var tx = db.transaction('90_Red_Line', 'readwrite');
  var redLineStore = tx.objectStore('90_Red_Line');

  redLineStore.put({
      stop_name: "Portland Int'l Airport MAX Station",
      stop_id: 10579,
      dir0: 0,
      dir1: 2,
      parent_station: "",
      arrivals: {
        "297": 1234
      }
  });

  redLineStore.put({
      stop_name: "Gateway/NE 99th Ave Transit Center",
      stop_id: 8370,
      dir0: 1,
      dir1: 1,
      parent_station: "",
      arrivals: {
        "297": 1234
      }
  });

  redLineStore.put({
      stop_name: "Hollywood/NE 42nd Ave Transit Center",
      stop_id: 8373,
      dir0: 2,
      dir1: 0,
      parent_station: "",
      arrivals: {
        "297": 1234
      }
  });

  return tx.complete;
}).then(function() {
  console.log('90 Red Line Added');
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