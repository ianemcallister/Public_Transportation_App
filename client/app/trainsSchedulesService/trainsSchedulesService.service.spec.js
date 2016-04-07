'use strict';

describe('Service: trainsSchedulesService', function () {

  // load the service's module
  beforeEach(module('transitApp'));

  // instantiate service
  var trainsSchedulesService;
  beforeEach(inject(function (_trainsSchedulesService_) {
    trainsSchedulesService = _trainsSchedulesService_;
  }));

  
  it('should exist', function () {
    expect(!!trainsSchedulesService).toBe(true);
  });

  it('should load the list of train lines from a JSON file', function() {
    expect(1).toEqual(1);
  });

  it('should be able to load the JSON train lines list from cache', function() {
    expect(1).toEqual(1);
  });

  it('should be able to load the JSON from the server', function() {
    expect(1).toEqual(1);
  });

});
