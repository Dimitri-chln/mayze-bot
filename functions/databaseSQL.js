async function databaseSQL(query) {
    const pg = require("pg");
    const connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    };
    const client = new pg.Client(connectionString);

    client.connect(err => {
        if (err) {
            throw err;
        } else {
            queryDatabase(query);
        }
    });

    async function queryDatabase(query) {
        try {
            const res = await client.query(query);
            return res;
            client.disconnect();
        } catch (err) {
            console.log(err);
        }
    };
}
module.exports = databaseSQL;
