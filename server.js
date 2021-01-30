const Http = require('http');
const Https = require('https');
const Url = require('url');
const Fs = require('fs');

Http.createServer(async (request, response) => {
	const url = Url.parse(request.url, true);
	const path = url.path == '/favicon.ico'
		? 'favicon.ico'
		: 'server' + (url.path == '/' ? '/index.html' : url.path);

	Fs.readFile(path, (err, data) => {
		if (err) {
			response.writeHead(404, { 'Content-Type': 'text/html' });
			return response.end('404 Not Found');
		} 
		response.writeHead(200, { 'Content-Type': getContentType(path) });
		response.write(data);
		return response.end();
	});

}).listen(process.env.PORT || 5000);

// Ping the server every 10 minutes
setInterval(() => {
	Https.get("https://mayze-v2.herokuapp.com", () => {
		console.log("Pinging server...");
	});
}, 600000);

function getContentType(fileName) {
	const ext = (fileName.match(/\..+$/) || [''])[0].replace('.', '');
	
	switch (ext) {
		case 'png': return 'image/png';
		case 'jpg': return 'image/jpg';
		case 'jpeg': return 'image/jpg';
		case 'gif': return 'image/gif';
		case 'ico': return 'image/x-icon';
		case 'html': return 'text/html';
		case 'css': return 'text/css';
		case 'js': return 'application/javascript';
		case 'json': return 'application/json';
		case 'txt': return 'text/plain';
		default: return 'application/octet-stream';
	}
}