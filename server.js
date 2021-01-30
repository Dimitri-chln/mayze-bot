const http = require('http');
const URL = require('url');
const fs = require('fs');

http.createServer(async (request, response) => {
	const url = URL.parse(request.url, true);
	const path = url.path == '/favicon.ico'
		? 'favicon.ico'
		: 'server' + (url.path == '/' ? '/index.html' : url.path);

	fs.readFile(path, (err, buffer) => {
		if (!err) response.write(buffer);
		else {
			if (err.code === 'ENOENT') response.writeHead(404);
			response.writeHead(500);
		}

		response.end();
	});

}).listen(process.env.PORT || 5000);