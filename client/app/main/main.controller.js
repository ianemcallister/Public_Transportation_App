'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket/*, swController*/) {
    this.$http = $http;
    this.socket = socket;
    this.awesomeThings = [];

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  $onInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

if(navigator.serviceWorker) console.log('service workers are valid in this browser.');
else console.log('Your browser doesn\'t support service workers.');

navigator.serviceWorker.register('app/sw/index.js').then(function() {
  console.log('Service Worker registration worked!');
  

/*  fetch('../../assets/JSON/max-train-lines.json')
  .then(function(result) {
    console.log('got the json');
    console.log(result);
  });*/

}).catch(function(error) {
  console.log('Service Worker registration failed! ' + error);
});

angular.module('transitApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
