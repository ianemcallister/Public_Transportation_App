'use strict';
(function(){

class TripplannerComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('transitApp')
  .component('tripplanner', {
    templateUrl: 'app/tripplanner/tripplanner.html',
    controller: TripplannerComponent
  });

})();
