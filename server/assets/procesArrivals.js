
const readline = require('readline');
var fs = require('fs');

var file = 9848 + '.txt';

var rl = readline.createInterface({
	input: fs.createReadStream('./rawFiles/' + file)
});

var counting = 0;
var lineNumber = 0;
var timesArray = [];
rl.on('line', (line) => {
	console.log(line);
	console.log(line != '—');
	if(line != '—') {
		console.log('parsing');
		var hhMM = line.split(":");
		var hours = parseInt(hhMM[0]);
		var minutes = parseInt(hhMM[1][0] + hhMM[1][1]);
		var morEv = hhMM[1][2];
		if(morEv == 'a') var shift = 0;
		else if(morEv == 'p' && hours == 12) var shift = 0;
		else if(morEv == 'p' && hours < 12) var shift = 12;
		var final = hhMM[1][4];
		if(final == 'F') var add = 12;
		else var add = 0;
		var totalMinutes = ((hours + shift + add)* 60) + minutes;
		console.log('Line ' + lineNumber + ' from file:' + line + ' to ' + totalMinutes);
	} else {
		totalMinutes = null;
	}
	timesArray.push(totalMinutes);
	lineNumber++;
})
.on('close', function() {
	console.log(timesArray);
	var writable = fs.createWriteStream('./processed/' + file);
	writable.write(JSON.stringify(timesArray));
});




