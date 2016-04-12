# Public Transportation App

## Instructions
1. **Clone the repository**

	`git clone <git@github.com:ianemcallister/Public_Transportation_App.git>

2. **Install the dependencies**
	
	To install the required dependencies call `npm install` from the root directory.

3. **Load Serverside Resources

	This project utilizies a serverside component to download the GTFS.zip file from [Trimet.org](https://developer.trimet.org/GTFS.shtml), parse the csv files, then save JSON files to be used by the application.

	* To download and unzip the GTFS.zip navigate to the server file, `cd server` from the root director and run `node scripts/download`

	* After downloading build the required JSON files from ther `server` directory by running `node scripts/build`

4. **Launch the server and run the client site

	After you have build the required JSON files from the root director (you may need to `cd ..`), run `gulp serve`.

## Dependencies

This project utilizes a number of dependencies that can be thorougly expored in the package.json file.  Most notabley though...

TODO: add this later

## Credits
* Thank you to [brendannee](https://github.com/brendannee) for his [node-gtfs](https://github.com/brendannee/node-gtfs) repository.  I referenced it early on and learned a bit about dealint with GTFS files.
* I scaffolded this project using [generator-angular-fullstack](https://github.com/angular-fullstack/generator-angular-fullstack), thanks to [Andrew Koroluk](https://github.com/Awk34), [Tyler Henkel](https://github.com/DaftMonk), and [Cody Mize](https://github.com/kingcody).

## License
Copyright © 2016 Ian McAllister. This source code is licensed under the MIT license.