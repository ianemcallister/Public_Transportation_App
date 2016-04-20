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
  	//$urlRouterProvider.otherwise('/');
  }]);
