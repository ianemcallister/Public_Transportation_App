
var calculator = require('./routeCalculator');


calculator.getNewRoute(9823, 13712).then(function(response) {
	
	//console.log(response);
	resolve(response);
});
