'use strict';

describe('Component: TripplannerComponent', function () {

  // load the controller's module
  beforeEach(module('transitApp'));

  var TripplannerComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TripplannerComponent = $componentController('TripplannerComponent', {
      $scope: scope
    });
  }));

  it('should load a list of available stations to travel to/from', function () {
    expect(1).toEqual(1);
  });
});
