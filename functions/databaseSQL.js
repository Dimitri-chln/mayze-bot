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
            try {
                const res = client.query(query);
            } catch (err) {
                console.log(err);
            }
        }
    });
    if (res) return res;
}
module.exports = databaseSQL;
