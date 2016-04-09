//used to build trips
module.exports = {
	stop_headsign: '',	//from stop_times.txt
	direction_id: null,	//from trips.txt
	route_id: null,		//from trips.txt
	stop_sequence: {}	//collection of tripstops with stop_sequence keys from stop_times.txt
}