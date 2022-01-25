// const { generateDependencyReport } = require("@discordjs/voice");
// console.log(generateDependencyReport());

const fs = require('fs');
const { google, Auth } = require('googleapis');


// Load client secrets from a local file.
fs.readFile('google.json', (err, content) => {
	if (err) return console.log('Error loading client secret file:', err);
	// Authorize a client with credentials, then call the Google Sheets API.
	authorize(JSON.parse(content), test);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {object} credentials The authorization client credentials.
 * @param {Function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const { client_email, private_key } = credentials;
	const jwtClient = new google.auth.JWT(client_email, null, private_key, [
		"https://www.googleapis.com/auth/spreadsheets.readonly",
	]);

	callback(jwtClient);
}

/**
 * @param {Auth.JWT} auth The authenticated Google OAuth client.
 */
function test(auth) {
	const sheets = google.sheets({ version: 'v4', auth });
	
	sheets.spreadsheets.values.get({
		spreadsheetId: '1XHr1EW9JCkZuIvUy-ncAuTbTP7kEZ7htnKBAH1eiSQA',
		range: 'kick-myself!C5',
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
	
		const rows = res.data.values;
		if (rows.length) {
			console.log('Name, Major:');
			// Print columns A and E, which correspond to indices 0 and 4.
			rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			});
	
		} else {
			console.log('No data found.');
		}
	});
}