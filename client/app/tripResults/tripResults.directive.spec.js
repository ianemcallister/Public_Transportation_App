'use strict';

describe('Directive: tripResults', function () {

  // load the directive's module and view
  beforeEach(module('transitApp.tripResults'));
  beforeEach(module('app/tripResults/tripResults.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<trip-results></trip-results>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tripResults directive');
  }));
});
