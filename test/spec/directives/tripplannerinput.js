'use strict';

describe('Directive: tripPlannerInput', function () {

  // load the directive's module
  beforeEach(module('transitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<trip-planner-input></trip-planner-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tripPlannerInput directive');
  }));
});
