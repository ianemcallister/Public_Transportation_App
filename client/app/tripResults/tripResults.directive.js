'use strict';

angular.module('transitApp')
  .directive('tripResults', function () {
    return {
      templateUrl: 'app/tripResults/tripResults.html',
      restrict: 'EA',
      scope: {
      	endpointsDefined: "="
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


//declare viewmodel variables
$scope.helpfulMessage = 'Please Select Starting and Ending Stations...';

//watchers
$scope.$watch('vm.endpointsDefined', function(newVal, oldVal) {
	if(newVal) {
	  //
	}
}, true);

//actions
console.log(vm.endpointsDefined);

}
