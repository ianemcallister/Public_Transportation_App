'use strict';
(function(){

class TripplannerComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('transitAppApp')
  .component('tripplanner', {
    templateUrl: 'app/tripplanner/tripplanner.html',
    controller: TripplannerComponent
  });

})();
