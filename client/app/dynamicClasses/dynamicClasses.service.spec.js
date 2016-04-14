'use strict';

describe('Service: dynamicClasses', function () {

  // load the service's module
  beforeEach(module('transitApp.dynamicClasses'));

  // instantiate service
  var dynamicClasses;
  beforeEach(inject(function (_dynamicClasses_) {
    dynamicClasses = _dynamicClasses_;
  }));

  it('should do something', function () {
    expect(!!dynamicClasses).toBe(true);
  });

});
