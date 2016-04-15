//
var TripPlanner = require('../lib/models/tripPlanner');

var theTripPlanner = new TripPlanner;

var result = theTripPlanner.calculateTrip(231,2831);

console.log(result);