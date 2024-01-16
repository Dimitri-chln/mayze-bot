import Util from "../../Util";
import { Client, ClientConfig } from "pg";

export default function connectDatabase() {
	const clientConfig: ClientConfig = {
		host: "localhost",
		port: 5432,
		user: "postgres",
		database: "mayze",
	};

	if (process.env.DATABASE_PASSWORD) clientConfig.password = process.env.DATABASE_PASSWORD;

	Util.database = new Client(clientConfig);

	Util.database.once("error", (err) => {
		console.error(err);
		Util.database.end().then(connectDatabase).catch(console.error);
	});

	Util.database
		.connect()
		.then(() => console.log("Connected to the database"))
		.catch(console.error);

	setTimeout(() => {
		Util.database.end().then(connectDatabase).catch(console.error);
	}, 3_600_000); // 1 hour
}
