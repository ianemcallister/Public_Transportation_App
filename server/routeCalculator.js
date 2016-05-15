'use strict';

var calculator = require('./routeCalculator');
//var IdBank = require('./assets/models/stopsById');
var stopsModel = require('./assets/gtfs/stopsModel');

var RouteCalculator = {
	_getStationName:_getStationName,
  _buildStationInfo: _buildStationInfo,
  getNewRoute: getNewRoute
}

function _getStationName(stnId) {

}

function _buildStationInfo(stnId) {
  return {
    name: stopsModel[stnId].name,
    id: ("Station " + stnId),
    desc: stopsModel[stnId].desc
  }
}

function getNewRoute(depart, arrive) {
	var rc = this;
  var journeyObject = {};

  console.log(depart, arrive);

  //find a route
  //build the times
  journeyObject['deprtTime'] = "3:13 PM";
  journeyObject['arrvTime'] = "3:28 PM";

  //build the duration
  journeyObject['tripDuration'] = "17min";

  //build the # of stops
  journeyObject['totalStops'] = 6;

  //build the departure station
  journeyObject['departureStn'] = rc._buildStationInfo(depart);

  //build the arrival station
  journeyObject['arrivalStn'] = rc._buildStationInfo(arrive);

  //build the steps
  journeyObject['steps'] = [
          {departure: {time: "3:13 PM", station:"Beaverton"}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:13 PM", station: "Pioneer Courthouse"}},
          {departure: false, ride:false, transfeer: {desc: "Change to the Yellow line"}, arrival: false},
          {departure: {time: "5:23 PM", station:"Galleria/SW 10th Ave "}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Yellow Line", eol:"Hillsboro", duration:"23 min", stops:"8 stops" }, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:46 PM", station:"Millikan Way MAX Station"}}
        ];

	return journeyObject;
}

module.exports = RouteCalculator;

