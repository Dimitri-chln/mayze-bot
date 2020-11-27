async function databaseSQL(query) {
    const pg = require("pg");
    const connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    };
    const client = new pg.Client(connectionString);

    try {
        await client.connect();
        const res = await client.query(query);
        client.end();
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports = databaseSQL;