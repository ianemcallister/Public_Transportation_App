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

if ('serviceWorker' in navigator) {
  console.log('good for service workers');
} else {
  console.log("this browser does NOT support service worker");
}

/*navigator.serviceWorker.register('/sw.js')
.then(function(reg) {
  var serviceWorker;

  if (!navigator.serviceWorker.controller) {
    return;
  }

  if (reg.waiting) {
    indexController._updateReady(reg.waiting);
    return;
  }

  if (reg.installing) {
    indexController._trackInstalling(reg.installing);
    return;
  }

})
.catch(function(error) {
  console.log('ServiceWorker registration failed: ', error);
});*/

angular.module('transitApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
