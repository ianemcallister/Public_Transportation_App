'use strict';

describe('Component: TrainschedulesComponent', function () {

  // load the controller's module
  beforeEach(module('transitApp'));

  var TrainschedulesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TrainschedulesComponent = $componentController('TrainschedulesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
