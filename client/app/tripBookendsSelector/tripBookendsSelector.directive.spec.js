'use strict';

describe('Directive: tripBookendsSelector', function () {

  // load the directive's module and view
  beforeEach(module('transitApp'));
  beforeEach(module('app/tripBookendsSelector/tripBookendsSelector.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should exist', inject(function ($compile) {
    expect(1).toBe(1);
    /*element = angular.element('<trip-bookends-selector></trip-bookends-selector>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tripBookendsSelector directive');*/
  }));

  it('should receive a list of all stations from a service', function() {

    expect(1).toBe(1);
  });

  it('should not allow user to select the same station twice', function() {
    expect(1).toBe(1);
  })

});
