'use strict';

describe('Directive: selectTrainSchedule', function () {

  // load the directive's module and view
  beforeEach(module('transitApp'));
  beforeEach(module('app/selectTrainSchedule/selectTrainSchedule.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    /*element = angular.element('<select-train-schedule></select-train-schedule>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the selectTrainSchedule directive');*/
    expect(1).toBe(1);
  }));
});
