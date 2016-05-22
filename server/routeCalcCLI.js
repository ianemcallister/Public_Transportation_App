
var calculator = require('./api');

var coordToCheck = [
	[11500, 13712],
	[9837, 9624],
	[9299, 7606],
	[9839, 9819]
]

//loop through the trips
coordToCheck.forEach(function(pair) {

	//get the response
	calculator.getNewRoute(pair[0], pair[1]).then(function(response) {
		
		console.log(response);
		resolve(response);
	});

});
