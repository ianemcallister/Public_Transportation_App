'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var rideCtrlStub = {
  index: 'rideCtrl.index',
  show: 'rideCtrl.show',
  create: 'rideCtrl.create',
  update: 'rideCtrl.update',
  destroy: 'rideCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var rideIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './ride.controller': rideCtrlStub
});

describe('Ride API Router:', function() {

  it('should return an express router instance', function() {
    rideIndex.should.equal(routerStub);
  });

  describe('GET /api/rides', function() {

    it('should route to ride.controller.index', function() {
      routerStub.get
        .withArgs('/', 'rideCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/rides/:id', function() {

    it('should route to ride.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'rideCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/rides', function() {

    it('should route to ride.controller.create', function() {
      routerStub.post
        .withArgs('/', 'rideCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/rides/:id', function() {

    it('should route to ride.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'rideCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/rides/:id', function() {

    it('should route to ride.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'rideCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/rides/:id', function() {

    it('should route to ride.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'rideCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
