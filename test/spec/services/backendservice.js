'use strict';

describe('Service: backendService', function () {

  // load the service's module
  beforeEach(module('transitApp'));

  // instantiate service
  var backendService;
  beforeEach(inject(function (_backendService_) {
    backendService = _backendService_;
  }));

  it('should do something', function () {
    expect(!!backendService).toBe(true);
  });

});
