'use strict';
(function(){

class TrainschedulesComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('transitAppApp')
  .component('trainschedules', {
    templateUrl: 'app/trainschedules/trainschedules.html',
    controller: TrainschedulesComponent
  });

})();
