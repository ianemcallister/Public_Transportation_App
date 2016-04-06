'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Train Schedules',
    'state': 'trainschedules'
  },
  {
    'title': 'Trip Planner',
    'state': 'tripplanner'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('transitApp')
  .controller('NavbarController', NavbarController);
