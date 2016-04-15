'use strict';

angular.module('transitApp')
  .directive('tripResults', function () {
    return {
      templateUrl: 'app/tripResults/tripResults.html',
      restrict: 'EA',
      scope: {
      	endpointsDefined: "=",
        tripOptions: '='
      },
      link: function (scope, element, attrs) {
      },
      controller: tripResultsController,
 	  controllerAs: 'vm',
	  bindToController: true
    };
  });

tripResultsController.$injector = ['$scope'];

function tripResultsController($scope) {
  var vm = this;
  
  //declare local variables
  vm.tripsAvailable = false;
  vm.endpointsDefined = false;

  //declare viewmodel variables
  $scope.helpfulMessage = 'Please Select Starting and Ending Stations...';

  //watchers
  $scope.$watch('vm.endpointsDefined', function(newVal, oldVal) {
  	if(newVal) {
  	  //update the helpful message
      $scope.helpfulMessage = 'Loading the trips now';
  	}
  });

  $scope.$watch('vm.tripOptions', function(newVal, oldVal) {
    
    //when the trip is available show the results
    if(typeof vm.tripOptions === 'object') {
      vm.tripsAvailable = true;
      console.log('vm.tripOptions is an object');
      console.log('vm.tripsAvailable is ' + vm.tripsAvailable);
    }

  });

  //actions
  console.log('were the endpoints defined?: ' + vm.endpointsDefined);

}
