
'use strict';

angular.module('transitApp')
  .directive('tripBookendsSelector', function () {
    return {
      templateUrl: 'app/tripBookendsSelector/tripBookendsSelector.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	//console.log(scope, element, attrs);
      },
      controller: tripBookendsSelectorController,
 	    controllerAs: 'vm',
	    bindToController: true
    };

    tripBookendsSelectorController.$injector = []

    function tripBookendsSelectorController() {
    	var vm = this;

    	//TODO: replace this with a service later
    	vm.allStations = [
    		'Expo Center',
    		'Union Station',
    		'PSU',
    		'Milwaukie',
    		'Beaverton',
    		'Hillsboro',
    		'Rose Quarter',
    		'Pioneer Square',
    		'Gateway',
    		'Airport',
    		'Clackamas Town Center',
    		'Gresham'
    	];

    }
  });
