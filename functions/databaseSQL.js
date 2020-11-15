async function databaseSQL(query) {
    const pg = require("pg");
    const connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    };
    const client = new pg.Client(connectionString);

    client.connect(err => {
        if (err) throw err;
        client.query(query, (err, res) => {
            if (err)
                throw err;
            console.log(res);
            client.end();
        });
    });
    return res;
}
module.exports = databaseSQL;
