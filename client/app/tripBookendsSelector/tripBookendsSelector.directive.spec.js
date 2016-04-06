/*'use strict';

describe('Directive: tripBookendsSelector', function () {

  // load the directive's module and view
  beforeEach(module('transitApp.tripBookendsSelector'));
  beforeEach(module('app/tripBookendsSelector/tripBookendsSelector.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<trip-bookends-selector></trip-bookends-selector>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tripBookendsSelector directive');
  }));
});
*/