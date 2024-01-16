import Util from "../../Util";
import { Client, ClientConfig } from "pg";

export default function connectDatabase() {
	const connectionString: ClientConfig = {
		connectionString: process.env.DATABASE_URL,
	};

	Util.database = new Client({
		host: "localhost",
		port: 5432,
		user: "postgres",
		password: process.env.DATABASE_PASSWORD,
		database: "mayze"
	});

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
