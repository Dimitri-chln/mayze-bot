const Http = require('http');
const Url = require('url');
const Fs = require('fs');

Http.createServer(async (request, response) => {
	const url = Url.parse(request.url, true);
	const path = url.path == '/favicon.ico'
		? 'favicon.ico'
		: 'server' + (url.path == '/' ? '/index.html' : url.path);

	Fs.readFile(path, (err, buffer) => {
		if (!err) response.write(buffer);
		else {
			if (err.code === 'ENOENT') response.writeHead(404);
			response.writeHead(500);
		}

		response.end();
	});

}).listen(process.env.PORT || 5000);

setInterval(() => {
	Http.get("https://mayze-v2.herokuapp.com", () => {
		console.log("Pinging server...");
	});
}, 60000);