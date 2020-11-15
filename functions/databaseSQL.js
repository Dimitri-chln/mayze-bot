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
            client.query(query).then(res => {
                client.disconnect();
                return res;
            }).catch(err => console.log(err));
        };
    });
}
export default databaseSQL;
