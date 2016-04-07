'use strict';

angular.module('transitApp')
  .directive('selectTrainSchedule', function () {
    return {
      templateUrl: 'app/selectTrainSchedule/selectTrainSchedule.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: selectTrainScheduleController,
 	  controllerAs: 'vm',
	  bindToController: true
    };

    selectTrainScheduleController.$injector = ['$scope', '$window'];

    function selectTrainScheduleController($scope, $window) {
    	var vm = this;

      vm.lineSchedule = {
        stations: [
        'Cleveland Ave MAX Station',
        'Ruby Junction/E 197th Ave MAX Station',
        'E 122nd Ave MAX Station'/*,
        'Gateway/NE 99th Ave Transit Center',
        'Hollywood/NE 42nd Ave Transit Center',
        'Rose Quarter Transit Center',
        'Pioneer Square North MAX Station',
        'Providence Park MAX Station',
        'Washington Park MAX Station'*/
        ],
        stop1: [
        '4:01am',
        '4:08am',
        '4:20am'/*,
        '4:26am',
        '4:33am',
        '4:41am',
        '4:51am',
        '4:55am',
        '5:02am'*/
        ]
      };
      vm.times = [
        '4:01am',
        '4:08am',
        '4:20am',
        '4:26am',
        '4:33am',
        '4:41am',
        '4:51am',
        '4:55am',
        '5:02am'
      ];
      vm.horizontalView = true;

      //local function
      function onResize(width) {
        //show view based on size
        if(width <= 845) vm.horizontalView = true;
        if(width > 845) vm.horizontalView = false;
        $scope.$apply();
      }

      //watchers
      angular.element($window).bind('resize', function() {
        onResize($window.innerWidth);
      });

      console.log(vm.deviceSize);
    }

  });
