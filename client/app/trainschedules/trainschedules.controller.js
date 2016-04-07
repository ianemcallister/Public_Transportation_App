'use strict';

/*(function(){

class TrainschedulesComponent {
  //private fields

  //public properties

  //ctor*/
  /*@ngInject*/
  /*constructor() {
    this.message = 'Hello';
  }

  //public functions
  trainList() {
  	this.red = true;
  	this.blue = true;
  	this.yellow = true;
  	this.green = true;
  	this.orange = true;
  }

  //private functions

}*/



angular
	.module('transitApp')
  	.component('trainschedules', {
	    templateUrl: 'app/trainschedules/trainschedules.html',
	    controller: TrainschedulesComponent
	  });

TrainschedulesComponent.$injector = ['$scope'];

function TrainschedulesComponent($scope) {

	//local variables
	
	//view model variables
	//TODO: update this via a service instead
	$scope.trainLines = [
		'MAX Red Line',
		'MAX Blue Line',
		'MAX Yellow Line',
		'MAX Green Line',
		'MAX Orange Line',
	];
	//local methods
	//view model methods
	$scope.validLineSelected = function() {
		$scope.selectedLine = $scope.tempLine;
	}
	//actions
	
}

/*
})();*/
