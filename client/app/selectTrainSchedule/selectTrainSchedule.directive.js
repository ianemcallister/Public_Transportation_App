'use strict';

angular.module('transitApp')
  .directive('selectTrainSchedule', function () {
    return {
      templateUrl: 'app/selectTrainSchedule/selectTrainSchedule.html',
      restrict: 'EA',
      scope: {
        selectedLine: '=',
        timeTable: '='
      },
      link: function (scope, element, attrs) {},
      controller: selectTrainScheduleController,
 	  controllerAs: 'vm',
	  bindToController: true
    };

    selectTrainScheduleController.$injector = ['$scope', '$window', '$document', '$moment'];

    function selectTrainScheduleController($scope, $window, $document, $moment) {
    	var vm = this;

      //local variables
      var currentLine;
      var travelDirection = 0;  //default to 0

      //view model variables
      vm.selectedTime;
      vm.horizontalView = false;
      vm.stationsOnLine;
      vm.tripTimes;

      //local function
      function dateTimeToUnixTime(dateTime) {
        return Date.parse(dateTime);
      }

      function unixTimeToDateTime(unixTime) {
        return new Date(parseInt(unixTime)); 
      }

      function findClosestDepartureTime(currentTime) {
        //declare local variables
        /*
        var trip = 0;
        var ttTime;
        var foundDeparture = false;

        while (!foundDeparture) {

          //if initial departure on the trip is undefined or null, move to the next trip
          if( typeof vm.timeTable.service[travelDirection].timeTable[trip][0] !== 'undefined' &&
              typeof vm.timeTable.service[travelDirection].timeTable[trip][0] === 'number') {
              
                //with a valid trip set the first trip time
                ttTime = vm.timeTable.service[travelDirection].timeTable[trip][0];

                //log where we're at
                console.log('current: ' + currentTime + ' ttTime: ' + ttTime);

                //then check the current time against the inital trip time
                if(currentTime < ttTime) {

                  //if the current time is before the timetable time check the next trip
                  trip++;

                } else {
                  
                  //if it's not then return the departure time
                  var dateTime = unixTimeToDateTime(ttTime);
                  var departMoment = $moment(dateTime);

                  departMoment.format('h:mm a');
                  console.log('the depart moment is: ' + departMoment);
                  console.log(departMoment);
                  return dateTime.toTimeString();
                }

          } else {
            
            trip++;
          }

        }*/
        
        //currentTime = currentTime.toTimeString();
      }

      function onResize(width) {
        //show view based on size
        //if(width <= 845) vm.horizontalView = true;
        //if(width > 845) vm.horizontalView = false;
      }

      function onSelection(line) {
        //declare local variables
        var currentTime = new Date();
        var departureTimeFound = false;
        var i = 0;
        
        //get the current time
        currentTime.getTime();
        
        //which initial departure time is the current time closest to?
        //convert the current time to unix time for comparison
        //vm.selectedTime = findClosestDepartureTime(dateTimeToUnixTime(currentTime));

        //TODO: make this 12hour clock

        //when the user selects a line, build the time table
        console.log('You selected: ' + line + ' time: ' + vm.selectedTime);
        
        //lets see what the info looks like
        console.log(vm.timeTable);

        //set stations
        vm.stationsOnLine = vm.timeTable.service[travelDirection].stopSequence;

        //set the times
        var i = 0;
        vm.stationsOnLine.forEach(function(station) {
          //add times
          station['time'] = unixTimeToDateTime(vm.timeTable.service[travelDirection].timeTable[10][i]);
          i++;
        });

        //vm.stationsOnLine['times'] = vm.timeTable.service[travelDirection].timeTable[10];
        //vm.tripTimes = vm.timeTable.service[travelDirection].timeTable[10];
        
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
        //loadScheduleModel();
      });

      $scope.$watch('vm.selectedLine', function(newVal, oldVal) {
        if(newVal) {
          console.log('line selected');
          onSelection(newVal);
        }
      }, true);
      
    }

});
