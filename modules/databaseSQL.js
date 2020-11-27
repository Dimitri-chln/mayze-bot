async function databaseSQL(query) {
	const pg = require("pg");
	var client = createClient();

	try { await client.connect(); }
	catch (err) {
		console.log(err);
		const shellExec = require("./modules/shellExec.js");
		const result = await shellExec("heroku pg:credentials:url --app mayze-bot");
		process.env.DATABASE_URL = result.match(/postgres:.*/)[0];
		client = createClient();
		await client.connect();
	}

	const res = await client.query(query);
	client.end();
	return res;

	function createClient() {
		const connectionString = {
			connectionString: process.env.DATABASE_URL,
			ssl: true
		};
		const client = new pg.Client(connectionString);
		return client;
	}
}

module.exports = databaseSQL;