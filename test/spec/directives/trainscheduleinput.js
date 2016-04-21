'use strict';

describe('Directive: trainScheduleInput', function () {

  // load the directive's module
  beforeEach(module('transitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<train-schedule-input></train-schedule-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the trainScheduleInput directive');
  }));
});
