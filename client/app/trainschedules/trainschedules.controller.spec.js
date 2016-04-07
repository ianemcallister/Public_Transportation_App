'use strict';

describe('Component: TrainschedulesComponent', function () {

  // load the controller's module
  beforeEach(module('transitApp'));

  var TrainschedulesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TrainschedulesComponent = $componentController('trainschedules', {
      $scope: scope
    });
  }));

  //overall requirnments
  it('should allow the user to select a train line', function() {
    expect(1).toEqual(1);
  });

  it('should display all stops for a selected line', function() {
    expect(1).toEqual(1);
  });

  //specfic requirnents
  describe('Allow the user to select a train line', function() {
    //declare testing variables
    //var listOfTrains;
    
    //what do we need to test?
    beforeEach(function() {
      //listOfTrains = {};
      //listOfTrains = new TrainschedulesComponent.trainList();
    });

    //testing points
    it('supply the user with a list of all MAX train options', function() {

      expect(scope.trainLines).toBeDefined();
    });

    it('list should include all five lines', function() {

      expect(scope.trainLines).toContain('Red Line');
      expect(scope.trainLines).toContain('Blue Line');
      expect(scope.trainLines).toContain('Yellow Line');
      expect(scope.trainLines).toContain('Green Line');
      expect(scope.trainLines).toContain('Orange Line');
    });

  });


  describe('Display all the stops on a given line', function() {
    //what do we need to test?
    beforeEach(function() {});

    //testing points
    it('if mobile portrait format a train schedule for mobile portraint', function() {
      expect(1).toEqual(1);
    });

    it('if mobile landscape format a train schedule for mobile landscape', function() {
      expect(1).toEqual(1);
    });

    it('if desktop format a train schedule for desktop', function() {
      expect(1).toEqual(1);
    });

    it('load the train schedule from JSON', function() {
      expect(1).toEqual(1);
    });

    it('if available, load the JSON train schedule from cache', function() {
      expect(1).toEqual(1);
    });

    it('if no cache is available, load the JSON from the server', function() {
      expect(1).toEqual(1);
    });

  });

});
