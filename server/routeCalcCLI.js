
var calculator = require('./routeCalculator');


calculator.getNewRoute(8341, 8336).then(function(response) {
	console.log('testing');
	console.log(response);
});
