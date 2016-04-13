/*
export default function IndexController(container) {
	//this._container = container;
	this._openSocket();
	this._registerServiceWorker();
}

IndexController.prototype._registerServiceWorker = function() {
	if(!navigator.serviceWorker) return;
	navigator.serviceWorker.register('/sw.js')
	.then(function() {
		console.log('registerd the worker!');
	})
	.catch(function() {
		console.log('it failed');
	});
};

//open a connection to the server for live updates
IndexController.prototype._openSocket = function() {
	var IndexController = this;

	//create a url pointing to /updates with the ws protocol
	var scoketUrl = new URL('/updates', window.location);
	scoketUrl.protocol = 'ws';

	var ws = new WebSocket(scoketUrl.href);

	// add listeners
	ws.addEventListner('open', function() {

	});
};*/