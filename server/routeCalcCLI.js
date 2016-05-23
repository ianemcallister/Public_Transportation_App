
var calculator = require('./api');

var coordToCheck = [
	[11500, 13712]
	//[9837, 9624],
	//[9299, 7606],
	//[9839, 9819],
	//[8337, 7618],
	//[13125, 13139],
	//[8355, 8341],
]

//loop through the trips
coordToCheck.forEach(function(pair) {

  //get the response
  calculator.getEndpointsData(pair[0], pair[1]).then(function(response) {
    
    console.log(response);
    resolve(response);
  });

});

/*
//loop through the trips
coordToCheck.forEach(function(pair) {

	//get the response
	calculator.getNewRoute(pair[0], pair[1]).then(function(response) {
		
		console.log(response);
		resolve(response);
	});

});

var aPath = [ 9837,
  '9842',
  '9839',
  '9844',
  '9835',
  '9845',
  '9834',
  '9831',
  '9830',
  '9828',
  '9822',
  '9826',
  '9824',
  '9821',
  '9969' ];

console.log(calculator._pathToRides(aPath));*/


