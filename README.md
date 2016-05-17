# Project 2: Public Transportation App

This is the second project as part of the Senior Web Developer Nano Degree through Udacity.

It is a transporation app for the Portland Oregon MAX train system.  Users can view train timetables and search routes by entering a starting station and ending station.

**Offline Capable**: This project uses service workers to provide offline functionality to users.  They are able to pull up timetables for each of the lines as long as the timetable has been cached for later use.

## Features

This project features a service worker for offline functionality and backend services.

## Instructions

1. **Clone the repository**

	`git clone <git@github.com:ianemcallister/Public_Transportation_App.git>`

2. **Install the dependencies**

	To install the required dependencies call `npm install` from the root directory.

4. **Launch the server and run the client site**

	Run `gulp serve` to serve the project up. Use port 8889 to toggle the network connection on and off to exprience offline functionality

## Dependencies

This project utilizes a number of dependencies that can be thorougly expored in the package.json file.  

## Credits
* I took a lot of different paths on this, tryied a lot of differnt tools, this is not an exhaustive list but gets started.
* Thank you to [jakearchibald](https://github.com/jakearchibald) for designing the example and putting together the tutorial.
* Thank you to [brendannee](https://github.com/brendannee) for his [node-gtfs](https://github.com/brendannee/node-gtfs) repository.  I referenced it early on and learned a bit about dealint with GTFS files.
* I scaffolded this project using [generator-angular-fullstack](https://github.com/angular-fullstack/generator-angular-fullstack), thanks to [Andrew Koroluk](https://github.com/Awk34), [Tyler Henkel](https://github.com/DaftMonk), and [Cody Mize](https://github.com/kingcody).

## License
Copyright © 2016 Ian McAllister. This source code is licensed under the MIT license.