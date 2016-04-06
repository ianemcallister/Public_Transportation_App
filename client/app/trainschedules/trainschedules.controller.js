'use strict';
(function(){

class TrainschedulesComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('transitApp')
  .component('trainschedules', {
    templateUrl: 'app/trainschedules/trainschedules.html',
    controller: TrainschedulesComponent
  });

})();
