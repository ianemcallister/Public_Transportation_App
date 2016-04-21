'use strict';

/**
 * @ngdoc overview
 * @name transitApp
 * @description
 * # transitApp
 *
 * Main module of the application.
 */
angular
  .module('transitApp', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  	$urlRouterProvider.otherwise('/');
  	
  	$stateProvider
  	.state('home', {
  			url: '/',
  			templateUrl: 'views/main.html'
  		})
  	.state('tripPlanner', {
  			url: '/trip-planner',
  			templateUrl: 'views/tripplanner.html',
  			controller: 'TripplannerCtrl as planner'
  		})
  	.state('tripSchedule', {
  			url: '/train-schedules',
  			templateUrl: 'views/trainschedule.html',
  			controller: 'TripplannerCtrl as planner'
  		})
  	.state('tripPlanner.journey', {
  			url: '/journey/:start_station/:end_station/:wkday/:time',
  			templateUrl: 'views/journey.html'
  		})  	
  	.state('tripSchedule.stops', {
  			url: '/stops/:short_name/:long_name',
  			templateUrl: 'views/stops.html'
  		})
  	.state('tripSchedule.route', {
  			url: '/route/:short_name/:long_name/:wkday/:direction/:time',
  			templateUrl: 'views/route.html'
  		});
  }]);
