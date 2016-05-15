'use strict';

var RouteCalculator = {
	getNewRoute: getNewRoute
}

function getNewRoute(depart, arrive) {
	console.log(depart, arrive);

	return {
        deprtTime: "3:13 PM",
        arrvTime: "3:28 PM",
        tripDuration: "17min",
        totalStops: 6,
        departureStn: {
          name: "Beaverton",
          id: "Station 2913",
          desc: "Next to McDonalds"
        },
        arrivalStn: {
          name: "Gresham",
          id: "Station 9231",
          desc: "Turn left at the stoplight"
        },
        steps: [
          {departure: {time: "3:13 PM", station:"Beaverton"}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Blue Line", eol:"Expo Center", duration:"4 min", stops:"2 stops"}, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:13 PM", station: "Pioneer Courthouse"}},
          {departure: false, ride:false, transfeer: {desc: "Change to the Yellow line"}, arrival: false},
          {departure: {time: "5:23 PM", station:"Galleria/SW 10th Ave "}, ride:false, transfeer: false, arrival: false},
          {departure: false, ride:{line:"MAX Yellow Line", eol:"Hillsboro", duration:"23 min", stops:"8 stops" }, transfeer: false, arrival: false},
          {departure: false, ride:false, transfeer: false, arrival: {time:"5:46 PM", station:"Millikan Way MAX Station"}}
        ]
    };
}

module.exports = RouteCalculator;

