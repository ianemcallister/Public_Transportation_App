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

    selectTrainScheduleController.$injector = ['$scope', '$window', '$document', '$moment', 'dynamicElement'];

    function selectTrainScheduleController($scope, $window, $document, $moment, dynamicElement) {
    	var vm = this;

      //local variables
      var currentLine;
      var travelDirection = 0;  //default to 0
      var DynamicElement = dynamicElement;

      //view model variables
      vm.selectedTime;
      vm.lineWasSelected = false;
      vm.stationsOnLine;
      vm.tripTimes;
      vm.firstDepartureTimes = [];
      vm.directionButtons = { 
        1: new DynamicElement(['col-xs-5', 'col-sm-5', 'btn', {'btn-success': false}, {'btn-default': true}, {'disabled': true}, 'btn-block' ]), 
        2: new DynamicElement(['col-xs-5', 'col-sm-5', 'btn', {'btn-success': true}, {'btn-default': false}, {'disabled': false}, 'btn-block']) 
      };
      vm.directionHeadsign = { current: '', opposing: ''};

      //local function
      function dateTimeToUnixTime(dateTime) {
        return Date.parse(dateTime);
      }

      function unixTimeToDateTime(unixTime) {
        return new Date(parseInt(unixTime)); 
      }

      function dateTimeToMomentTime(dateTime) {
        var a = moment(dateTime);

      }

      function unixTimeToMomentTime(unixTime) {
        var time = moment(unixTime);
        return time.format('LT');
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

      function flipDirectionButtons() {
        vm.directionButtons[1].flipActiveBtn();
        vm.directionButtons[2].flipActiveBtn();
      }

      function getStopSequence(currentTravelDirection) {
        return vm.timeTable.service[currentTravelDirection].stopSequence;
      }

      function getHeadsigns(currentTravelDirection) {
        //declare local
        var opposingDirection = Math.abs(travelDirection - 1);

        return { 
          current: vm.timeTable.service[travelDirection].headsign, 
          opposing: vm.timeTable.service[opposingDirection].headsign
        };

      }

      function getLineTimes(currentTravelDirection) {
        //declare local variable
        var i = 0;
        //run through all 
        vm.stationsOnLine.forEach(function(station) {
          //add times
          station['time'] = unixTimeToDateTime(vm.timeTable.service[travelDirection].timeTable[10][i]);
          i++;
        });
      }

      function getFirstDepartureTimes() {
        var noOfTrips = vm.timeTable.service[travelDirection].timeTable.length;
      
        for(var i = 0; i < noOfTrips; i++) {
          
          if(typeof vm.timeTable.service[travelDirection].timeTable[i][0] === 'number') {

            vm.firstDepartureTimes.push(unixTimeToMomentTime(vm.timeTable.service[travelDirection].timeTable[i][0]));
          }
          
        }

        return vm.firstDepartureTimes[0];

      }

      function onLineSelection(line) {
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
        
        //lets see what the info looks like
        console.log(vm.timeTable);

        //set stations
        vm.stationsOnLine = getStopSequence(travelDirection);

        //set the headsign
        vm.directionHeadsign = getHeadsigns(travelDirection);

        //set trip departuer times
        getLineTimes();

        //get each trip's first departure time
        vm.selectedTime = getFirstDepartureTimes();

        console.log('You selected: ' + line + ' time: ' + vm.selectedTime);

        //vm.stationsOnLine['times'] = vm.timeTable.service[travelDirection].timeTable[10];
        //vm.tripTimes = vm.timeTable.service[travelDirection].timeTable[10];
        
      }

      function onDirectionChange(newDirection) {

        //set stations
        vm.stationsOnLine = getStopSequence(newDirection);

        //set the headsign
        vm.directionHeadsign = getHeadsigns(newDirection);

        //get the new travel times
        getLineTimes();

        //flip the buttons
        flipDirectionButtons();
      }

      //view model functions
      $scope.timeSelected = function() {
        //when a time is selected grab the proper array
        currentTrip = allTrainSchedules[selectedLine].trips[0];
      }

      $scope.changeDirectionTo = function(value) {
        //reset travel direction
        travelDirection = value;

        onDirectionChange(travelDirection);
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
          vm.lineWasSelected = true;
          
          onLineSelection(newVal);
        }
      }, true);
      
    }

});
