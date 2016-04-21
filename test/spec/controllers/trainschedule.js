'use strict';

describe('Controller: TrainscheduleCtrl', function () {

  // load the controller's module
  beforeEach(module('transitApp'));

  var TrainscheduleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrainscheduleCtrl = $controller('TrainscheduleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TrainscheduleCtrl.awesomeThings.length).toBe(3);
  });
});
