'use strict';

var app = require('../..');
import request from 'supertest';

var newRide;

describe('Ride API:', function() {

  describe('GET /api/rides', function() {
    var rides;

    beforeEach(function(done) {
      request(app)
        .get('/api/rides')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          rides = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      rides.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/rides', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/rides')
        .send({
          name: 'New Ride',
          info: 'This is the brand new ride!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newRide = res.body;
          done();
        });
    });

    it('should respond with the newly created ride', function() {
      newRide.name.should.equal('New Ride');
      newRide.info.should.equal('This is the brand new ride!!!');
    });

  });

  describe('GET /api/rides/:id', function() {
    var ride;

    beforeEach(function(done) {
      request(app)
        .get('/api/rides/' + newRide._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          ride = res.body;
          done();
        });
    });

    afterEach(function() {
      ride = {};
    });

    it('should respond with the requested ride', function() {
      ride.name.should.equal('New Ride');
      ride.info.should.equal('This is the brand new ride!!!');
    });

  });

  describe('PUT /api/rides/:id', function() {
    var updatedRide;

    beforeEach(function(done) {
      request(app)
        .put('/api/rides/' + newRide._id)
        .send({
          name: 'Updated Ride',
          info: 'This is the updated ride!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedRide = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedRide = {};
    });

    it('should respond with the updated ride', function() {
      updatedRide.name.should.equal('Updated Ride');
      updatedRide.info.should.equal('This is the updated ride!!!');
    });

  });

  describe('DELETE /api/rides/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/rides/' + newRide._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ride does not exist', function(done) {
      request(app)
        .delete('/api/rides/' + newRide._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
