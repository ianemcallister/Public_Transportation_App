/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/rides              ->  index
 * POST    /api/rides              ->  create
 * GET     /api/rides/:id          ->  show
 * PUT     /api/rides/:id          ->  update
 * DELETE  /api/rides/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Ride from './ride.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function fewestStops(req, res) {
  

  //declare the local variable
  var start = req.params.start;
  var end = req.params.end;
  var path = {
    stations: [start, end],
    noOfStations: 2,
    duration: 20
  };

  console.log('received start: ' + start + ' stop: ' + end);

  //build and return the promise
  return new Promise(function(resolve, reject) {

  })
  .then(function(result) {

    //for the time being just return the standard path
    resolve(path);
    

  })
  .catch(function(error) {
    console.log('Error: ' + error);
  });

}

// Gets a list of Rides
export function index(req, res) {
  return Ride.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Ride from the DB
export function show(req, res) {
  return Ride.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Ride in the DB
export function create(req, res) {
  return Ride.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Ride in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Ride.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Ride from the DB
export function destroy(req, res) {
  return Ride.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
