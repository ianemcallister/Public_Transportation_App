'use strict';

angular.module('transitApp')
  .directive('selectTrainSchedule', function () {
    return {
      templateUrl: 'app/selectTrainSchedule/selectTrainSchedule.html',
      restrict: 'EA',
      scope: {
        selectedLine: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch('vm.selectedLine', function(newVal, oldVal) {
          if(newVal) {
            console.log('line selected');
            onLineSelction(vm.selectedLine);
          }
        }, true);
      },
      controller: selectTrainScheduleController,
 	  controllerAs: 'vm',
	  bindToController: true
    };

    selectTrainScheduleController.$injector = ['$scope', '$window', '$document'];

    function selectTrainScheduleController($scope, $window, $document) {
    	var vm = this;

      //local variables
      var allTrainSchedules;
      var currentLine;

      //view model variables
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
      vm.stationsOnLine = [
        { heading: 'Cleveland Ave MAX Station', time: '4:01am' },
        { heading: 'Ruby Junction/E 197th Ave MAX Station', time: '4:08am' },
        { heading: 'E 122nd Ave MAX Station', time: '4:20am' },
        { heading: 'Gateway/NE 99th Ave Transit Center', time: '4:26am' }
      ]
      vm.horizontalView = true;
      vm.selectedTime;

      //local function
      function onResize(width) {
        //show view based on size
        if(width <= 845) vm.horizontalView = true;
        if(width > 845) vm.horizontalView = false;
      }

      function loadScheduleModel() {
        //load the JSON from the service
        allTrainSchedules = {
          'MAX Red Line': {
            'headings': [],
            trips: [
              [,,,,,,,,,,,'3:35am','3:38am','3:50am','4:00am'],
              [,,,,,,,,,,,'4:10am','4:12am','4:21am','4:30am']
            ]
          },
          'MAX Blue Line': {},
          'MAX Yellow Line': {},
          'MAX Green Line': {},
          'MAX Orange Line': {}
        };

      }

      function onLineSelction(selectedLine) {
        console.log('chose a line');
        //build an array from the selected line selected
        currentLine = allTrainSchedules[selectedLine].headings;
        //default to the earliest time
        currentTrip = allTrainSchedules[selectedLine].trips[0];
      }

      //view model functions
      $scope.timeSelected = function() {
        //when a time is selected grab the proper array
        currentTrip = allTrainSchedules[selectedLine].trips[0];
      }

      //watchers
      angular.element($window).bind('resize', function() {
        onResize($window.innerWidth);
        $scope.$apply();
      });

      angular.element($document).ready(function() {
        //set the table based on the screen size
        onResize($window.innerWidth);
        //load json
        loadScheduleModel();
      });
      
    }

  });
