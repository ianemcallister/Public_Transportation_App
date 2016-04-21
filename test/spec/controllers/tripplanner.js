'use strict';

describe('Controller: TripplannerCtrl', function () {

  // load the controller's module
  beforeEach(module('transitApp'));

  var TripplannerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TripplannerCtrl = $controller('TripplannerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TripplannerCtrl.awesomeThings.length).toBe(3);
  });
});
