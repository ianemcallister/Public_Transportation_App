
'use strict';

angular.module('transitApp')
  .directive('tripBookendsSelector', function () {
    return {
      templateUrl: 'app/tripBookendsSelector/tripBookendsSelector.html',
      restrict: 'EA',
      scope: {
        endpointsDefined: '=',
        tripOptions: '='
      },
      link: function (scope, element, attrs) {
      	//console.log(scope, element, attrs);
      },
      controller: tripBookendsSelectorController,
 	    controllerAs: 'vm',
	    bindToController: true
    };

    tripBookendsSelectorController.$injector = ['$scope', 'dynamicElement', 'trainsSchedulesService']

    function tripBookendsSelectorController($scope, dynamicElement, trainsSchedulesService) {
    	var vm = this;

      //local variables
      var oldStationValues = { start: '', end: '' };
      var stationsHash = {};
      var DynamicElement = dynamicElement;
      var APIInterface = trainsSchedulesService;

      //view model variables
      $scope.tripStations = { 
        start: { name: '', id: 0, valid: false, changed: false }, 
        end: { name: '', id: 0, valid: false, changed: false  } 
      };
      $scope.bookenInput = {
        label: {
          start: new DynamicElement([ 'form-control-label',
            { 'has-success': false }
          ]),
          end: new DynamicElement([ 'form-control-label',
            { 'has-success': false }
          ])
        },
        input: {
          start: new DynamicElement([
            'col-xs-12','col-sm-12','col-md-12','col-lg-12','btn-block', 
            { 'form-control': true }
          ]),
          end: new DynamicElement([
            'col-xs-12','col-sm-12','col-md-12','col-lg-12','btn-block',
            { 'form-control': true }
          ])  
        }
        
      };
      $scope.submitBtn = new DynamicElement([
        'btn',
        { 'disabled': true },
        { 'btn-warning': false },
        { 'btn-success': false }
      ]);
      

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

      //local functions
      function buildStationsHash() {

        //loop through each element in the array
        vm.allStations.forEach(function(station) {
          stationsHash[station] = false;
        });

      }

      function rebuildStationsList(oldstation) {
        //declare local variables
        var newStationList = [];

        //if an old station was passed in make sure it's set to false
        if(typeof oldstation !== 'undefined') {
          
          stationsHash[oldstation] = false;
        }
        
        //rebuild the station list from the hash
        Object.keys(stationsHash).forEach(function(station) {

          if(!stationsHash[station]) newStationList.push(station);

        });

        //resave the stations list
        vm.allStations = newStationList;

      }

      function updateSubmissionBtn(stations) {
        
        //if both stations are valid
        if(stations.start.valid && stations.end.valid) {
          
          //unlock the button
          $scope.submitBtn.flipActiveBtn();
          $scope.submitBtn.clickable = true;

          //update the message
          $scope.submitBtn.message = 'Search This Route';
          return;
        }

        if(stations.start.valid || stations.end.valid) {
          
          //make sure the button is locked
          if($scope.submitBtn.clickable) {
            $scope.submitBtn.flipActiveBtn();
            $scope.submitBtn.clickable = false;
          }

          //update the message
          $scope.submitBtn.message = 'And The Other...';
          
        } else {

          
          //make sure button is locked
          if($scope.submitBtn.clickable) {
            $scope.submitBtn.flipActiveBtn();
            $scope.submitBtn.clickable = false;
          }
          
          //update the message
          $scope.submitBtn.message = 'No Stations Selected';
        }

      }

      //view model functions
      $scope.bookendUpdated = function() {
        //define local variables
        var oldstation;

        //loop through the endpoints and check for changes
        Object.keys($scope.tripStations).forEach(function(endpoint) {

          //if the value changed..
          if($scope.tripStations[endpoint].name !== oldStationValues[endpoint]) {
            
            //declare local
            var stationName = $scope.tripStations[endpoint].name;

            //check if it is a valid station
            if(typeof stationsHash[stationName] !== 'undefined') {
              
              //save the station selection status as true
              stationsHash[stationName] = true;

              //update the stations model
              $scope.tripStations[endpoint].valid = true;

            } else {
              //re add the station to the list of available
              oldstation = oldStationValues[endpoint]

              //update the stations model
              $scope.tripStations[endpoint].valid = false;

            }

            //add validation CSS to input
            updateSubmissionBtn($scope.tripStations);

            //rebuild the stations that can be selected
            rebuildStationsList(oldstation);
          }

          //set the old value to the current value
          oldStationValues[endpoint] = $scope.tripStations[endpoint].name;
        
        });

      }

      $scope.submitBookends = function() {
        //declare local variables
        var departFrom = $scope.tripStations.start.id || 3214;
        var arriveAt = $scope.tripStations.end.id || 9232;

        //throw the endpointsDefined flag
        vm.endpointsDefined = true;

        //contact the API
        APIInterface.getARidePlan(departFrom, arriveAt)
        .then(function(result) {
          
          //when the response comes back, pass it to the page controller
          vm.tripOptions = result;
          $scope.$apply();

          //print it for later analysis
          console.log(result);
        })
        .catch(function(error) {
          console.log("Error: " + error);
        })

      }

      //WATCHERS
      $scope.$watch('tripStations.start.valid', function(newVal, oldVal) {
        
        if(newVal) {
          $scope.bookenInput.label.start.successfulInput();
          $scope.bookenInput.input.start.successfulInput();
        } else {
          $scope.bookenInput.label.start.defaultInput();
          $scope.bookenInput.input.start.defaultInput();
        }

      });

      $scope.$watch('tripStations.end.valid', function(newVal, oldVal) {
        
        if(newVal) {
          $scope.bookenInput.label.end.successfulInput();
          $scope.bookenInput.input.end.successfulInput();
        } else {
          $scope.bookenInput.label.end.defaultInput();
          $scope.bookenInput.input.end.defaultInput();
        }

      });

      //ACTIONS
      //set the defulat message
      updateSubmissionBtn($scope.tripStations);

      //track the stations being used
      buildStationsHash();

      console.log('tripOptions= ' + vm.tripOptions);
    }
  });
