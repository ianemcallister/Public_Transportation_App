'use strict';

describe('Directive: trainScheduleResult', function () {

  // load the directive's module
  beforeEach(module('transitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<train-schedule-result></train-schedule-result>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the trainScheduleResult directive');
  }));
});
